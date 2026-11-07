const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const googleOnly = process.argv.includes('--google-only');
  const results = [];
  for (const size of [{ width: 1440, height: 950 }, { width: 390, height: 844 }]) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: size, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => {
        localStorage.setItem('infocus-theme', theme);
        localStorage.setItem('deepu-muted', 'true');
      }, theme);
      await page.goto('http://127.0.0.1:4174/services/');
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('button', { name: 'Dismiss Deepu welcome' }).click();
      if (!googleOnly) await page.screenshot({ path: `output/services-${size.width}-${theme}-hero.png` });
      const cards = googleOnly ? ['google-cloud'] : size.width > 1000
        ? ['oracle-cloud', 'microsoft-azure', 'amazon-web-services', 'google-cloud', 'enterprise-applications', 'application-infrastructure-support']
        : ['microsoft-azure', 'mobile-applications'];
      for (const id of cards) {
        await page.locator('#' + id).screenshot({ path: `output/services-${size.width}-${theme}-${id}.png`, style: '.header, .assistant-launch, .skip-link { visibility: hidden !important; }' });
      }
      results.push({ size, theme, errors, ...(await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        mainLandmark: !!document.querySelector('main#main'),
        headings: [...document.querySelectorAll('.service-copy h3')].map(el => el.textContent),
        cards: [...document.querySelectorAll('.service-panel')].map(el => ({
          id: el.id,
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
          font: getComputedStyle(el.querySelector('.service-point p')).fontSize,
          color: getComputedStyle(el.querySelector('.service-point p')).color,
          background: getComputedStyle(el.querySelector('.service-surface')).backgroundImage,
        })),
        brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
      }))) });
      await page.close();
    }
  }
  fs.writeFileSync(googleOnly ? 'output/services-google-final-qa.json' : 'output/services-visual-qa.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ size, theme, errors, overflow, mainLandmark, brokenImages }) => ({ size, theme, errors, overflow, mainLandmark, brokenImages })), null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
