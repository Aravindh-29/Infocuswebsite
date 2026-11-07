const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
const page=await browser.newPage({reducedMotion:'reduce'});await page.addInitScript(()=>localStorage.setItem('deepu-muted','true'));
for(const [route,width,theme] of [['/',1440,'light'],['/',1440,'dark'],['/about/',1440,'light'],['/',390,'light'],['/',390,'dark']]){
await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4174'+route);await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);const grid=page.locator('.original-logo-grid');await grid.scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.original-logo-grid img')].every(i=>i.complete&&i.naturalWidth));
const data=await grid.evaluate(el=>{const tiles=[...el.children];const rows={};for(const tile of tiles){const top=Math.round(tile.getBoundingClientRect().top);rows[top]=(rows[top]||0)+1}const images=[...el.querySelectorAll('img')];return {names:images.map(i=>i.alt),rows:Object.values(rows),spectrumWidth:images.find(i=>i.alt==='Spectrum').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth};});
if(data.names.length!==6||data.names.some(n=>/MindPec|LTIMindtree/i.test(n))||data.overflow||JSON.stringify(data.rows)!==JSON.stringify(width>600?[4,2]:[2,2,2]))throw Error(JSON.stringify(data));
results.push({route,width,theme,...data});if(route==='/')await grid.screenshot({path:`output/company-logos-${width}-${theme}.png`});
}console.log(JSON.stringify(results));fs.writeFileSync('output/company-logos-verification.json',JSON.stringify(results,null,2));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
