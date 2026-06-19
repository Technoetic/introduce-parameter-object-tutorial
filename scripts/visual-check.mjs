import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const screenshots = path.join(root, "step_archive", "screenshots");
const outputs = path.join(root, "step_archive", "outputs");
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

if (!existsSync(path.join(dist, "index.html"))) {
  throw new Error("dist/index.html is missing. Run npm run build first.");
}

const serveFile = (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(dist, normalized));
  if (!filePath.startsWith(dist)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (!existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
  });
  response.end(readFileSync(filePath));
};

const server = createServer(serveFile);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/`;
const browser = await chromium.launch();
const consoleErrors = [];
const pageErrors = [];
const metrics = {};

try {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktop = await desktopContext.newPage();
  desktop.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  desktop.on("pageerror", (error) => pageErrors.push(error.message));
  await desktop.goto(url, { waitUntil: "networkidle" });
  await desktop.getByTestId("tutorial-app").waitFor();
  await desktop.screenshot({
    path: path.join(screenshots, "layout-verify-desktop-r1.png"),
    fullPage: true,
  });
  await desktop.screenshot({
    path: path.join(screenshots, "compare-impl-desktop.png"),
    fullPage: true,
  });

  await desktop.getByRole("button", { name: /도착 지역/ }).click();
  await desktop.getByRole("button", { name: /시간대/ }).click();
  await desktop.getByRole("button", { name: /주문 상태/ }).click();
  await desktop.getByRole("button", { name: /혜택 여부/ }).click();
  await desktop.getByRole("button", { name: /묶음째 보내기/ }).click();
  await desktop.screenshot({
    path: path.join(screenshots, "mouse", "bundle-sent.png"),
    fullPage: true,
  });

  await desktop.keyboard.press("Tab");
  await desktop.keyboard.press("Tab");
  await desktop.screenshot({
    path: path.join(screenshots, "keyboard", "tab-focus.png"),
    fullPage: true,
  });

  await desktop.getByRole("link", { name: "흐름", exact: true }).click();
  await desktop.getByRole("tab", { name: /3/ }).click();
  await desktop.screenshot({
    path: path.join(screenshots, "design", "lesson-flow.png"),
    fullPage: true,
  });

  await desktop.getByRole("link", { name: "확인", exact: true }).click();
  await desktop.getByRole("button", { name: /조건들을 한 묶음/ }).click();
  await desktop.screenshot({
    path: path.join(screenshots, "e2e", "quiz-feedback.png"),
    fullPage: true,
  });

  const axe = await new AxeBuilder({ page: desktop }).analyze();
  const serious = axe.violations.filter((item) => ["serious", "critical"].includes(item.impact));

  metrics.desktop = await desktop.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
      loadComplete: Math.round(navigation.loadEventEnd),
      transferSize: Math.round(navigation.transferSize),
    };
  });

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobile = await mobileContext.newPage();
  mobile.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  mobile.on("pageerror", (error) => pageErrors.push(error.message));
  await mobile.goto(url, { waitUntil: "networkidle" });
  await mobile.getByTestId("tutorial-app").waitFor();
  await mobile.screenshot({
    path: path.join(screenshots, "layout-verify-mobile-r1.png"),
    fullPage: true,
  });
  await mobile.screenshot({
    path: path.join(screenshots, "compare-impl-mobile.png"),
    fullPage: true,
  });
  await mobile.screenshot({
    path: path.join(screenshots, "grid", "mobile-grid.png"),
    fullPage: true,
  });

  const report = {
    status:
      consoleErrors.length === 0 && pageErrors.length === 0 && serious.length === 0
        ? "PASS"
        : "FAIL",
    url,
    screenshots: [
      "layout-verify-desktop-r1.png",
      "layout-verify-mobile-r1.png",
      "compare-impl-desktop.png",
      "compare-impl-mobile.png",
      "mouse/bundle-sent.png",
      "keyboard/tab-focus.png",
      "design/lesson-flow.png",
      "e2e/quiz-feedback.png",
      "grid/mobile-grid.png",
    ],
    consoleErrors,
    pageErrors,
    accessibility: {
      violations: axe.violations.length,
      seriousOrCritical: serious.length,
      details: axe.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        targets: item.nodes.map((node) => node.target.join(" ")),
      })),
    },
    metrics,
  };

  writeFileSync(path.join(outputs, "visual-check.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(
    path.join(outputs, "step090_콘솔에러.md"),
    `# Step 090 Console Sweep\n\n- status: ${consoleErrors.length === 0 && pageErrors.length === 0 ? "PASS" : "FAIL"}\n- console errors: ${consoleErrors.length}\n- page errors: ${pageErrors.length}\n`,
  );

  if (report.status !== "PASS") {
    throw new Error(JSON.stringify(report, null, 2));
  }

  process.stdout.write("Visual check PASS\n");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
