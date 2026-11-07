import { test, expect, type Locator, type Page } from "@playwright/test";

const fullTurn = Math.PI * 2;
const yaw = async (globe: Locator) =>
  Number(await globe.getAttribute("data-yaw"));
const pitch = async (globe: Locator) =>
  Number(await globe.getAttribute("data-pitch"));
const angleDifference = (a: number, b: number) =>
  Math.atan2(Math.sin(a - b), Math.cos(a - b));

async function openGlobe(page: Page) {
  await page.addInitScript(() => localStorage.setItem("deepu-muted", "true"));
  await page.goto("/about/");
  await page.locator(".globe-visual").scrollIntoViewIfNeeded();
  const globe = page.locator(".webgl.globe");
  await expect(globe).toHaveAttribute("data-ready", "true");
  await expect(globe.locator("canvas")).toBeVisible();
  await expect(page.locator(".scene-fallback")).toHaveCount(0);
  await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
  await globe.scrollIntoViewIfNeeded();
  return globe;
}

async function mouseDrag(
  page: Page,
  globe: Locator,
  start: number,
  end: number,
) {
  const box = (await globe.boundingBox())!;
  const y = box.y + box.height * 0.5;
  await page.mouse.move(box.x + box.width * start, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * end, y, { steps: 18 });
  await expect(globe).toHaveAttribute("data-dragging", "true");
  await page.mouse.up();
  await expect(globe).toHaveAttribute("data-dragging", "false");
}

test("real mouse drags accumulate beyond a full revolution, reverse, and remain at the released orientation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const globe = await openGlobe(page);
  const initial = await yaw(globe);
  for (let drag = 1; drag <= 3; drag++) {
    await mouseDrag(page, globe, 0.2, 0.75);
    const expected = initial + drag * 0.55 * fullTurn;
    await expect
      .poll(async () => Math.abs((await yaw(globe)) - expected))
      .toBeLessThan(0.015);
  }
  const forward = await yaw(globe);
  expect(forward - initial).toBeGreaterThan(fullTurn + 1);
  await mouseDrag(page, globe, 0.75, 0.4);
  await expect
    .poll(async () =>
      Math.abs((await yaw(globe)) - (forward - 0.35 * fullTurn)),
    )
    .toBeLessThan(0.02);
  const released = await yaw(globe);
  expect(released).toBeLessThan(forward - 1);
  expect(released - initial).toBeGreaterThan(fullTurn);
  await page.waitForTimeout(300);
  expect(Math.abs((await yaw(globe)) - released)).toBeLessThan(0.02);
  const box = (await globe.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2);
  await page.waitForTimeout(200);
  expect(
    Math.abs((await yaw(globe)) - released),
    "hovering must not reset the manually chosen orientation",
  ).toBeLessThan(0.02);
});

test("keyboard arrows and Home control the globe while all five office selections still update and orient it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const globe = await openGlobe(page);
  await globe.focus();
  await expect(globe).toBeFocused();
  const initialYaw = await yaw(globe),
    initialPitch = await pitch(globe);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => yaw(globe)).toBeGreaterThan(initialYaw + 0.15);
  await page.keyboard.press("ArrowLeft");
  await expect
    .poll(async () => Math.abs((await yaw(globe)) - initialYaw))
    .toBeLessThan(0.01);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => pitch(globe)).toBeLessThan(initialPitch - 0.15);
  await page.keyboard.press("ArrowDown");
  await expect
    .poll(async () => Math.abs((await pitch(globe)) - initialPitch))
    .toBeLessThan(0.01);

  for (const office of [
    { city: "Newark", longitude: -75.75, address: "43 Montague" },
    { city: "Singapore", longitude: 103.85, address: "410 North Bridge" },
    {
      city: "Petaling Jaya",
      longitude: 101.64,
      address: "Leisure Commerce Square",
    },
    { city: "Guntur", longitude: 80.44, address: "Lawyers Street" },
    { city: "Hyderabad", longitude: 78.48, address: "Manjeera Trinity" },
  ]) {
    const button = page
      .locator(".office-tabs")
      .getByRole("button", { name: office.city, exact: true });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".office-tabs button[aria-pressed='true']"),
    ).toHaveCount(1);
    await expect(page.locator(".office-address h3")).toHaveText(office.city);
    await expect(page.locator(".office-address")).toContainText(office.address);
    const expectedYaw = (-office.longitude * Math.PI) / 180 - Math.PI / 2;
    await expect
      .poll(async () =>
        Math.abs(angleDifference(await yaw(globe), expectedYaw)),
      )
      .toBeLessThan(0.015);
  }
  await globe.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => pitch(globe)).toBeLessThan(-0.25);
  await page.keyboard.press("Home");
  const hyderabadYaw = (-78.48 * Math.PI) / 180 - Math.PI / 2;
  await expect
    .poll(async () => Math.abs(angleDifference(await yaw(globe), hyderabadYaw)))
    .toBeLessThan(0.01);
  await expect
    .poll(async () => Math.abs((await pitch(globe)) + 0.12))
    .toBeLessThan(0.01);
});

test("automatic rotation starts slowly by default without controls and waits after dragging or selecting an office", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const globe = await openGlobe(page);
  await expect(page.locator(".globe-motion-toggle")).toHaveCount(0);
  await expect(globe).toHaveAttribute("data-autorotating", "true");
  await page.waitForTimeout(600);
  const start = await globe.evaluate((element) => ({
    yaw: Number((element as HTMLElement).dataset.yaw),
    time: performance.now(),
  }));
  await page.waitForTimeout(1300);
  const end = await globe.evaluate((element) => ({
    yaw: Number((element as HTMLElement).dataset.yaw),
    time: performance.now(),
  }));
  const radiansPerSecond =
    (end.yaw - start.yaw) / ((end.time - start.time) / 1000);
  expect(
    radiansPerSecond,
    "roughly one revolution per 120 seconds",
  ).toBeGreaterThan((fullTurn / 120) * 0.75);
  expect(radiansPerSecond).toBeLessThan((fullTurn / 120) * 1.25);

  const box = (await globe.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
  await page.mouse.down();
  await expect(globe).toHaveAttribute("data-dragging", "true");
  await expect(globe).toHaveAttribute("data-autorotating", "false");
  const held = await yaw(globe);
  await page.waitForTimeout(350);
  expect(
    Math.abs((await yaw(globe)) - held),
    "holding the globe must stop automatic spin",
  ).toBeLessThan(0.005);
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, {
    steps: 12,
  });
  await expect.poll(async () => (await yaw(globe)) - held).toBeGreaterThan(0.8);
  await page.mouse.up();
  const releasedAt = await page.evaluate(() => performance.now());
  await expect(globe).toHaveAttribute("data-dragging", "false");
  await expect(globe).toHaveAttribute("data-autorotating", "false");
  await page.waitForTimeout(400);
  const idleYaw = await yaw(globe);
  await page.waitForTimeout(1500);
  expect(
    Math.abs((await yaw(globe)) - idleYaw),
    "the globe must remain still during its interaction grace period",
  ).toBeLessThan(0.015);
  await expect(globe).toHaveAttribute("data-autorotating", "false");
  await expect(globe).toHaveAttribute("data-autorotating", "true", {
    timeout: 3000,
  });
  expect(
    await page.evaluate((time) => performance.now() - time, releasedAt),
  ).toBeGreaterThanOrEqual(2300);
  await expect
    .poll(async () => (await yaw(globe)) - idleYaw)
    .toBeGreaterThan(0.015);

  const selectedAt = await page.evaluate(() => performance.now());
  await page
    .locator(".office-tabs")
    .getByRole("button", { name: "Newark", exact: true })
    .click();
  await expect(globe).toHaveAttribute("data-autorotating", "false");
  const newarkYaw = (75.75 * Math.PI) / 180 - Math.PI / 2;
  await expect
    .poll(async () => Math.abs(angleDifference(await yaw(globe), newarkYaw)))
    .toBeLessThan(0.01);
  const aimedYaw = await yaw(globe);
  const remainingOfficeHold = await page.evaluate(
    (time) => Math.max(0, 4500 - (performance.now() - time)),
    selectedAt,
  );
  await page.waitForTimeout(remainingOfficeHold);
  await expect(globe).toHaveAttribute("data-autorotating", "false");
  expect(Math.abs(angleDifference(await yaw(globe), aimedYaw))).toBeLessThan(
    0.01,
  );
  await expect(globe).toHaveAttribute("data-autorotating", "true", {
    timeout: 2500,
  });
  expect(
    await page.evaluate((time) => performance.now() - time, selectedAt),
  ).toBeGreaterThanOrEqual(4800);
  await expect
    .poll(async () => (await yaw(globe)) - aimedYaw)
    .toBeGreaterThan(0.015);
});

test("wheel input rotates only the focused globe, preserves page scrolling otherwise, and leaves Ctrl-wheel to the browser", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const globe = await openGlobe(page);
  await page.evaluate(() => {
    (window as any).__globeWheelEvents = [];
    document.querySelector(".webgl.globe")!.addEventListener(
      "wheel",
      (event) => {
        (window as any).__globeWheelEvents.push({
          ctrl: (event as WheelEvent).ctrlKey,
          prevented: event.defaultPrevented,
        });
      },
      { passive: true },
    );
  });
  await page.locator(".office-tabs button").first().focus();
  const initialYaw = await yaw(globe),
    initialScroll = await page.evaluate(() => scrollY);
  let box = (await globe.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => page.evaluate((before) => scrollY - before, initialScroll))
    .toBeGreaterThan(40);
  expect(Math.abs((await yaw(globe)) - initialYaw)).toBeLessThan(0.01);
  expect(
    await page.evaluate(() => (window as any).__globeWheelEvents.at(-1)),
  ).toEqual({ ctrl: false, prevented: false });

  await globe.scrollIntoViewIfNeeded();
  await globe.focus();
  await expect(globe).toBeFocused();
  box = (await globe.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  const focusedScroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect
    .poll(async () => Math.abs((await yaw(globe)) - initialYaw))
    .toBeGreaterThan(0.3);
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - focusedScroll),
  ).toBeLessThan(2);
  expect(
    await page.evaluate(() => (window as any).__globeWheelEvents.at(-1)),
  ).toEqual({ ctrl: false, prevented: true });
  await expect
    .poll(async () => Math.abs((await yaw(globe)) - (initialYaw + 0.54)))
    .toBeLessThan(0.01);
  const beforeCtrl = await yaw(globe);
  await page.keyboard.down("Control");
  try {
    await page.mouse.wheel(0, 120);
  } finally {
    await page.keyboard.up("Control");
  }
  await expect
    .poll(() => page.evaluate(() => (window as any).__globeWheelEvents.at(-1)))
    .toEqual({ ctrl: true, prevented: false });
  await page.waitForTimeout(200);
  expect(Math.abs((await yaw(globe)) - beforeCtrl)).toBeLessThan(0.01);
});

test.describe("touch and reduced motion", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });

  test("deliberate horizontal touch rotates, vertical swipes scroll, and the reduced-motion globe stays still at rest", async ({
    page,
  }) => {
    const globe = await openGlobe(page);
    await expect(globe).toHaveAttribute("data-autorotating", "false");
    await expect(page.locator(".globe-motion-toggle")).toHaveCount(0);
    await expect(globe).toHaveCSS("touch-action", "pan-y");
    await expect(globe.locator("canvas")).toHaveCSS("touch-action", "pan-y");
    const client = await page.context().newCDPSession(page);
    const swipe = async (
      from: { x: number; y: number },
      to: { x: number; y: number },
    ) => {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ ...from, id: 1 }],
      });
      for (let step = 1; step <= 12; step++) {
        await client.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            {
              x: from.x + ((to.x - from.x) * step) / 12,
              y: from.y + ((to.y - from.y) * step) / 12,
              id: 1,
            },
          ],
        });
        await page.evaluate(() => new Promise(requestAnimationFrame));
      }
      await client.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    };
    try {
      const box = (await globe.boundingBox())!;
      const initialYaw = await yaw(globe);
      const scrollBeforeHorizontal = await page.evaluate(() => scrollY);
      await swipe(
        { x: box.x + box.width * 0.2, y: box.y + box.height * 0.5 },
        { x: box.x + box.width * 0.8, y: box.y + box.height * 0.5 },
      );
      await expect(globe).toHaveAttribute("data-dragging", "false");
      await expect
        .poll(async () => (await yaw(globe)) - initialYaw)
        .toBeGreaterThan(2);
      expect(
        Math.abs((await page.evaluate(() => scrollY)) - scrollBeforeHorizontal),
      ).toBeLessThan(3);
      const settledYaw = await yaw(globe),
        settledPitch = await pitch(globe);
      await page.waitForTimeout(2800);
      await expect(globe).toHaveAttribute("data-autorotating", "false");
      expect(Math.abs((await yaw(globe)) - settledYaw)).toBeLessThan(0.001);
      expect(Math.abs((await pitch(globe)) - settledPitch)).toBeLessThan(0.001);

      const touchBox = (await globe.boundingBox())!;
      const scrollBeforeVertical = await page.evaluate(() => scrollY);
      await swipe(
        {
          x: touchBox.x + touchBox.width * 0.5,
          y: touchBox.y + touchBox.height * 0.7,
        },
        {
          x: touchBox.x + touchBox.width * 0.5,
          y: touchBox.y + touchBox.height * 0.25,
        },
      );
      await expect
        .poll(() =>
          page.evaluate((before) => scrollY - before, scrollBeforeVertical),
        )
        .toBeGreaterThan(30);
      await expect(globe).toHaveAttribute("data-dragging", "false");
      expect(Math.abs((await yaw(globe)) - settledYaw)).toBeLessThan(0.02);
      expect(
        Math.abs((await pitch(globe)) - settledPitch),
        "vertical page scrolling should not tilt the globe",
      ).toBeLessThan(0.02);
    } finally {
      await client.detach();
    }
  });
});
