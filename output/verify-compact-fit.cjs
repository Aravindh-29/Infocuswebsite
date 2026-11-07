const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true}); const results=[];
 try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.addInitScript(()=>localStorage.setItem('deepu-muted','true'));
 for(const [width,height] of [[1920,870],[1536,695],[1440,790],[1366,640],[1280,720],[1024,768]]){
  await page.setViewportSize({width,height}); await page.goto('http://127.0.0.1:4174');

  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1800);
  const dismiss=page.getByRole('button',{name:'Dismiss Deepu welcome'});if(await dismiss.isVisible())await dismiss.click();
  const report=await page.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
   const cards=[...document.querySelectorAll('.cloud-service-capsule')];
   return {copy:rect('.immersive-copy'),network:rect('.cloud-service-network'),hero:rect('.immersive-hero'),overflow:document.documentElement.scrollWidth>innerWidth,clipped:cards.flatMap(c=>[...c.querySelectorAll('.service-capsule-copy strong,.service-capsule-copy > span')].filter(t=>t.scrollWidth>t.clientWidth+1).map(t=>t.textContent)),offscreen:cards.filter(c=>{const r=c.getBoundingClientRect();return r.bottom>innerHeight||r.right>innerWidth||r.left<0}).map(c=>c.dataset.serviceId),titleSize:getComputedStyle(cards[0].querySelector('strong')).fontSize};
  }); results.push({width,height,...report}); await page.screenshot({path:`output/compact-fit-preview-${width}.png`});
 }
 fs.writeFileSync('output/compact-fit-preview.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
