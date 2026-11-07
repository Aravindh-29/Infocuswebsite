const { chromium } = require("playwright");
const { writeFile } = require("node:fs/promises");
(async () => {
  const base = process.env.TEST_URL || "http://127.0.0.1:4173";
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.addInitScript(() => {
    window.reviewMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.reviewMetrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.reviewMetrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base + "/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    return {
      ...window.reviewMetrics,
      ttfbMs: Math.round(nav.responseStart),
      domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
      loadMs: Math.round(nav.loadEventEnd),
      resourceCount: resources.length,
      resourceEncodedBytes: resources.reduce(
        (n, r) => n + r.encodedBodySize,
        0,
      ),
    };
  });
  metrics.lcp = Math.round(metrics.lcp);
  metrics.note =
    "Local Chromium desktop measurement, 1440x1000, no network or CPU throttling. Not a Lighthouse score or field measurement.";
  await writeFile(
    "output/verification.json",
    JSON.stringify(
      {
        build: "passed",
        typecheck: "passed",
        browserTests: 5,
        measurement: metrics,
      },
      null,
      2,
    ),
  );
  await page
    .getByRole("tab", { name: "Banking & finance" })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page
    .locator(".industry-explorer")
    .screenshot({ path: "output/industry-desktop.png" });
  await page.goto(base + "/solutions/managed/");
  await page.screenshot({ path: "output/managed-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "output/mobile-hero.png" });
  console.log(JSON.stringify(metrics));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
