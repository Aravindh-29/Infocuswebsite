import { test, expect, type Page } from "@playwright/test";

type AudioOptions = {
  autoplayAllowed?: boolean;
  unsupported?: boolean;
  blocked?: boolean;
};
async function mockAudio(page: Page, options: AudioOptions = {}) {
  await page.addInitScript(({ autoplayAllowed, unsupported, blocked }) => {
    let activated = !!autoplayAllowed;
    Object.defineProperty(navigator, "userActivation", {
      configurable: true,
      get: () => ({ hasBeenActive: activated, isActive: activated }),
    });
    for (const type of ["click", "keydown"])
      document.addEventListener(type, (event) => {
        if (event.isTrusted) activated = true;
      });
    const log = { chimes: 0, closed: 0, speechCalls: [] as string[] };
    (window as any).__deepuAudio = log;
    class AudioMock {
      state = "suspended";
      currentTime = 0;
      destination = {};
      resume() {
        if (!blocked) this.state = "running";
        return Promise.resolve();
      }
      close() {
        this.state = "closed";
        log.closed++;
        return Promise.resolve();
      }
      createOscillator() {
        return {
          frequency: { value: 0 },
          type: "sine",
          connect() {},
          disconnect() {},
          start() {
            log.chimes++;
          },
          stop() {},
          onended: null,
        };
      }
      createGain() {
        return {
          gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
          connect() {},
          disconnect() {},
        };
      }
    }
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: unsupported ? undefined : AudioMock,
    });
    Object.defineProperty(window, "webkitAudioContext", {
      configurable: true,
      value: undefined,
    });
    // Speech APIs deliberately remain available: Deepu must never even read
    // the service, choose a voice, construct an utterance, speak or cancel it.
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        constructor() {
          log.speechCalls.push("construct");
        }
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      get() {
        log.speechCalls.push("access");
        return {
          getVoices() {
            log.speechCalls.push("getVoices");
            return [];
          },
          addEventListener() {
            log.speechCalls.push("addEventListener");
          },
          removeEventListener() {
            log.speechCalls.push("removeEventListener");
          },
          speak() {
            log.speechCalls.push("speak");
          },
          cancel() {
            log.speechCalls.push("cancel");
          },
        };
      },
    });
  }, options);
}
const chimes = (page: Page) =>
  page.evaluate(() => (window as any).__deepuAudio.chimes);
const noSpeech = async (page: Page) => {
  expect(
    await page.evaluate(() => (window as any).__deepuAudio.speechCalls),
  ).toEqual([]);
};

test("Deepu plays only a local chime with the popup when playback is allowed", async ({
  page,
}) => {
  await mockAudio(page, { autoplayAllowed: true });
  await page.goto("/");
  await expect(page.locator(".deepu-welcome")).toBeVisible();
  await expect.poll(() => chimes(page)).toBe(2);
  await noSpeech(page);
});

test("Deepu opens a brief project popup on each full load without taking focus", async ({
  page,
}) => {
  await mockAudio(page);
  await page.goto("/");
  const welcome = page.getByRole("complementary", {
    name: "Welcome from Deepu",
  });
  await expect(welcome).toBeVisible();
  await expect(welcome).toContainText(
    "How can we help with your next project?",
  );
  await expect(welcome).not.toContainText(/Hi, this is Deepu|voice|greeting/i);
  await expect(page.locator(".chat")).toHaveCount(0);
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe(
    "BODY",
  );
  await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
  await expect(welcome).toHaveCount(0);
  await page.keyboard.press("Tab");
  expect(await chimes(page)).toBe(0);
  await noSpeech(page);
  await page.reload();
  await expect(welcome).toBeVisible();
  await page
    .getByRole("button", { name: "Chat with Deepu", exact: true })
    .click();
  await expect(
    page.getByRole("complementary", { name: "Deepu Infocus assistant" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Your question" }),
  ).toBeFocused();
  await expect(welcome).toHaveCount(0);
  await page
    .getByRole("button", { name: "Do you provide Oracle services?" })
    .click();
  await expect(page.locator(".message.assistant").last()).toContainText(
    "Oracle Integration Cloud",
  );
  await page
    .getByRole("button", { name: "Close assistant", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (value) => (document.documentElement.dataset.theme = value),
      theme,
    );
    await expect(page.locator(".deepu-launch .deepu-avatar img")).toBeVisible();
  }
  await noSpeech(page);
});

test("Deepu chimes once after interaction without sound controls and respects an existing muted preference", async ({
  page,
}) => {
  await mockAudio(page);
  await page.goto("/");
  const welcome = page.locator(".deepu-welcome");
  await expect(welcome).toBeVisible();
  await expect(welcome.getByRole("button")).toHaveCount(2);
  await expect(
    page.locator(".deepu-sound-controls, .deepu-sound-note"),
  ).toHaveCount(0);
  await expect(welcome).not.toContainText(/sound|replay|mute|voice/i);
  expect(await chimes(page)).toBe(0);
  await page.keyboard.press("Tab");
  await expect.poll(() => chimes(page)).toBe(2);
  await page.keyboard.press("Tab");
  expect(await chimes(page)).toBe(2);
  await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
  expect(
    await page.evaluate(() => (window as any).__deepuAudio.closed),
  ).toBeGreaterThan(0);
  await noSpeech(page);
  await page.evaluate(() => localStorage.setItem("deepu-muted", "true"));
  await page.reload();
  await expect(welcome).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await chimes(page)).toBe(0);
  await expect(welcome.getByRole("button")).toHaveCount(2);
  await noSpeech(page);
});

test("Deepu stays usable without Web Audio even when speech APIs are available", async ({
  page,
}) => {
  await mockAudio(page, { unsupported: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".deepu-welcome")).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await chimes(page)).toBe(0);
  await expect(
    page.locator(".deepu-sound-controls, .deepu-sound-note"),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Chat with Deepu", exact: true })
    .click();
  await expect(page.locator(".chat")).toBeVisible();
  expect(errors).toEqual([]);
  await noSpeech(page);
});

test("a blocked AudioContext does not claim or queue a played popup sound", async ({
  page,
}) => {
  await mockAudio(page, { autoplayAllowed: true, blocked: true });
  await page.goto("/");
  await expect(page.locator(".deepu-welcome")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__deepuAudio.closed))
    .toBeGreaterThan(0);
  await expect(
    page.locator(".deepu-sound-controls, .deepu-sound-note"),
  ).toHaveCount(0);
  expect(await chimes(page)).toBe(0);
  expect(
    await page.evaluate(() => (window as any).__deepuAudio.closed),
  ).toBeGreaterThan(0);
  await noSpeech(page);
});

test("desktop and laptop hero keeps the quote left and all nine service capsules visible on the right at default zoom", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("deepu-muted", "true"));
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
    await expect(page.locator(".cloud-service-network")).toHaveAttribute(
      "data-network-state",
      "complete",
      { timeout: 1500 },
    );
    await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
    await expect(page.locator(".cloud-service-capsule")).toHaveCount(9);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      const layout = await page.evaluate(() => {
        const rect = (selector: string) =>
          document.querySelector(selector)!.getBoundingClientRect();
        const header = rect(".header"),
          hero = rect(".immersive-hero"),
          copy = rect(".immersive-copy"),
          network = rect(".cloud-service-network");
        const targets = [
          ...document.querySelectorAll<HTMLElement>(
            ".immersive-copy h1, .immersive-copy > p, .immersive-actions a, .cloud-platform-node, .cloud-service-capsule",
          ),
        ];
        const clipped: string[] = [];
        for (const element of targets) {
          const box = element.getBoundingClientRect();
          const hit = document.elementFromPoint(
            box.left + box.width / 2,
            box.top + box.height / 2,
          );
          if (
            box.left < -1 ||
            box.right > innerWidth + 1 ||
            box.top < header.bottom - 1 ||
            box.bottom > innerHeight + 1 ||
            !hit ||
            !element.contains(hit)
          )
            clipped.push(
              element.getAttribute("aria-label") || element.innerText,
            );
        }
        const truncated: string[] = [];
        for (const line of document.querySelectorAll(".quote-typed")) {
          const range = document.createRange();
          range.selectNodeContents(line);
          const box = range.getBoundingClientRect();
          if (
            box.right > network.left + 1 ||
            box.left < -1 ||
            box.top < header.bottom - 1 ||
            box.bottom > innerHeight + 1
          )
            truncated.push(
              `Quote crosses its left-column bounds: ${line.textContent}`,
            );
        }
        for (const text of document.querySelectorAll<HTMLElement>(
          ".service-capsule-copy strong, .service-capsule-copy > span",
        )) {
          const css = getComputedStyle(text),
            box = text.getBoundingClientRect(),
            capsule = text
              .closest(".cloud-service-capsule")!
              .getBoundingClientRect();
          if (
            !text.checkVisibility({
              opacityProperty: true,
              visibilityProperty: true,
            }) ||
            text.scrollWidth > text.clientWidth + 1 ||
            text.scrollHeight > text.clientHeight + 1 ||
            css.textOverflow === "ellipsis" ||
            box.left < capsule.left - 1 ||
            box.right > capsule.right + 1 ||
            box.top < capsule.top - 1 ||
            box.bottom > capsule.bottom + 1
          )
            truncated.push(text.innerText);
        }
        return {
          scroll: scrollY,
          overflow: document.documentElement.scrollWidth > innerWidth,
          heroBottom: hero.bottom,
          sceneTop: network.top,
          sceneBottom: network.bottom,
          headerBottom: header.bottom,
          sideBySide:
            copy.left < network.left &&
            copy.right <= network.left + 1 &&
            Math.min(copy.bottom, network.bottom) >
              Math.max(copy.top, network.top),
          clipped,
          truncated,
        };
      });
      const scenario = `${width}x${height} ${theme}`;
      expect(layout.scroll, scenario).toBe(0);
      expect(layout.overflow, scenario).toBe(false);
      expect(layout.sideBySide, scenario).toBe(true);
      expect(layout.heroBottom, scenario).toBeLessThanOrEqual(height + 1);
      expect(layout.sceneTop, scenario).toBeGreaterThanOrEqual(
        layout.headerBottom - 1,
      );
      expect(layout.sceneBottom, scenario).toBeLessThanOrEqual(height + 1);
      expect(layout.clipped, scenario).toEqual([]);
      expect(layout.truncated, scenario).toEqual([]);
    }
  }
});
