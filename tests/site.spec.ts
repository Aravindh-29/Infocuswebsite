import { test, expect } from "@playwright/test";
test("desktop interactions, images, chat and navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".hero-original").waitFor();
  await page.waitForTimeout(1800);
  await expect(page.locator("h1")).toContainText("Transforming");
  await expect(
    page.locator(".brand .infocus-logo-animation").first(),
  ).toBeVisible();
  await page.screenshot({ path: "output/home-desktop.png" });
  await page.getByRole("button", { name: "Show solutions menu" }).click();
  await expect(page.locator(".mega")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mega")).toBeHidden();
  await page.locator(".journey-steps article").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".journey-indicator strong")).toHaveText(
    "Make room for what’s next",
  );
  await page.getByRole("tab", { name: "Manufacturing" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "manufacturing business",
  );
  await page.getByRole("tab", { name: "Manufacturing" }).press("ArrowDown");
  await expect(page.getByRole("tab", { name: "Agriculture" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "Singapore", exact: true }).click();
  await expect(page.locator(".office-address")).toContainText(
    "410 North Bridge",
  );
  await expect(page.locator(".globe canvas")).toBeVisible();
  await page.getByRole("button", { name: "Open Asthara assistant" }).click();
  await page
    .getByRole("button", { name: "Do you provide Oracle services?" })
    .click();
  await expect(page.locator(".message.assistant").last()).toContainText(
    "Oracle Integration Cloud",
  );
  await page
    .getByRole("button", { name: "Close assistant", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Open Asthara assistant" }).click();
  await expect(page.locator(".message.assistant").last()).toContainText(
    "Oracle Integration Cloud",
  );
  expect(errors).toEqual([]);
});

test("WebGL failure leaves office information accessible", async ({ page }) => {
  await page.addInitScript(
    "const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return original.call(this,type,...args)}",
  );
  await page.goto("/about/");
  await page.locator(".globe-visual").scrollIntoViewIfNeeded();
  await expect(page.locator(".scene-fallback")).toContainText(
    "Connected across four countries",
  );
  await page.getByRole("button", { name: "Newark", exact: true }).click();
  await expect(page.locator(".office-address")).toContainText("43 Montague");
});
test("all major routes render and all local assets resolve", async ({
  page,
  request,
}) => {
  const routes = [
    "/",
    "/solutions/",
    "/industries/",
    "/platforms/",
    "/services/",
    "/about/",
    "/careers/",
    "/contact/",
    "/privacy/",
    ...[
      "oracle",
      "aws",
      "azure",
      "microsoft",
      "google-cloud",
      "sap",
      "salesforce",
      "openstack",
    ].map((v) => "/platforms/" + v + "/"),
    "/logo-preview/",
    "/solutions/cloud/",
    "/solutions/applications/",
    "/solutions/enterprise/",
    "/solutions/automation/",
    "/solutions/managed/",
    "/services/oracle-integration-cloud/",
    "/services/oracle-erp/",
    "/services/oracle-integration/",
    "/services/oracle-rodod/",
    "/aboutus.html/",
    "/careers.html/",
    "/jobs.html/",
    "/contact.html/",
    "/service1.html/",
    "/service2.html/",
    "/service3.html/",
    "/service4.html/",
  ];
  for (const route of routes) {
    const res = await page.goto(route);
    expect(res?.status(), route).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter(
            (im) =>
              im instanceof HTMLImageElement &&
              im.complete &&
              im.naturalWidth === 0,
          )
          .map((im) => (im as HTMLImageElement).src),
      );
    expect(broken, route).toEqual([]);
  }
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
});
test("contact prepares a truthful email draft and careers search works", async ({
  page,
}) => {
  await page.goto("/contact/");
  await page
    .getByRole("textbox", { name: "Your name" })
    .fill("Preview visitor");
  await page
    .getByRole("textbox", { name: "Work email" })
    .fill("preview@example.com");
  await page
    .getByRole("textbox", { name: "Company", exact: true })
    .fill("Preview Company");
  await page
    .getByRole("textbox", { name: "Your challenge" })
    .fill("We would like to discuss an Oracle migration.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Your enquiry is ready");
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveAttribute("href", /^mailto:hr@infocuscs.com\?subject=/);
  await page.goto("/careers/");
  await page
    .getByRole("textbox", { name: "Search career areas" })
    .fill("Database");
  await expect(page.locator(".careers-list>a")).toHaveCount(1);
  await expect(page.locator(".careers-list>a")).toContainText(
    "Database Administration",
  );
});
test("mobile layouts have no overflow and menu works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/",
    "/solutions/",
    "/industries/",
    "/services/",
    "/platforms/",
    "/about/",
    "/careers/",
    "/contact/",
    "/solutions/cloud/",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({ path: "output/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Careers", exact: true })
    .click();
  await expect(page).toHaveURL(/careers/);
  await expect(page.getByRole("navigation")).toBeHidden();
  await page.getByRole("button", { name: "Open Asthara assistant" }).click();
  await expect(page.locator(".chat")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
