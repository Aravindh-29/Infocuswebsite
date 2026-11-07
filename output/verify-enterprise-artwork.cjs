const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch();const reports=[];
 for(const width of [1440,390])for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(theme=>{localStorage.setItem('infocus-theme',theme);localStorage.setItem('deepu-muted','true');},theme);
  await page.goto('http://127.0.0.1:4174/services/');
  await page.addStyleTag({path:'app/enterprise-artwork.css'});
  await page.evaluate(()=>document.fonts.ready);
  const visual=page.locator('.service-product-code');
  await visual.scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Dismiss Deepu welcome'}).click();
  await page.waitForTimeout(150);
  const report=await visual.evaluate(el=>{
   const card=el.closest('.service-panel').getBoundingClientRect(),r=el.getBoundingClientRect();
   const art=el.querySelector('.enterprise-application-art'),svg=art.getBoundingClientRect(),box=art.getBBox();
   return {visual:{width:r.width,height:r.height,topWithinCard:r.top-card.top},art:{width:svg.width,height:svg.height,viewBox:art.getAttribute('viewBox'),contentBox:{x:box.x,y:box.y,width:box.width,height:box.height}},overflow:document.documentElement.scrollWidth>innerWidth,title:art.querySelector('title').textContent,legend:[...el.querySelectorAll('.enterprise-application-layers p')].map(p=>({text:p.textContent,headingSize:getComputedStyle(p.querySelector('strong')).fontSize,bodySize:getComputedStyle(p.querySelector('span')).fontSize})),labelColor:getComputedStyle(art.querySelector('.enterprise-svg-heading')).fill};
  });
  await visual.screenshot({path:`output/enterprise-application-${width}-${theme}.png`});
  reports.push({width,theme,...report,errors});await page.close();
 }
 await fs.writeFile('output/enterprise-application-verification.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
