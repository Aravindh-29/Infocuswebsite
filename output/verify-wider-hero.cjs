const { chromium }=require('playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true});const results=[];try{
const page=await browser.newPage({reducedMotion:'reduce'});await page.addInitScript(()=>localStorage.setItem('deepu-muted','true'));
for(const [width,height] of [[1536,695],[1366,640],[1920,870]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4174');await page.evaluate(()=>document.fonts.ready);await page.getByRole('button',{name:'Dismiss Deepu welcome'}).click();
 const data=await page.evaluate(()=>{const copy=document.querySelector('.immersive-copy').getBoundingClientRect(),network=document.querySelector('.cloud-service-network').getBoundingClientRect(),core=document.querySelector('.cloud-service-core').getBoundingClientRect(),launch=document.querySelector('.deepu-launch').getBoundingClientRect();return {gap:network.left-copy.right,networkWidth:network.width,networkHeight:network.height,coreWidth:core.width,heading:getComputedStyle(document.querySelector('.immersive-copy h1')).fontSize,covered:[...document.querySelectorAll('.cloud-service-capsule')].filter(el=>{const r=el.getBoundingClientRect();return Math.min(r.right,launch.right)-Math.max(r.left,launch.left)>2&&Math.min(r.bottom,launch.bottom)-Math.max(r.top,launch.top)>2}).map(el=>el.dataset.serviceId)};});
 results.push({width,height,...data});await page.screenshot({path:`output/wider-hero-${width}.png`});
}
fs.writeFileSync('output/wider-hero-verification.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
