import { test, expect } from "@playwright/test";

// These are desktop-zoom models: divide a 1440×900 CSS viewport by the zoom
// factor and use that factor as DPR. They do not manipulate browser UI zoom.
for (const zoom of [0.75, 1, 1.25, 1.5, 2]) {
  const width = Math.round(1440 / zoom);
  const height = Math.round(900 / zoom);
  test.describe(`stack at ${Math.round(zoom * 100)}% effective desktop zoom`, () => {
    test.use({
      viewport: { width, height },
      deviceScaleFactor: zoom,
      reducedMotion: "no-preference",
    });

    test("every card stays readable before the following card overlaps and recedes it", async ({
      page,
    }) => {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      // Dismiss the welcome overlay before assessing the cards underneath it.
      await page.getByRole("button", { name: "Dismiss Deepu welcome" }).click();
      const story = page.locator(".transformation-story");
      const panels = page.locator(".chapter-panel");
      await expect(story).toHaveAttribute("data-stack-active", "true");
      await expect(panels).toHaveCount(3);
      for (const panel of await panels.all())
        await expect(panel).toHaveCSS("position", "sticky");
      const naturalTops = await panels.evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().top + scrollY),
      );
      const geometry = await panels.evaluateAll((els) => {
        const safeTop =
          document.querySelector<HTMLElement>(".header")!.offsetHeight + 14;
        return els.map((el) => ({
          top: parseFloat(getComputedStyle(el).top),
          height: (el as HTMLElement).offsetHeight,
          safeTop,
          viewport: innerHeight,
        }));
      });
      for (const panel of geometry) {
        expect(Number.isFinite(panel.top)).toBe(true);
        expect(panel.top).toBeLessThanOrEqual(panel.safeTop + 1);
        expect(panel.top + panel.height).toBeLessThanOrEqual(
          panel.viewport - 19,
        );
      }

      // Read each text block at its earliest fully visible scroll position.
      // This proves lower copy and links can be reached before the next card
      // covers them, including cards taller than a zoomed viewport.
      const unreadable = await page.evaluate(async () => {
        const selector = [
          ".chapter-copy > .chapter-number",
          ".chapter-copy > h3",
          ".chapter-copy > p",
          ".chapter-copy li",
          ".chapter-copy > a",
          ".chapter-copy > .chapter-result",
        ].join(",");
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
          const headerBottom = document
            .querySelector(".header")!
            .getBoundingClientRect().bottom;
          const hit = document.elementFromPoint(
            box.left + Math.min(16, box.width / 2),
            box.top + box.height / 2,
          );
          const obscured = !hit || !el.contains(hit);
          if (
            box.top < headerBottom + 2 ||
            box.bottom > innerHeight - 8 ||
            obscured
          ) {
            failures.push({
              text: el.innerText.slice(0, 90),
              top: box.top,
              bottom: box.bottom,
              obscured,
            });
          }
        }
        return failures;
      });
      expect(unreadable).toEqual([]);

      for (let index = 0; index < 2; index++) {
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: "instant" }),
          naturalTops[index + 1] - height / 2,
        );
        await expect
          .poll(() =>
            panels
              .nth(index)
              .locator(".chapter-surface")
              .evaluate(
                (el) => new DOMMatrix(getComputedStyle(el).transform).m11,
              ),
          )
          .toBeLessThan(0.999);
        const brightness = await panels
          .nth(index)
          .locator(".chapter-surface")
          .evaluate((el) =>
            Number(
              getComputedStyle(el).filter.match(
                /brightness\(([\d.]+)\)/,
              )?.[1] ?? 1,
            ),
          );
        expect(brightness).toBeGreaterThanOrEqual(0.65);
        expect(brightness).toBeLessThanOrEqual(1);
        const overlap = await page.evaluate((i) => {
          const all = [
            ...document.querySelectorAll<HTMLElement>(".chapter-panel"),
          ];
          const previous = all[i]
            .querySelector(".chapter-surface")!
            .getBoundingClientRect();
          const next = all[i + 1]
            .querySelector(".chapter-surface")!
            .getBoundingClientRect();
          const top = Math.max(
            previous.top,
            next.top,
            document.querySelector(".header")!.getBoundingClientRect().bottom +
              3,
          );
          const bottom = Math.min(
            previous.bottom,
            next.bottom,
            innerHeight - 10,
          );
          const left = Math.max(previous.left, next.left);
          const right = Math.min(previous.right, next.right);
          const hit = document.elementFromPoint(
            (left + right) / 2,
            (top + bottom) / 2,
          );
          return {
            height: bottom - top,
            nextOnTop: !!hit && all[i + 1].contains(hit),
          };
        }, index);
        expect(overlap.height).toBeGreaterThan(20);
        expect(overlap.nextOnTop).toBe(true);
      }
    });
  });
}
