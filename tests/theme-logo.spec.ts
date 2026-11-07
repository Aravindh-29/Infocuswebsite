import { test, expect } from "@playwright/test";
test("light default, persistent night mode and actual vendor identities", async ({
  page,
}) => {
  // Compare completed content, independent of the hero's progressive typing.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const content = await page.locator("main").innerText();
  const sources = await page
    .locator("main img")
    .evaluateAll((els) => els.map((e) => e.getAttribute("src")));
  await page.getByRole("button", { name: "Switch to night mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.locator("main").innerText()).toBe(content);
  expect(
    await page
      .locator("main img")
      .evaluateAll((els) => els.map((e) => e.getAttribute("src"))),
  ).toEqual(sources);
  await expect(page.locator(".hero-cloud-image")).toBeVisible();
  await expect(page.locator(".infocus-logo-animation")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.goto("/platforms/");
  for (const name of [
    "Microsoft Azure",
    "Amazon Web Services",
    "Oracle Cloud Infrastructure",
  ])
    await expect(
      page.locator(".platform-line").filter({ hasText: name }).locator("img"),
    ).toBeVisible();
  await page
    .locator(".platform-line")
    .filter({ hasText: "Amazon Web Services" })
    .click();
  await expect(page).toHaveURL(/platforms\/aws/);
  await expect(page.locator(".vendor-core img")).toHaveAttribute(
    "src",
    "/brands/aws.svg",
  );
  await expect(page.locator(".platform-context")).toContainText(
    "Migration priorities",
  );
  await page.goto("/services/oracle-integration-cloud/");
  await expect(page.locator("main")).toHaveClass(/brand-oracle/);
  await expect(page.locator(".vendor-core img")).toHaveAttribute(
    "src",
    "/brands/oracle.webp",
  );
  await expect(page.locator(".detail-context")).toContainText(
    "exception handling",
  );
});
test("original letters fall individually, settle and respond to playback controls", async ({
  page,
}) => {
  await page.goto("/logo-preview/");
  await page.waitForFunction(() => window.logoReady);
  await expect(page.locator("#logo-export-stage [data-letter]")).toHaveCount(7);
  const poses = await page.evaluate(() => {
    window.infocusLogo!.setLoop(false);
    window.infocusLogo!.seek(0.3);
    const letters = [
      ...document.querySelectorAll("#logo-export-stage [data-letter]"),
    ];
    const early = letters.map(
      (l) => new DOMMatrix(getComputedStyle(l).transform).m42,
    );
    window.infocusLogo!.seek(3);
    return {
      early,
      late: letters.map((l) => ({
        y: new DOMMatrix(getComputedStyle(l).transform).m42,
        opacity: getComputedStyle(l).opacity,
      })),
    };
  });
  expect(poses.early[6]).toBeLessThan(poses.early[0]);
  expect(poses.early[0]).toBeLessThan(0);
  expect(
    poses.late.every((p) => Math.abs(p.y) < 0.1 && p.opacity === "1"),
  ).toBe(true);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const before = await page
    .locator("#logo-export-stage [data-letter]")
    .first()
    .getAttribute("transform");
  await page.waitForTimeout(200);
  expect(
    await page
      .locator("#logo-export-stage [data-letter]")
      .first()
      .getAttribute("transform"),
  ).toBe(before);
  await page.getByRole("button", { name: "Use idle mode" }).click();
  await expect(
    page.locator("#logo-export-stage .infocus-wordmark"),
  ).toHaveAttribute("data-mode", "idle");
  expect(
    await page
      .locator("#logo-export-stage [data-letter]")
      .evaluateAll((els) =>
        els.every(
          (el) => new DOMMatrix(getComputedStyle(el).transform).isIdentity,
        ),
      ),
  ).toBe(true);
  await page.getByRole("button", { name: "Loop on" }).click();
  await expect(page.getByRole("button", { name: "Loop off" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
test("scroll layers recede, navigation magnifies and Oracle keeps its colour", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.waitForTimeout(1500);
  const link = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Industries", exact: true });
  await link.hover();
  await expect
    .poll(() =>
      link.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeGreaterThan(1.05);
  const next = page.locator(".chapter-panel").nth(1);
  await next.evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 210,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page
        .locator(".chapter-surface")
        .first()
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeLessThan(0.99);
  await expect(page.locator(".chapter-panel").first()).toHaveCSS(
    "position",
    "sticky",
  );
  await page.locator(".renewed-oracle").scrollIntoViewIfNeeded();
  const logo = page.locator(".renewed-oracle .vendor-core img");
  await expect(logo).toHaveCSS("mix-blend-mode", "normal");
  await expect(logo).toHaveCSS("opacity", "1");
  await page.locator(".oracle-accordion summary").nth(1).click();
  await expect(
    page.locator(".oracle-accordion details").nth(1),
  ).toHaveAttribute("open", "");
  await expect(page.locator(".oracle-accordion details").nth(1)).toContainText(
    "Oracle ERP",
  );
});
test("reduced motion is stationary and both mobile themes fit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/logo-preview/");
  expect(
    await page
      .locator("#logo-export-stage [data-letter]")
      .evaluateAll((els) =>
        els.every(
          (el) =>
            getComputedStyle(el).transform === "none" &&
            getComputedStyle(el).opacity === "1",
        ),
      ),
  ).toBe(true);
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
  await page.goto("/");
  await expect(page.locator(".chapter-panel").first()).toHaveCSS(
    "position",
    "relative",
  );
  await expect(page.locator(".hero-cloud-image")).toHaveCSS(
    "animation-name",
    "none",
  );
});
