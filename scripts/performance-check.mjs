import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const baselineDir = path.join(root, "step_archive", "lhci-baseline");
const resultsDir = path.join(root, "step_archive", "lhci-results");
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".png", "image/png"],
]);

if (!existsSync(path.join(dist, "index.html"))) {
  throw new Error("dist/index.html is missing. Run npm run build first.");
}

const serveFile = (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(dist, normalized));
  if (!filePath.startsWith(dist) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
  });
  response.end(readFileSync(filePath));
};

const chromePath =
  process.env.CHROME_PATH ??
  path.join(
    process.env.LOCALAPPDATA ?? "",
    "ms-playwright",
    "chromium-1217",
    "chrome-win64",
    "chrome.exe",
  );

const server = createServer(serveFile);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
let chrome;
let exitCode = 0;

try {
  chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"],
  });

  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    throttlingMethod: "provided",
  });

  const lhr = runnerResult.lhr;
  const categories = Object.fromEntries(
    Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
  );
  const metrics = {
    performance: categories.performance,
    accessibility: categories.accessibility,
    bestPractices: categories["best-practices"],
    seo: categories.seo,
    lcp: lhr.audits["largest-contentful-paint"].numericValue,
    cls: lhr.audits["cumulative-layout-shift"].numericValue,
    ttfb: lhr.audits["server-response-time"].numericValue,
  };
  const status =
    metrics.performance >= 90 && metrics.lcp < 2500 && metrics.cls < 0.1 && metrics.ttfb < 800
      ? "PASS"
      : "FAIL";

  const summary = {
    status,
    url,
    checkedAt: new Date().toISOString(),
    metrics,
  };

  writeFileSync(path.join(resultsDir, "lighthouse.json"), runnerResult.report);
  writeFileSync(
    path.join(baselineDir, "lighthouse-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    path.join(root, "step_archive", "outputs", "performance-check.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    path.join(root, "step_archive", "step096_lighthouse검증.md"),
    `# Step 096 Lighthouse Verification\n\n- status: ${status}\n- performance: ${metrics.performance}\n- accessibility: ${metrics.accessibility}\n- best-practices: ${metrics.bestPractices}\n- seo: ${metrics.seo}\n- lcp: ${Math.round(metrics.lcp)}ms\n- cls: ${metrics.cls}\n- ttfb: ${Math.round(metrics.ttfb)}ms\n`,
  );

  if (status !== "PASS") {
    exitCode = 1;
    process.stderr.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    process.stdout.write("Performance check PASS\n");
  }
} finally {
  if (chrome) {
    try {
      await Promise.race([
        chrome.kill(),
        new Promise((resolve) => {
          setTimeout(resolve, 2000);
        }),
      ]);
    } catch (error) {
      writeFileSync(
        path.join(root, "step_archive", "outputs", "chrome-shutdown-warning.txt"),
        `${error.message}\n`,
      );
    }
  }
  await new Promise((resolve) => server.close(resolve));
}

process.exit(exitCode);
