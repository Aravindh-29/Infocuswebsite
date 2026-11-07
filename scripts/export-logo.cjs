const { chromium } = require("@playwright/test");
const fs = require("node:fs/promises");
const sharp = require("sharp");
(async () => {
  const base = process.env.TEST_URL || "http://127.0.0.1:4174";
  await fs.mkdir("output/wordmark/frames", { recursive: true });
  const svg = await fs.readFile("public/brand/infocus-wordmark.svg");
  await fs.writeFile("output/wordmark/infocus-wordmark.svg", svg);
  await sharp(svg)
    .resize(2360, 608)
    .png()
    .toFile("output/wordmark/infocus-wordmark.png");
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 800, height: 260 },
    deviceScaleFactor: 1,
  });
  await page.goto(base + "/logo-preview/");
  await page.waitForFunction(() => window.logoReady);
  await page.addStyleTag({
    content: `
 html,body { background:transparent!important; margin:0!important; padding:0!important; width:800px!important; height:260px!important; overflow:hidden!important; }
 .header,.footer,.assistant-launch,.skip-link,.logo-studio>*:not(#logo-export-stage) { display:none!important; }
 .logo-studio { padding:0!important; margin:0!important; width:800px!important; height:260px!important; }
 #logo-export-stage { position:fixed!important; inset:0!important; width:800px!important; height:260px!important; margin:0!important; padding:0!important; max-width:none!important; background:transparent!important; border:0!important; border-radius:0!important; box-shadow:none!important; }
 #logo-export-stage svg { width:800px!important; height:206.102px!important; }
 `,
  });
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "light";
    window.infocusLogo.setLoop(false);
    window.infocusLogo.pause();
  });
  for (let i = 0; i < 144; i++) {
    await page.evaluate((t) => window.infocusLogo.seek(t), i / 24);
    await page.screenshot({
      path: "output/wordmark/frames/" + String(i).padStart(4, "0") + ".png",
      omitBackground: true,
    });
    if (i % 48 === 0) console.log("Wordmark frames: " + i + "/144");
  }
  await page
    .locator(".logo-controls button")
    .filter({ hasText: "Use idle mode" })
    .evaluate((el) => el.click());
  await page.evaluate(() => {
    window.infocusLogo.setLoop(false);
    window.infocusLogo.pause();
  });
  await fs.mkdir("output/wordmark/idle-frames", { recursive: true });
  for (let i = 0; i < 96; i++) {
    await page.evaluate((t) => window.infocusLogo.seek(t), i / 24);
    await page.screenshot({
      path:
        "output/wordmark/idle-frames/" + String(i).padStart(4, "0") + ".png",
      omitBackground: true,
    });
  }
  await browser.close();
  console.log("Native wordmark frames and static artwork exported.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
