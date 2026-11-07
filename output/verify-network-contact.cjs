const { chromium } = require('@playwright/test');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const width of [1920, 1440, 820, 390]) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 950 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => {
        localStorage.setItem('infocus-theme', theme);
        localStorage.setItem('deepu-muted', 'true');
      }, theme);
      for (const route of ['/contact/', '/']) {
        await page.goto('http://127.0.0.1:4174' + route);
        await page.evaluate(() => document.fonts.ready);
        await page.getByRole('button', { name: 'Dismiss Deepu welcome' }).click();
        const target = page.locator(route === '/' ? '.cloud-service-network' : '.contact-hero');
        await target.screenshot({ path: `output/${route === '/' ? 'network' : 'contact-partnership'}-${width}-${theme}.png`, style: '.header, .assistant-launch, .skip-link { visibility: hidden !important; }' });
        if (route === '/') {
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: `output/network-hero-${width}-${theme}.png` });
        }
        const state = await page.evaluate(() => {
          const targets = [...document.querySelectorAll('.cloud-service-capsule, .cloud-platform-node')];
          const boxes = targets.map(el => ({ label: el.getAttribute('aria-label'), box: el.getBoundingClientRect() }));
          const overlaps = [];
          for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
            const one = boxes[a].box, two = boxes[b].box;
            if (Math.min(one.right, two.right) - Math.max(one.left, two.left) > 2 && Math.min(one.bottom, two.bottom) - Math.max(one.top, two.top) > 2) overlaps.push([boxes[a].label, boxes[b].label]);
          }
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            overlaps,
            capsules: document.querySelectorAll('.cloud-service-capsule').length,
            imageLoaded: [...document.querySelectorAll('.contact-hero img, .cloud-service-network img')].every(img => img.complete && img.naturalWidth > 0),
            breadcrumbSize: document.querySelector('.breadcrumbs') && getComputedStyle(document.querySelector('.breadcrumbs')).fontSize,
          };
        });
        results.push({ width, theme, route, errors: [...errors], ...state });
      }
      await page.close();
    }
  }
  fs.writeFileSync('output/network-contact-visual-qa.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
