const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const base=process.env.ENTRANCE_TEST_URL||'http://localhost:3000';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  for(const [locale,width] of [['fr',1440],['fr',390],['ar',390]]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/${locale}`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('#revenue > [data-reveal]')?.getAnimations().length>0);
   const title=page.locator('#revenue > [data-reveal]').first();
   const graph=page.locator('#revenue > [data-reveal]').last();
   assert.equal(await graph.evaluate(e=>getComputedStyle(e).opacity),'0','Graph waits off screen');
   const delays=await Promise.all([title.evaluate(e=>e.getAnimations()[0].effect.getTiming().delay),graph.evaluate(e=>e.getAnimations()[0].effect.getTiming().delay)]);
   assert.ok(delays[1]>delays[0],'Graph entrance follows the title');
   await title.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
   await page.waitForFunction(()=>{
    const e=document.querySelector('#revenue > [data-reveal]');
    return Number(getComputedStyle(e).opacity)>0;
   });
   const phase=await Promise.all([title.evaluate(e=>Number(getComputedStyle(e).opacity)),graph.evaluate(e=>Number(getComputedStyle(e).opacity))]);
   assert.ok(phase[0]>=phase[1],`Title leads graph: ${phase}`);
   await page.waitForFunction(()=>[...document.querySelectorAll('#revenue > [data-reveal]')].every(e=>getComputedStyle(e).opacity==='1'));
   assert.equal(await graph.evaluate(e=>getComputedStyle(e).transform),'none','Arrival releases the transform');
   await page.evaluate(()=>scrollTo(0,0));
   assert.equal(await graph.evaluate(e=>getComputedStyle(e).opacity),'1','Revealed information stays visible');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.locator('#faq [data-reveal]').last().evaluate(e=>getComputedStyle(e).opacity),'1');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.deepEqual(errors,[]);
   console.log('PASS',locale,width,'off-screen wait, title then graph, stable arrival, reduced motion, no overflow');await page.close();
  }
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  await page.goto(`${base}/fr`);
  assert.equal(await page.locator('#revenue > [data-reveal]').last().evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.ok(await page.locator('#revenue').textContent());
  console.log('PASS complete content visible without JavaScript');await page.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
