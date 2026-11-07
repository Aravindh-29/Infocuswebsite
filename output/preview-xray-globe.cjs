const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [name, width, height, theme] of [
      ['desktop-light', 1440, 1000, 'light'],
      ['desktop-dark', 1440, 1000, 'dark'],
      ['mobile-light', 390, 844, 'light'],
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(theme => {
        localStorage.setItem('infocus-theme', theme);
        localStorage.setItem('deepu-muted', 'true');
      }, theme);
      await page.goto('http://127.0.0.1:4174/about/');
      const globe = page.locator('.webgl.globe');
      await globe.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.webgl.globe')?.dataset.ready === 'true');
      await page.waitForTimeout(1600);
      const dismiss = page.getByRole('button', { name: 'Dismiss Deepu welcome' });
      if (await dismiss.isVisible()) await dismiss.click();
      await globe.focus();
      await page.keyboard.press('Home');
      await page.waitForTimeout(600);
      await page.locator('.globe-visual').screenshot({ path: `output/xray-globe-${name}.png` });
      if (width > 1000) {
        await page.locator('.global-grid').screenshot({ path: `output/xray-offices-${name}.png` });
        await page.locator('.office-tabs').getByRole('button', { name: 'Newark', exact: true }).click();
        await page.waitForTimeout(700);
        await page.locator('.globe-visual').screenshot({ path: `output/xray-globe-americas-${theme}.png` });
      }
      if (errors.length) throw new Error(errors.join('; '));
      console.log(`${name}: map and controls captured, no browser errors`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
