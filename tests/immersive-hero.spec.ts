import { test, expect, type Locator } from "@playwright/test";

const headline = "Behind every bold dream, a world of possibility.";
const platforms = [
  { name: "Oracle", slug: "oracle" },
  { name: "Amazon Web Services", slug: "aws" },
  { name: "Microsoft Azure", slug: "azure" },
  { name: "Google Cloud", slug: "google-cloud" },
] as const;
const yaw = (scene: Locator) =>
  scene.evaluate((el) =>
    getComputedStyle(el).getPropertyValue("--user-yaw").trim(),
  );

test("cloud platforms pulse one at a time in the Oracle, Azure, AWS and Google Cloud sequence", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".cloud-universe-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".cloud-universe")).toHaveAttribute(
    "data-active",
    "true",
  );
  const sequence = await page.evaluate(async () => {
    const nodes = [
      ".node-oracle",
      ".node-azure",
      ".node-aws",
      ".node-google",
    ].map((selector) => document.querySelector<HTMLElement>(selector)!);
    const animations = nodes.map((el) =>
      el
        .getAnimations()
        .find(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === "cloud-node-pulse",
        )!,
    );
    const config = nodes.map((el) => {
      const css = getComputedStyle(el);
      return {
        name: css.animationName,
        duration: css.animationDuration,
        delay: css.animationDelay,
        iterations: css.animationIterationCount,
      };
    });
    const samples: number[][] = [];
    for (const time of [1500, 4500, 7500, 10500]) {
      animations.forEach((animation) => {
        animation.pause();
        animation.currentTime = time;
      });
      await new Promise(requestAnimationFrame);
      samples.push(nodes.map((el) => parseFloat(getComputedStyle(el).scale)));
    }
    return { config, samples };
  });
  expect(sequence.config.map((item) => item.delay)).toEqual([
    "0s",
    "-9s",
    "-6s",
    "-3s",
  ]);
  for (const item of sequence.config) {
    expect(item.name).toBe("cloud-node-pulse");
    expect(item.duration).toBe("12s");
    expect(item.iterations).toBe("infinite");
  }
  sequence.samples.forEach((scales, active) =>
    scales.forEach((scale, index) =>
      expect(scale).toBeCloseTo(index === active ? 1.24 : 1, 3),
    ),
  );
});

test("immersive hero exposes the complete headline and contains its flashes inside the cloud mask", async ({
  page,
}) => {
  await page.goto("/");
  const heading = page.locator(".immersive-hero h1");
  await expect(heading).toHaveAccessibleName(headline);
  await expect(page.locator(".cloud-universe")).toHaveAttribute(
    "data-reduced-motion",
    "false",
  );
  await expect(heading).toHaveAttribute("data-typing-state", "complete");
  await expect(page.locator(".hero-cloud-image")).toBeVisible();
  await expect(page.getByText("Drag to explore", { exact: false })).toHaveCount(
    0,
  );
  await expect(
    page.locator(".hero-original, .infocus-logo-animation"),
  ).toHaveCount(0);

  const maskedEnergy = page.locator(".cloud-inner-energy");
  await expect(maskedEnergy).toHaveCount(1);
  const mask = await maskedEnergy.evaluate((el) => {
    const reference = el.getAttribute("mask") || "";
    const id = reference.match(/url\(#([^)]*)\)/)?.[1];
    const maskElement = id ? document.getElementById(id) : null;
    return {
      reference,
      tag: maskElement?.tagName.toLowerCase(),
      imageCount: maskElement?.querySelectorAll("image").length || 0,
      flashesInside: el.querySelectorAll(".cloud-inner-flash").length,
    };
  });
  expect(mask.reference).toMatch(/^url\(#[^)]+\)$/);
  expect(mask.tag).toBe("mask");
  expect(mask.imageCount).toBeGreaterThan(0);
  expect(mask.flashesInside).toBeGreaterThan(0);

  const spin = page.locator(".cloud-main-spin");
  await expect(spin).toHaveCSS("animation-name", "cloud-full-turn");
  await expect(spin).toHaveCSS("animation-duration", "60s");
  await expect(spin).toHaveCSS("animation-timing-function", "linear");
  await expect(spin).toHaveCSS("animation-iteration-count", "infinite");
  const turns = await spin.evaluate((el) => {
    const animation = el
      .getAnimations()
      .find(
        (item) =>
          item instanceof CSSAnimation &&
          item.animationName === "cloud-full-turn",
      );
    const frames =
      (animation?.effect as KeyframeEffect | null)?.getKeyframes() || [];
    return frames.map((frame) => ({
      offset: frame.computedOffset,
      transform: frame.transform,
    }));
  });
  expect(turns).toEqual([
    { offset: 0, transform: "rotateY(0deg)" },
    { offset: 1, transform: "rotateY(360deg)" },
  ]);
  await expect(spin.locator(".cloud-main-art")).toHaveCount(1);
  await expect(
    spin.locator(".cloud-platform-node, .cloud-pedestal"),
  ).toHaveCount(0);
});

test("all four platform nodes open their corresponding platform pages", async ({
  page,
}) => {
  // Freeze orbital presentation so route verification does not sample moving hit targets.
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const platform of platforms) {
    await page.goto("/");
    const link = page.getByRole("link", {
      name: "Explore " + platform.name,
      exact: true,
    });
    await expect(link).toHaveAttribute(
      "href",
      new RegExp("^/platforms/" + platform.slug + "/?$"),
    );
    await link.click();
    await expect(page).toHaveURL(
      new RegExp("/platforms/" + platform.slug + "/?$"),
    );
    await expect(page.locator(".vendor-page h1")).toBeVisible();
  }
});

test("the cloud scene and each platform node are usable from the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator(".cloud-universe");
  const stage = page.locator(".cloud-universe-stage");
  await stage.focus();
  await expect(stage).toBeFocused();
  const initialYaw = await yaw(scene);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => yaw(scene)).not.toBe(initialYaw);
  await page.keyboard.press("Home");
  await expect.poll(() => yaw(scene)).toBe("0deg");

  const visited = new Set<string>();
  for (let i = 0; i < 30 && visited.size < platforms.length; i++) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-label") || "",
    );
    if (platforms.some((platform) => label === "Explore " + platform.name))
      visited.add(label);
  }
  expect([...visited].sort()).toEqual(
    platforms.map((platform) => "Explore " + platform.name).sort(),
  );
  const oracle = page.getByRole("link", {
    name: "Explore Oracle",
    exact: true,
  });
  await oracle.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/platforms\/oracle\/?$/);
});

test("dragging changes the cloud pose without following a platform link and can be reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator(".cloud-universe");
  const stage = page.locator(".cloud-universe-stage");
  const spin = page.locator(".cloud-main-spin");
  const art = page.locator(".cloud-main-art");
  await stage.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-active", "true");
  await expect(spin).toHaveCSS("animation-play-state", "running");
  const start = await stage.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const candidates = [
      [0.5, 0.5],
      [0.5, 0.65],
      [0.42, 0.35],
      [0.6, 0.6],
    ];
    for (const [xRatio, yRatio] of candidates) {
      const x = box.left + box.width * xRatio;
      const y = Math.max(
        box.top + 25,
        Math.min(box.top + box.height * yRatio, innerHeight - 100),
      );
      const hit = document.elementFromPoint(x, y);
      if (hit && el.contains(hit) && !hit.closest("a,button")) return { x, y };
    }
    throw new Error("No unobstructed drag point in the visible cloud stage");
  });
  const initialYaw = parseFloat(await yaw(scene));
  const initialArtTransform = await art.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  const initialWorldTransform = await page
    .locator(".cloud-universe-world")
    .evaluate((el) => getComputedStyle(el).transform);
  const originalURL = page.url();
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 150, start.y - 35, { steps: 12 });
  await expect(scene).toHaveAttribute("data-dragging", "true");
  await expect(spin).toHaveCSS("animation-play-state", "paused");
  await expect
    .poll(async () => parseFloat(await yaw(scene)) - initialYaw)
    .toBeGreaterThan(14);
  await expect
    .poll(() => art.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(initialArtTransform);
  await page.mouse.move(start.x - 150, start.y - 35, { steps: 18 });
  await expect
    .poll(async () => parseFloat(await yaw(scene)) - initialYaw)
    .toBeLessThan(-14);
  await expect(spin).toHaveCSS("animation-play-state", "paused");
  expect(
    await page
      .locator(".cloud-universe-world")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(initialWorldTransform);
  await page.mouse.up();
  await expect(scene).toHaveAttribute("data-dragging", "false");
  await expect(spin).toHaveCSS("animation-play-state", "running");
  expect(page.url()).toBe(originalURL);
  await page
    .getByRole("button", { name: "Reset cloud view", exact: true })
    .click();
  await expect.poll(() => yaw(scene)).toBe("0deg");
});

test("reduced motion shows the full headline and keeps the cloud scene stationary", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const heading = page.locator(".immersive-hero h1");
  await expect(heading).toHaveAccessibleName(headline);
  await expect(heading).toHaveAttribute("data-typing-state", "complete");
  const scene = page.locator(".cloud-universe");
  const rotatingArt = page.locator(".cloud-main-spin, .cloud-main-art");
  await expect(page.locator(".cloud-main-spin")).toHaveCSS(
    "animation-name",
    "none",
  );
  const initialYaw = await yaw(scene);
  const initialTransforms = await rotatingArt.evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).transform),
  );
  await page.locator(".cloud-universe-stage").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(250);
  expect(await yaw(scene)).toBe(initialYaw);
  expect(
    await rotatingArt.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).transform),
    ),
  ).toEqual(initialTransforms);
  expect(
    await page
      .locator(".cloud-inner-flash")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).animationName === "none"),
      ),
  ).toBe(true);
  for (const platform of platforms)
    await expect(
      page.getByRole("link", { name: "Explore " + platform.name, exact: true }),
    ).toBeVisible();
});

test("immersive hero fits mobile in both colour modes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    await page
      .getByRole("button", {
        name:
          theme === "light" ? "Switch to light mode" : "Switch to night mode",
      })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator(".immersive-hero h1")).toHaveAccessibleName(
      headline,
    );
    await expect(page.locator(".hero-cloud-image")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const platform of platforms)
      await expect(
        page.getByRole("link", {
          name: "Explore " + platform.name,
          exact: true,
        }),
      ).toBeVisible();
  }
});
