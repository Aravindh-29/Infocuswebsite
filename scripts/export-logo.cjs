const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const sharp = require("sharp");
const { staticLogoSvg } = require("../lib/logo.ts");
(async () => {
  const base = process.env.TEST_URL || "http://127.0.0.1:4174";
  await fs.mkdir("output/logo/frames", { recursive: true });
  await fs.writeFile("output/logo/infocus-logo.svg", staticLogoSvg());
  await fs.writeFile("public/brand/infocus-logo.svg", staticLogoSvg());
  await sharp(Buffer.from(staticLogoSvg()))
    .resize(2400, 2520)
    .png()
    .toFile("output/logo/infocus-logo.png");
  const b = await chromium.launch();
  const page = await b.newPage({
    viewport: { width: 512, height: 538 },
    deviceScaleFactor: 1,
  });
  await page.goto(base + "/logo-preview/");
  await page.waitForFunction(() => window.logoReady);
  await page.addStyleTag({
    content:
      "html,body{background:transparent!important;margin:0!important;padding:0!important;width:512px!important;height:538px!important;overflow:hidden!important}.header,.footer,.assistant-launch,.skip-link,.logo-studio>*:not(#logo-export-stage){display:none!important}.logo-studio{padding:0!important;margin:0!important;width:512px!important;height:538px!important}#logo-export-stage{position:fixed!important;inset:0!important;width:512px!important;height:538px!important;margin:0!important;max-width:none!important;background:transparent!important}#logo-export-stage svg{width:512px!important;height:538px!important}",
  });
  await page.evaluate(() => {
    window.infocusLogo.setLoop(false);
    window.infocusLogo.pause();
  });
  for (let i = 0; i < 288; i++) {
    await page.evaluate((t) => window.infocusLogo.seek(t), i / 24);
    await page.screenshot({
      path: `output/logo/frames/${String(i).padStart(4, "0")}.png`,
      omitBackground: true,
    });
    if (i % 72 === 0) console.log(`Logo frames: ${i}/288`);
  }
  await b.close();
  console.log("Transparent frames and high-resolution static files ready.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
