const { chromium } = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1672, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4174/');
  await page.waitForTimeout(3000);
  await page.locator('.immersive-hero h1[data-typing-state="complete"]').waitFor();
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: '.immersive-hero *, .infocus-wordmark * {animation-play-state:paused !important}' });
  const measurements = [];
  for (const theme of ['light', 'dark']) {
    await page.getByRole('button', { name: theme === 'light' ? 'Switch to light mode' : 'Switch to night mode' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `output/immersive-hero-${theme}.png` });
    measurements.push(await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
      actionColor: getComputedStyle(document.querySelector('.immersive-actions .button')).color,
      guidanceColor: getComputedStyle(document.querySelector('.cloud-universe-guidance p')).color,
      awsFilter: getComputedStyle(document.querySelector('.cloud-platform-node .vendor-aws img')).filter,
      platformLinks: [...document.querySelectorAll('.cloud-platform-node')].map(el => el.getAttribute('href')),
    })));
  }
  await page.setViewportSize({ width: 390, height: 980 });
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'output/immersive-hero-mobile.png' });
  fs.writeFileSync('output/immersive-verification.json', JSON.stringify({ measurements, errors }, null, 2));
  await browser.close();
  console.log('Final hero screenshots and verification saved.');
})().catch(error => { console.error(error); process.exitCode = 1; });
