import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "step_archive", "outputs", "static-audit.json");
const failures = [];

const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

const listFiles = (directory) => {
  const absolute = path.join(root, directory);
  return readdirSync(absolute).flatMap((entry) => {
    const full = path.join(absolute, entry);
    const relative = path.relative(root, full);
    if (statSync(full).isDirectory()) {
      return listFiles(relative);
    }
    return [relative];
  });
};

if (!existsSync(path.join(root, "dist", "index.html"))) {
  failures.push("dist/index.html is missing. Run npm run build first.");
}

const documentShell = read("src/index.html");
if (/<style[\s>]/i.test(documentShell) || /\sstyle="/i.test(documentShell)) {
  failures.push("inline styles are not allowed in src/index.html.");
}
if (!/<script type="module" src="\/main\.js"><\/script>/.test(documentShell)) {
  failures.push("src/index.html must use the external module entry.");
}
if (/<code|<pre|<samp|<kbd/i.test(documentShell)) {
  failures.push("code presentation elements are forbidden.");
}

const tokenCss = read("src/styles/tokens.css");
if (!tokenCss.includes(":root")) {
  failures.push("tokens.css must define :root design tokens.");
}

for (const file of listFiles("src/styles").filter((item) => item.endsWith(".css"))) {
  if (file.endsWith("tokens.css")) {
    continue;
  }
  const css = read(file);
  if (/#(?:[0-9a-f]{3}){1,2}\b/i.test(css)) {
    failures.push(`${file} contains a hard-coded hex color outside tokens.css.`);
  }
  if (/Inter|Roboto|Arial/.test(css)) {
    failures.push(`${file} uses a prohibited font name.`);
  }
}

const report = {
  status: failures.length === 0 ? "PASS" : "FAIL",
  checkedAt: new Date().toISOString(),
  failures,
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Static audit PASS\n");
