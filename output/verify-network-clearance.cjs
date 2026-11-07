const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch(); const reports=[];
 for(const width of [1440,1801,1920,1101]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.addInitScript(()=>localStorage.setItem('deepu-muted','true'));
  await page.goto('http://127.0.0.1:4174/');
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.cloud-service-core').scrollIntoViewIfNeeded();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForTimeout(100);
  for(const candidate of ['original','52percent']){
   if(candidate==='52percent')await page.addStyleTag({content:'@media(min-width:1101px){.cloud-service-core{width:52%;left:24%}}'});
   await page.waitForTimeout(200);
   const result=await page.evaluate(async()=>{
    const nodes=[...document.querySelectorAll('.cloud-platform-node')], cards=[...document.querySelectorAll('.cloud-service-capsule')];
    const animations=nodes.map(n=>n.getAnimations().find(a=>a instanceof CSSAnimation&&a.animationName==='cloud-node-pulse'));
    const collisions=[];let minimumSideGap=Infinity;
    for(const time of [1500,4500,7500,10500]){
     animations.forEach(a=>{if(a){a.pause();a.currentTime=time;}});await new Promise(requestAnimationFrame);
     for(const node of nodes)for(const card of cards){
      const a=node.getBoundingClientRect(),b=card.getBoundingClientRect();
      const overlapX=Math.min(a.right,b.right)-Math.max(a.left,b.left),overlapY=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
      if(overlapX>2&&overlapY>2)collisions.push({time,node:node.getAttribute('aria-label'),card:card.dataset.serviceId,overlapX,overlapY});
      if(overlapY>2&& !card.className.includes('capsule-top'))minimumSideGap=Math.min(minimumSideGap,-overlapX);
     }
    }
    return {collisions,minimumSideGap,coreWidth:document.querySelector('.cloud-service-core').getBoundingClientRect().width,canvasWidth:document.querySelector('.cloud-service-network').getBoundingClientRect().width};
   });
   reports.push({width,candidate,...result});
  }
  await page.close();
 }
 console.log(JSON.stringify(reports,null,2));
 await fs.writeFile('output/network-clearance-verification.json',JSON.stringify(reports,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
