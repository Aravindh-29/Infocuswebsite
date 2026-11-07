import { test, expect, type Page } from "@playwright/test";

const clouds = [
  {
    id: "oracle-cloud",
    title: "Oracle Cloud & Integration",
    logo: "/brands/oracle.webp",
  },
  {
    id: "microsoft-azure",
    title: "Microsoft Azure",
    logo: "/brands/azure.svg",
  },
  {
    id: "amazon-web-services",
    title: "Amazon Web Services",
    logo: "/brands/aws.svg",
  },
  {
    id: "google-cloud",
    title: "Google Cloud",
    logo: "/brands/google-cloud.svg",
  },
];

async function openServices(page: Page) {
  await page.goto("/services/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("deepu-muted", "true"));
});

test("Services follows Solutions and explains the complete offer with real vendor identities and native architecture", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openServices(page);
  const navigation = await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .locator(".nav-item > a")
    .allTextContents();
  expect(navigation.slice(0, 2)).toEqual(["Solutions", "Services"]);
  await expect(page.locator(".service-panel")).toHaveCount(10);
  await expect(page.locator(".service-architecture")).toHaveCount(4);
  await expect(
    page.locator(".service-architecture .vendor-brand img"),
  ).toHaveCount(4);
  for (const cloud of clouds) {
    const card = page.locator(`#${cloud.id}`);
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(
      cloud.title,
    );
    await expect(card.locator(".service-brand img")).toHaveAttribute(
      "src",
      cloud.logo,
    );
    expect(
      await card
        .locator(".service-brand img")
        .evaluate(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth > 0,
        ),
    ).toBe(true);
    await expect(card.locator(".service-copy")).toContainText(/landing zone/i);
    await expect(card.locator(".service-copy")).toContainText(
      /availability|resilien/i,
    );
    await expect(card.locator(".service-copy")).toContainText(/recovery/i);
    await expect(card.locator(".service-copy")).toContainText(/RTO\/RPO/);
    const diagram = card.getByRole("figure", {
      name: `${cloud.title}: illustrative architecture`,
    });
    await expect(diagram.locator(".architecture-lane")).toHaveCount(2);
    await expect(diagram.locator(".architecture-foundation")).toContainText(
      "Foundation & landing zone",
    );
    await expect(diagram.locator(".architecture-recovery")).toContainText(
      "Separate recovery & backups",
    );
    await expect(diagram.locator("figcaption")).toContainText(
      "Illustrative architecture.",
    );
    // The actual architecture is readable native markup; its only raster/vector
    // image is the vendor identity, rather than a flattened diagram screenshot.
    await expect(diagram.locator("img")).toHaveCount(1);
  }
  const capabilities = [
    [
      "enterprise-applications",
      /Full-stack & enterprise applications/,
      /backend services/,
      /maintenance/,
    ],
    [
      "startup-product-development",
      /Startup MVP & product development/,
      /first release/,
      /feedback/,
    ],
    [
      "websites-digital-experiences",
      /Websites & digital experiences/,
      /static/,
      /responsive/,
    ],
    [
      "mobile-applications",
      /Mobile applications/,
      /iOS and Android/,
      /backend/,
    ],
    [
      "databases-data-platforms",
      /Databases & data platforms/,
      /migration/,
      /restoration/,
    ],
    [
      "application-infrastructure-support",
      /Application & infrastructure support/,
      /functional and nontechnical/,
      /existing software/,
    ],
  ] as const;
  for (const [id, ...requirements] of capabilities)
    for (const requirement of requirements)
      await expect(page.locator(`#${id} .service-copy`)).toContainText(
        requirement,
      );
});

test("cloud project links preselect the corresponding enquiry and existing Oracle detail links still work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const cloud of clouds) {
    await openServices(page);
    const link = page.locator(`#${cloud.id} .service-card-cta`);
    await expect(link).toHaveAttribute(
      "href",
      new RegExp(`^/contact/?\\?service=${cloud.id}$`),
    );
    await link.click();
    await expect(page).toHaveURL(
      new RegExp(`/contact/?\\?service=${cloud.id}$`),
    );
    await expect(page.getByLabel("I’m interested in")).toHaveValue(cloud.title);
    await expect(
      page.getByRole("heading", { name: "Choose your focus." }),
    ).toBeVisible();
  }
  for (const detail of [
    {
      slug: "oracle-integration-cloud",
      heading: "Oracle Integration Cloud",
      label: "Oracle Integration Cloud",
    },
    {
      slug: "oracle-erp",
      heading: "Oracle ERP",
      label: "Oracle ERP expertise",
    },
  ]) {
    await openServices(page);
    await page
      .locator("#oracle-cloud .service-related")
      .getByRole("link", { name: detail.label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/services/${detail.slug}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      detail.heading,
    );
    await expect(page.locator(".vendor-core img")).toHaveAttribute(
      "src",
      "/brands/oracle.webp",
    );
  }
});

test("mobile Services fits both themes and reduced motion retains ordinary readable document flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openServices(page);
  await expect(page.locator(".services-experience")).not.toHaveAttribute(
    "data-services-stack-active",
    "true",
  );
  for (const card of await page.locator(".service-panel").all()) {
    await expect(card).toHaveCSS("position", "relative");
    await expect(card.locator(".service-surface")).toHaveCSS(
      "transform",
      "none",
    );
  }
  const content = await page.locator(".services-experience").innerText();
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (value) => (document.documentElement.dataset.theme = value),
      theme,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      theme,
    ).toBe(true);
    expect(await page.locator(".services-experience").innerText()).toBe(
      content,
    );
    const overflow = await page
      .locator(".service-surface, .service-architecture, .service-card-cta")
      .evaluateAll((elements) =>
        elements
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.left < -1 || rect.right > innerWidth + 1;
          })
          .map((el) => el.className),
      );
    expect(overflow, theme).toEqual([]);
    const finalLink = page.locator(
      "#application-infrastructure-support .service-card-cta",
    );
    await finalLink.scrollIntoViewIfNeeded();
    await expect(finalLink).toBeVisible();
  }
});

test("Services cards remain readable and overlap correctly across three effective desktop zoom layouts", async ({
  browser,
  baseURL,
}) => {
  // This models desktop zoom with the effective CSS viewport and DPR. It does
  // not change the browser's own zoom control or claim literal zoom coverage.
  for (const zoom of [1, 1.25, 2]) {
    const width = Math.round(1440 / zoom),
      height = Math.round(900 / zoom);
    const context = await browser.newContext({
      baseURL,
      viewport: { width, height },
      deviceScaleFactor: zoom,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem("deepu-muted", "true"));
    try {
      await openServices(page);
      await expect(page.locator(".services-experience")).toHaveAttribute(
        "data-services-stack-active",
        "true",
      );
      const panels = page.locator(".service-panel");
      for (const panel of await panels.all())
        await expect(panel).toHaveCSS("position", "sticky");
      const pairs = await page
        .locator(".services-stack")
        .evaluateAll((stacks) =>
          stacks.flatMap((stack) => {
            const cards = [
              ...stack.querySelectorAll<HTMLElement>(".service-panel"),
            ];
            return cards.slice(0, -1).map((card, index) => ({
              id: card.id,
              nextId: cards[index + 1].id,
              nextTop: cards[index + 1].getBoundingClientRect().top + scrollY,
            }));
          }),
        );
      const pins = await panels.evaluateAll((cards) =>
        cards.map((card) => ({
          id: card.id,
          top: parseFloat(getComputedStyle(card).top),
          height: (card as HTMLElement).offsetHeight,
          safeTop:
            document.querySelector<HTMLElement>(".header")!.offsetHeight + 14,
        })),
      );
      for (const pin of pins) {
        expect(pin.top, `${zoom}: ${pin.id}`).toBeLessThanOrEqual(
          pin.safeTop + 1,
        );
        expect(pin.top + pin.height, `${zoom}: ${pin.id}`).toBeLessThanOrEqual(
          height - 19,
        );
      }
      const unreadable = await page.evaluate(async () => {
        const selector =
          ".service-copy > h3, .service-summary, .service-point h4, .service-point p, .service-outcome p, .service-card-cta, .service-related a, .service-visual figcaption";
        const targets = [
          ...document.querySelectorAll<HTMLElement>(selector),
        ].map((el) => ({
          el,
          bottom: el.getBoundingClientRect().bottom + scrollY,
        }));
        const failures: {
          text: string;
          top: number;
          bottom: number;
          obscured: boolean;
        }[] = [];
        for (const { el, bottom } of targets) {
          window.scrollTo({
            top: Math.max(0, bottom - (innerHeight - 24)),
            behavior: "instant",
          });
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
          const box = el.getBoundingClientRect();
          const header = document
            .querySelector(".header")!
            .getBoundingClientRect();
          const hit = document.elementFromPoint(
            box.left + Math.min(16, box.width / 2),
            box.top + box.height / 2,
          );
          const obscured = !hit || !el.contains(hit);
          if (
            box.top < header.bottom + 2 ||
            box.bottom > innerHeight - 8 ||
            obscured
          )
            failures.push({
              text: el.innerText.slice(0, 80),
              top: box.top,
              bottom: box.bottom,
              obscured,
            });
        }
        return failures;
      });
      expect(unreadable, `${zoom} effective zoom`).toEqual([]);
      for (const pair of pairs) {
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: "instant" }),
          pair.nextTop - height / 2,
        );
        const previous = page.locator(`#${pair.id} .service-surface`);
        await expect
          .poll(() =>
            previous.evaluate(
              (el) => new DOMMatrix(getComputedStyle(el).transform).m11,
            ),
          )
          .toBeLessThan(0.999);
        const overlap = await page.evaluate(({ id, nextId }) => {
          const prior = document.querySelector(`#${id} .service-surface`)!;
          const nextCard = document.getElementById(nextId)!;
          const a = prior.getBoundingClientRect(),
            b = nextCard
              .querySelector(".service-surface")!
              .getBoundingClientRect();
          const top = Math.max(
            a.top,
            b.top,
            document.querySelector(".header")!.getBoundingClientRect().bottom +
              3,
          );
          const bottom = Math.min(a.bottom, b.bottom, innerHeight - 10);
          const x = (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2;
          const hit = document.elementFromPoint(x, (top + bottom) / 2);
          return {
            height: bottom - top,
            nextOnTop: !!hit && nextCard.contains(hit),
            brightness: Number(
              getComputedStyle(prior).filter.match(
                /brightness\(([\d.]+)\)/,
              )?.[1] ?? 1,
            ),
          };
        }, pair);
        expect(overlap.height, `${zoom}: ${pair.id}`).toBeGreaterThan(20);
        expect(overlap.nextOnTop, `${zoom}: ${pair.id}`).toBe(true);
        expect(overlap.brightness).toBeGreaterThanOrEqual(0.8);
        expect(overlap.brightness).toBeLessThanOrEqual(1);
      }
    } finally {
      await context.close();
    }
  }
});
