import { test, expect } from "@playwright/test";
test("light default, persistent night mode and actual vendor identities", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.goto("/platforms/");
  for (const name of [
    "Microsoft Azure",
    "Amazon Web Services",
    "Oracle Cloud Infrastructure",
  ]) {
    await expect(
      page.locator(".platform-line").filter({ hasText: name }).locator("img"),
    ).toBeVisible();
  }
  await page
    .locator(".platform-line")
    .filter({ hasText: "Amazon Web Services" })
    .click();
  await expect(page).toHaveURL(/platforms\/aws/);
  await expect(page.locator(".vendor-core img")).toHaveAttribute(
    "src",
    "/brands/aws.svg",
  );
  await page.goto("/services/oracle-integration-cloud/");
  await expect(page.locator("main")).toHaveClass(/brand-oracle/);
  await expect(page.locator(".vendor-core img")).toHaveAttribute(
    "src",
    "/brands/oracle.webp",
  );
});
test("logo draws forward, controls work and idle keeps geometry stationary", async ({
  page,
}) => {
  await page.goto("/logo-preview/");
  await page.waitForFunction(() => window.logoReady);
  const offsets = await page.evaluate(() => {
    window.infocusLogo!.setLoop(false);
    window.infocusLogo!.seek(0.2);
    const p = document.querySelector("#logo-export-stage [data-draw]")!;
    const early = parseFloat(getComputedStyle(p).strokeDashoffset);
    window.infocusLogo!.seek(2);
    return [early, parseFloat(getComputedStyle(p).strokeDashoffset)];
  });
  expect(offsets[0]).toBeGreaterThan(offsets[1]);
  expect(offsets[1]).toBeGreaterThan(0);
  await page.evaluate(() => window.infocusLogo!.seek(4));
  await expect(
    page.locator("#logo-export-stage [data-draw]").first(),
  ).toHaveCSS("stroke-dashoffset", "0px");
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const before = await page
    .locator("#logo-export-stage [data-draw]")
    .first()
    .evaluate((p) => getComputedStyle(p).strokeDashoffset);
  await page.waitForTimeout(150);
  expect(
    await page
      .locator("#logo-export-stage [data-draw]")
      .first()
      .evaluate((p) => getComputedStyle(p).strokeDashoffset),
  ).toBe(before);
  await page.getByRole("button", { name: "Use idle mode" }).click();
  await expect(
    page.locator("#logo-export-stage [data-draw]").first(),
  ).toHaveCSS("stroke-dashoffset", "0px");
  await page.getByRole("button", { name: "Loop on" }).click();
  await expect(page.getByRole("button", { name: "Loop off" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
test("reduced motion shows the complete logo and both mobile themes fit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/logo-preview/");
  await expect(
    page.locator("#logo-export-stage [data-draw]").first(),
  ).toHaveCSS("stroke-dashoffset", "0px");
  for (const path of [
    "/",
    "/platforms/",
    "/platforms/aws/",
    "/platforms/azure/",
    "/services/oracle-erp/",
    "/contact/",
  ]) {
    await page.goto(path);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path + " " + theme,
      ).toBe(true);
    }
  }
});
