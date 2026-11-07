const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch();
  const reports = [];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1152, height: 720 }, { width: 390, height: 844 }]) {
    if (process.argv[2] && viewport.width !== Number(process.argv[2])) continue;
    for (const theme of ['light', 'dark']) {
      if (process.argv[3] && theme !== process.argv[3]) continue;
      const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => {
        localStorage.setItem('infocus-theme', theme);
        localStorage.setItem('deepu-muted', 'true');
      }, theme);
      await page.goto('http://127.0.0.1:4174/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('.transformation-story')?.dataset.stackActive === 'true');
      await page.getByRole('button', { name: 'Dismiss Deepu welcome' }).click();
      const natural = await page.locator('.chapter-panel').evaluateAll(els => els.map(el => el.getBoundingClientRect().top + scrollY));
      const reading = await page.evaluate(async () => {
        const targets = [...document.querySelectorAll('.chapter-copy > .chapter-number, .chapter-copy > h3, .chapter-copy > p, .chapter-copy li, .chapter-copy > a, .chapter-copy > .chapter-result')].map(el => ({el, bottom: el.getBoundingClientRect().bottom + scrollY}));
        const failures = [];
        for (const {el, bottom} of targets) {
          scrollTo({top: Math.max(0, bottom - (innerHeight - 24)), behavior: 'instant'});
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
          const box = el.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + Math.min(16, box.width / 2), box.top + box.height / 2);
          const headerBottom = document.querySelector('.header').getBoundingClientRect().bottom;
          if (box.top < headerBottom + 2 || box.bottom > innerHeight - 8 || !hit || !el.contains(hit)) failures.push({text: el.textContent.slice(0,80), top: box.top, bottom: box.bottom, obscured: !hit || !el.contains(hit)});
        }
        return { count: targets.length, failures };
      });
      await page.evaluate(top => scrollTo({top, behavior: 'instant'}), natural[0] - 115);
      await page.waitForTimeout(650);
      const prefix = `output/journey-glass-${theme}-${viewport.width}`;
      await page.screenshot({path: `${prefix}-reading.png`});
      await page.evaluate(top => scrollTo({top, behavior: 'instant'}), natural[1] - viewport.height * .5);
      await page.waitForTimeout(750);
      const geometry = await page.evaluate(() => {
        const panels = [...document.querySelectorAll('.chapter-panel')];
        const surfaces = panels.map(el => el.querySelector('.chapter-surface'));
        const before = surfaces[0].getBoundingClientRect();
        const next = surfaces[1].getBoundingClientRect();
        const top = Math.max(before.top, next.top, document.querySelector('.header').getBoundingClientRect().bottom + 3);
        const bottom = Math.min(before.bottom, next.bottom, innerHeight - 10);
        const x = Math.max(before.left, next.left) + 20;
        const hit = document.elementFromPoint(x, (top + bottom) / 2);
        const s = getComputedStyle(surfaces[1]);
        return {
          active: document.querySelector('.transformation-story').dataset.stackActive,
          overflow: document.documentElement.scrollWidth > innerWidth,
          positions: panels.map(p => ({position: getComputedStyle(p).position, top: getComputedStyle(p).top, height:p.offsetHeight})),
          overlapHeight: bottom - top, nextOnTop: !!hit && panels[1].contains(hit),
          previousScale: new DOMMatrix(getComputedStyle(surfaces[0]).transform).m11,
          background: s.backgroundImage, backdrop: s.backdropFilter, titleColor: getComputedStyle(surfaces[1].querySelector('h3')).color,
          textColor: getComputedStyle(surfaces[1].querySelector('p')).color,
          imageLoaded: [...document.querySelectorAll('.chapter-visual > img')].every(im => im.complete && im.naturalWidth > 0)
        };
      });
      await page.screenshot({path: `${prefix}-overlap.png`});
      reports.push({viewport, theme, reading, geometry, errors});
      await page.close();
    }
  }
  await fs.writeFile(`output/journey-glass-verification${process.argv[2] ? '-repeat' : ''}.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
  await browser.close();
})().catch(error => {console.error(error); process.exit(1);});
