const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [name, width, height] of [
      ['desktop', 1440, 1000],
      ['mobile', 390, 844],
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        localStorage.setItem('infocus-theme', 'light');
        localStorage.setItem('deepu-muted', 'true');
      });
      await page.goto('http://127.0.0.1:4174/about/');
      const globe = page.locator('.webgl.globe');
      await globe.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.webgl.globe')?.dataset.ready === 'true');
      await page.waitForTimeout(1400);
      const dismiss = page.getByRole('button', { name: 'Dismiss Deepu welcome' });
      if (await dismiss.isVisible()) await dismiss.click();
      for (const city of ['Petaling Jaya', 'Hyderabad', 'Newark']) {
        const button = page.locator('.office-tabs').getByRole('button', { name: city, exact: true });
        await button.click();
        await globe.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        const pressed = await page.locator('.office-tabs button[aria-pressed="true"]').allTextContents();
        if (pressed.length !== 1 || !pressed[0].includes(city)) throw new Error(`Incorrect selection: ${pressed}`);
        await page.locator('.globe-visual').screenshot({ path: `output/selected-pin-${name}-${city.toLowerCase().replaceAll(' ', '-')}.png` });
      }
      // Keep Newark selected and rotate back to Asia: former selections must be red.
      const box = await globe.boundingBox();
      const currentYaw = Number(await globe.getAttribute('data-yaw'));
      const asiaYaw = -78.48 * Math.PI / 180 - Math.PI / 2;
      const delta = Math.atan2(Math.sin(asiaYaw - currentYaw), Math.cos(asiaYaw - currentYaw));
      const startX = box.x + box.width * 0.75;
      const y = box.y + box.height * 0.5;
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(startX + delta / (Math.PI * 2) * box.width, y, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(150);
      await page.locator('.globe-visual').screenshot({ path: `output/selected-pin-${name}-former-selections-red.png` });
      if (errors.length) throw new Error(errors.join('; '));
      console.log(`${name}: Petaling Jaya, Hyderabad and Newark selected; former selections captured; no browser errors`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
