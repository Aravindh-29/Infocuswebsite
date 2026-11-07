const { chromium } = require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true});const reports=[];
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  await page.addInitScript(()=>localStorage.setItem('deepu-muted','true'));
  for(const [width,height] of [[1920,870],[1536,695],[1440,790],[1366,640],[1280,720],[1024,768],[390,844]]){
   await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4174');await page.evaluate(()=>document.fonts.ready);
   await page.getByRole('button',{name:'Dismiss Deepu welcome'}).click();
   const result=await page.evaluate(()=>{
    const launcher=document.querySelector('.deepu-launch').getBoundingClientRect();
    const covered=[...document.querySelectorAll('.cloud-service-capsule')].filter(c=>{const b=c.getBoundingClientRect();return Math.min(b.right,launcher.right)-Math.max(b.left,launcher.left)>2&&Math.min(b.bottom,launcher.bottom)-Math.max(b.top,launcher.top)>2}).map(c=>c.dataset.serviceId);
    return {covered,overflow:document.documentElement.scrollWidth>innerWidth};
   });reports.push({width,height,...result});
   if(result.covered.length||result.overflow)throw Error(JSON.stringify(reports.at(-1)));
   if(width===1366||width===1536||width===390)await page.screenshot({path:`output/compact-fit-final-${width}.png`});
  }
  await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:4174/services/');
  await page.locator('#enterprise-applications').scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);
  const artwork=await page.locator('.service-kind-code .enterprise-application-art').evaluate(el=>({width:el.getBoundingClientRect().width, height:el.getBoundingClientRect().height, label:el.querySelector('title').textContent}));
  if(artwork.width<200||artwork.height<200)throw Error('Application visual missing');
  console.log(JSON.stringify({reports,artwork}));fs.writeFileSync('output/compact-fit-final.json',JSON.stringify({reports,artwork},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
