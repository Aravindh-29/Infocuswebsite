const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
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
        localStorage.setItem('deepu-muted', 'true');
        localStorage.setItem('infocus-theme', theme);
      }, theme);
      await page.goto('http://127.0.0.1:4174/about/');
      const globe = page.locator('.webgl.globe');
      await globe.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.webgl.globe')?.dataset.ready === 'true');
      await page.waitForTimeout(1500);
      const dismiss = page.getByRole('button', { name: 'Dismiss Deepu welcome' });
      if (await dismiss.isVisible()) await dismiss.click();
      await globe.scrollIntoViewIfNeeded();
      const box = await globe.boundingBox();
      const before = Number(await globe.getAttribute('data-yaw'));
      await page.locator('.globe-visual').screenshot({ path: `output/globe-pins-${name}.png` });
      await page.mouse.move(box.x + box.width * .3, box.y + box.height * .5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * .55, box.y + box.height * .5, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(150);
      const after = Number(await globe.getAttribute('data-yaw'));
      const outline = await globe.evaluate(el => getComputedStyle(el).outlineStyle);
      if (outline !== 'none') throw new Error(`Unexpected globe outline: ${outline}`);
      if (after - before < 1.4) throw new Error(`Drag failed: ${after - before}`);
      await page.locator('.globe-visual').screenshot({ path: `output/globe-pins-${name}-dragged.png` });
      await page.locator('.office-tabs').getByRole('button', { name: 'Newark', exact: true }).click();
      await globe.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await globe.focus();
      await page.keyboard.press('ArrowRight');
      const keyboardOutline = await globe.evaluate(el => getComputedStyle(el).outlineStyle);
      const focusCue = await page.locator('.globe-caption').evaluate(el => getComputedStyle(el).textDecorationLine);
      if (keyboardOutline !== 'none' || focusCue !== 'underline') throw new Error('Keyboard focus treatment failed');
      if (errors.length) throw new Error(errors.join('; '));
      results.push({ name, before, after, dragDelta: after - before, outline, keyboardOutline, focusCue, errors });
      await page.close();
    }
    fs.writeFileSync('output/globe-pins-verification.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
