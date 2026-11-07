import { test, expect, type Page } from "@playwright/test";

const services = [
  {
    id: "application-development",
    label: "Application Development",
    href: "/services#enterprise-applications",
  },
  {
    id: "application-support",
    label: "Application Support",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "oracle-integration",
    label: "Oracle Integration & Support",
    href: "/services#oracle-cloud",
  },
  {
    id: "enterprise-support",
    label: "Enterprise Application Support",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "custom-software",
    label: "Custom Software Development",
    href: "/services#enterprise-applications",
  },
  {
    id: "software-maintenance",
    label: "Software Support & Maintenance",
    href: "/contact?service=application-infrastructure-support",
  },
  {
    id: "infrastructure-build",
    label: "Infrastructure Build & Automation",
    href: "/services#microsoft-azure",
  },
  {
    id: "infrastructure-support",
    label: "Infrastructure Support & Operations",
    href: "/services#application-infrastructure-support",
  },
  {
    id: "enterprise-hosting",
    label: "Enterprise Application Hosting",
    href: "/services#amazon-web-services",
  },
];
const platforms = [
  { name: "Oracle", slug: "oracle" },
  { name: "Microsoft Azure", slug: "azure" },
  { name: "Amazon Web Services", slug: "aws" },
  { name: "Google Cloud", slug: "google-cloud" },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("deepu-muted", "true"));
});

async function dismissWelcome(page: Page) {
  await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
}

test("the network actually draws its branch before the outline, icon and text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    const trace: {
      phase: string;
      line: number;
      lineLength: number;
      outline: number;
      outlineLength: number;
      icon: number;
      text: number;
    }[] = [];
    (window as any).__networkTrace = trace;
    const sample = () => {
      const card = document.querySelector(
        ".cloud-service-capsule[data-service-id='application-development']",
      );
      const line = document.querySelector(
        ".service-branch-path[data-service-id='application-development']",
      );
      const outline = card?.querySelector(".service-capsule-outline");
      const icon = card?.querySelector(".service-capsule-icon");
      const copy = card?.querySelector(".service-capsule-copy");
      if (
        document
          .querySelector(".cloud-service-network")
          ?.getAttribute("data-network-state") === "drawing" &&
        card &&
        line &&
        outline &&
        icon &&
        copy
      ) {
        const lineCSS = getComputedStyle(line),
          outlineCSS = getComputedStyle(outline);
        trace.push({
          phase: card.getAttribute("data-phase") || "",
          line: parseFloat(lineCSS.strokeDashoffset),
          lineLength: parseFloat(lineCSS.strokeDasharray),
          outline: parseFloat(outlineCSS.strokeDashoffset),
          outlineLength: parseFloat(outlineCSS.strokeDasharray),
          icon: Number(getComputedStyle(icon).opacity),
          text: Number(getComputedStyle(copy).opacity),
        });
        if (
          card.getAttribute("data-phase") === "complete" ||
          trace.length > 1200
        )
          return;
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto("/");
  const network = page.locator(".cloud-service-network");
  await page.locator(".cloud-service-core").scrollIntoViewIfNeeded();
  await expect(network).toHaveAttribute("data-network-state", "complete", {
    timeout: 20000,
  });
  const trace = await page.evaluate(
    () =>
      (window as any).__networkTrace as {
        phase: string;
        line: number;
        lineLength: number;
        outline: number;
        outlineLength: number;
        icon: number;
        text: number;
      }[],
  );
  const drawingLine = trace.findIndex(
    (sample) =>
      sample.phase === "line" &&
      sample.line > 0 &&
      sample.line < sample.lineLength * 0.95 &&
      sample.outline >= sample.outlineLength * 0.99 &&
      sample.icon === 0 &&
      sample.text === 0,
  );
  const drawingOutline = trace.findIndex(
    (sample) =>
      sample.phase === "outline" &&
      Math.abs(sample.line) < 0.1 &&
      sample.outline > 0 &&
      sample.outline < sample.outlineLength * 0.95 &&
      sample.icon === 0 &&
      sample.text === 0,
  );
  const showingIcon = trace.findIndex(
    (sample) =>
      sample.phase === "icon" &&
      Math.abs(sample.outline) < 0.1 &&
      sample.icon > 0 &&
      sample.text === 0,
  );
  const showingText = trace.findIndex(
    (sample) =>
      sample.phase === "text" && sample.icon >= 0.99 && sample.text > 0,
  );
  const phaseSamples = [
    "waiting",
    "line",
    "outline",
    "icon",
    "text",
    "complete",
  ].map((phase) => {
    const samples = trace.filter((sample) => sample.phase === phase);
    return {
      phase,
      count: samples.length,
      middle: samples[Math.floor(samples.length / 2)],
    };
  });
  expect(
    drawingLine,
    `progressive line dash sample: ${JSON.stringify(phaseSamples)}`,
  ).toBeGreaterThanOrEqual(0);
  expect(drawingOutline, "outline follows the completed line").toBeGreaterThan(
    drawingLine,
  );
  expect(showingIcon, "icon follows the completed outline").toBeGreaterThan(
    drawingOutline,
  );
  expect(showingText, "text appears after the icon").toBeGreaterThan(
    showingIcon,
  );
  await expect(
    page.locator(".cloud-service-capsule[data-phase='complete']"),
  ).toHaveCount(9);
  for (const card of await page.locator(".cloud-service-capsule").all()) {
    await expect(card.locator(".service-capsule-icon")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(card.locator(".service-capsule-copy")).toHaveCSS(
      "opacity",
      "1",
    );
  }
  const pulseCollisions = await page.evaluate(async () => {
    const nodes = [
      ...document.querySelectorAll<HTMLElement>(".cloud-platform-node"),
    ];
    const cards = [
      ...document.querySelectorAll<HTMLElement>(".cloud-service-capsule"),
    ];
    const animations = nodes.map((node) =>
      node
        .getAnimations()
        .find(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === "cloud-node-pulse",
        ),
    );
    const collisions: string[] = [];
    for (const time of [1500, 4500, 7500, 10500]) {
      animations.forEach((animation) => {
        if (animation) {
          animation.pause();
          animation.currentTime = time;
        }
      });
      await new Promise(requestAnimationFrame);
      for (const node of nodes)
        for (const card of cards) {
          const a = node.getBoundingClientRect(),
            b = card.getBoundingClientRect();
          if (
            Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2
          )
            collisions.push(
              `${time}: ${node.getAttribute("aria-label")} / ${card.dataset.serviceId} (${(Math.min(a.right, b.right) - Math.max(a.left, b.left)).toFixed(1)} × ${(Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)).toFixed(1)}px overlap)`,
            );
        }
    }
    return collisions;
  });
  expect(
    pulseCollisions,
    "platform pulse peaks must clear service capsules",
  ).toEqual([]);
});

test("all nine services retain their text, icons and working destinations alongside the four platform links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const service of services) {
    await page.goto("/");
    await expect(page.locator(".cloud-service-network")).toHaveAttribute(
      "data-network-state",
      "complete",
      { timeout: 1500 },
    );
    await dismissWelcome(page);
    const card = page.locator(
      `.cloud-service-capsule[data-service-id='${service.id}']`,
    );
    await expect(card.locator(".service-capsule-copy strong")).toHaveText(
      service.label,
    );
    await expect(card.locator(".service-capsule-copy > span")).not.toBeEmpty();
    await expect(
      card.locator(".service-capsule-icon svg, .service-capsule-icon img"),
    ).toHaveCount(1);
    const target = new URL((await card.getAttribute("href"))!, page.url());
    const expected = new URL(service.href, page.url());
    expect(target.pathname.replace(/\/$/, "")).toBe(expected.pathname);
    expect(target.search + target.hash).toBe(expected.search + expected.hash);
    await card.click();
    await expect
      .poll(() => new URL(page.url()).pathname.replace(/\/$/, ""))
      .toBe(expected.pathname);
    if (expected.hash) {
      await expect.poll(() => new URL(page.url()).hash).toBe(expected.hash);
      await expect(page.locator(expected.hash)).toBeVisible();
    } else {
      await expect(page.getByLabel("I’m interested in")).toHaveValue(
        "Application & infrastructure support",
      );
    }
  }
  await page.goto("/");
  for (const platform of platforms) {
    const link = page.getByRole("link", {
      name: `Explore ${platform.name}`,
      exact: true,
    });
    await expect(link).toHaveAttribute(
      "href",
      new RegExp(`^/platforms/${platform.slug}/?$`),
    );
    await expect(link.locator(".vendor-brand img")).toHaveCount(1);
  }
});

test("all desktop platform pulse peaks clear the nine capsules and stay within the visible hero", async ({
  page,
}) => {
  for (const [width, height] of [
    [1920, 870],
    [1536, 695],
    [1440, 790],
    [1366, 640],
    [1280, 720],
    [1024, 768],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Keyboard access intentionally completes construction immediately; the
    // first test independently verifies the full real drawing sequence.
    await page.keyboard.press("Tab");
    await page.locator(".cloud-service-capsule").first().focus();
    await expect(page.locator(".cloud-service-network")).toHaveAttribute(
      "data-network-state",
      "complete",
    );
    await dismissWelcome(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const failures = await page.evaluate(async () => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>(".cloud-platform-node"),
      ];
      const cards = [
        ...document.querySelectorAll<HTMLElement>(".cloud-service-capsule"),
      ];
      const animations = nodes.map((node) =>
        node
          .getAnimations()
          .find(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.animationName === "cloud-node-pulse",
          ),
      );
      const failures: string[] = [];
      if (animations.some((animation) => !animation))
        return ["A platform pulse animation is missing"];
      for (const time of [1500, 4500, 7500, 10500]) {
        animations.forEach((animation) => {
          animation!.pause();
          animation!.currentTime = time;
        });
        await new Promise(requestAnimationFrame);
        const headerBottom = document
          .querySelector(".header")!
          .getBoundingClientRect().bottom;
        for (const target of [...nodes, ...cards]) {
          const box = target.getBoundingClientRect();
          if (
            box.left < -1 ||
            box.right > innerWidth + 1 ||
            box.top < headerBottom - 1 ||
            box.bottom > innerHeight + 1
          )
            failures.push(
              `${time}: clipped ${target.getAttribute("aria-label")}`,
            );
        }
        for (const node of nodes)
          for (const card of cards) {
            const a = node.getBoundingClientRect(),
              b = card.getBoundingClientRect();
            const horizontal =
                Math.min(a.right, b.right) - Math.max(a.left, b.left),
              vertical = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (horizontal > 2 && vertical > 2)
              failures.push(
                `${time}: ${node.getAttribute("aria-label")} overlaps ${card.dataset.serviceId} by ${horizontal.toFixed(1)}×${vertical.toFixed(1)}px`,
              );
          }
      }
      return failures;
    });
    expect(failures, `${width}×${height}`).toEqual([]);
  }
});

test("completed network cards do not collide and remain reachable at desktop, tablet and mobile widths in both themes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [1440, 1000],
    [1920, 1080],
    [390, 844],
    [820, 1180],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".cloud-service-network")).toHaveAttribute(
      "data-network-state",
      "complete",
      { timeout: 1500 },
    );
    await dismissWelcome(page);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      await expect(
        page.locator(".cloud-service-capsule[data-phase='complete']"),
      ).toHaveCount(9);
      const layout = await page.evaluate(async () => {
        const nodes = [
          ...document.querySelectorAll<HTMLElement>(
            ".cloud-service-capsule, .cloud-platform-node",
          ),
        ];
        const boxes = nodes.map((node) => ({
          name:
            node.getAttribute("data-service-id") ||
            node.getAttribute("aria-label"),
          rect: node.getBoundingClientRect(),
        }));
        const collisions: string[] = [];
        for (let i = 0; i < boxes.length; i++)
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i].rect,
              b = boxes[j].rect;
            if (
              Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2
            )
              collisions.push(`${boxes[i].name} / ${boxes[j].name}`);
          }
        const clipped: string[] = [];
        for (const node of nodes) {
          const before = node.getBoundingClientRect();
          const header = document
            .querySelector(".header")!
            .getBoundingClientRect();
          window.scrollTo({
            top:
              before.top +
              scrollY -
              Math.max(header.height + 20, (innerHeight - before.height) / 2),
            behavior: "instant",
          });
          await new Promise(requestAnimationFrame);
          const box = node.getBoundingClientRect();
          const hit = document.elementFromPoint(
            box.left + box.width / 2,
            box.top + box.height / 2,
          );
          if (
            box.left < -1 ||
            box.right > innerWidth + 1 ||
            box.top < header.bottom ||
            box.bottom > innerHeight ||
            !hit ||
            !node.contains(hit)
          )
            clipped.push(
              node.getAttribute("data-service-id") ||
                node.getAttribute("aria-label") ||
                "unknown",
            );
        }
        return {
          collisions,
          clipped,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(layout, `${width}px ${theme}`).toEqual({
        collisions: [],
        clipped: [],
        overflow: false,
      });
    }
  }
});

test("offscreen construction pauses, drag leaves service links stationary and client navigation cleans up the network", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const network = page.locator(".cloud-service-network");
  await page.locator(".cloud-service-core").scrollIntoViewIfNeeded();
  await expect(network).toHaveAttribute("data-active", "true");
  await expect(network).toHaveAttribute("data-network-state", "drawing");
  await page.locator(".footer").scrollIntoViewIfNeeded();
  await expect(network).toHaveAttribute("data-active", "false");
  const state = () =>
    page
      .locator(
        ".service-branch-path, .service-capsule-outline, .service-capsule-icon, .service-capsule-copy",
      )
      .evaluateAll((elements) =>
        elements.map((el) => {
          const css = getComputedStyle(el);
          return [css.strokeDashoffset, css.opacity];
        }),
      );
  const paused = await state();
  await page.waitForTimeout(250);
  expect(await state()).toEqual(paused);
  await page.locator(".cloud-service-core").scrollIntoViewIfNeeded();
  await expect(network).toHaveAttribute("data-network-state", "complete", {
    timeout: 20000,
  });
  await dismissWelcome(page);
  const stage = page.locator(".cloud-universe-stage");
  await stage.scrollIntoViewIfNeeded();
  const point = await stage.evaluate((element) => {
    const box = element.getBoundingClientRect();
    for (const [xRatio, yRatio] of [
      [0.5, 0.5],
      [0.5, 0.65],
      [0.42, 0.35],
      [0.6, 0.6],
    ]) {
      const x = box.left + box.width * xRatio,
        y = Math.min(box.top + box.height * yRatio, innerHeight - 100);
      const hit = document.elementFromPoint(x, y);
      if (hit && element.contains(hit) && !hit.closest("a,button"))
        return { x, y };
    }
    throw new Error("Cloud has no unobstructed drag point");
  });
  const positions = () =>
    page.locator(".cloud-service-capsule").evaluateAll((elements) =>
      elements.map((el) => {
        const box = el.getBoundingClientRect();
        return [box.left, box.top + scrollY];
      }),
    );
  const before = await positions();
  const url = page.url();
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x + 100, point.y, { steps: 8 });
  await expect(page.locator(".cloud-universe")).toHaveAttribute(
    "data-dragging",
    "true",
  );
  await expect
    .poll(() =>
      page
        .locator(".cloud-universe")
        .evaluate((el) =>
          parseFloat(getComputedStyle(el).getPropertyValue("--user-yaw")),
        ),
    )
    .toBeGreaterThan(14);
  await page.mouse.up();
  expect(await positions()).toEqual(before);
  expect(page.url()).toBe(url);
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services\/?$/);
  await expect(network).toHaveCount(0);
  await page
    .locator(".header")
    .getByRole("link", { name: "Infocus home" })
    .click();
  await expect(network).toHaveCount(1);
  await expect(page.locator(".cloud-service-capsule")).toHaveCount(9);
  expect(errors).toEqual([]);
});

test("Contact shows the partnership image responsively and breadcrumbs use larger bold text with real arrow separators", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact/");
    await dismissWelcome(page);
    const image = page.locator(".contact-hero .contact-partnership img");
    await expect(image).toHaveAttribute(
      "src",
      "/images/contact-partnership.png",
    );
    await expect(image).toBeVisible();
    expect(
      await image.evaluate(
        (element) =>
          (element as HTMLImageElement).complete &&
          (element as HTMLImageElement).naturalWidth > 0,
      ),
    ).toBe(true);
    const breadcrumb = page.getByRole("navigation", {
      name: "Breadcrumb",
      exact: true,
    });
    await expect(breadcrumb.locator("[aria-current='page']")).toContainText(
      /Contact/i,
    );
    expect(
      await breadcrumb
        .getByRole("link", { name: "Home", exact: true })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(width === 390 ? 16 : 17);
    expect(
      await breadcrumb
        .getByRole("link", { name: "Home", exact: true })
        .evaluate((el) => Number(getComputedStyle(el).fontWeight)),
    ).toBeGreaterThanOrEqual(600);
    expect(
      await breadcrumb
        .locator("[aria-current='page']")
        .evaluate((el) => Number(getComputedStyle(el).fontWeight)),
    ).toBeGreaterThanOrEqual(700);
    await expect(breadcrumb.locator(".breadcrumb-separator")).toHaveCount(
      (await breadcrumb.locator("li").count()) - 1,
    );
    for (const separator of await breadcrumb
      .locator(".breadcrumb-separator")
      .all()) {
      await expect(separator).toHaveAttribute("aria-hidden", "true");
      await expect(separator).toHaveAttribute("focusable", "false");
      await expect(separator).toHaveAttribute("width", "18");
    }
    expect(await breadcrumb.innerText()).not.toContain("/");
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      const geometry = await image.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          width: box.width,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry.left, `${width} ${theme}`).toBeGreaterThanOrEqual(0);
      expect(geometry.right).toBeLessThanOrEqual(width);
      expect(geometry.width).toBeGreaterThan(100);
      expect(geometry.overflow).toBe(false);
    }
  }
});
