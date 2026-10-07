const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.JOURNAL_TEST_URL||'http://localhost:3000';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:950},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  fs.mkdirSync('.tmp/journal-refinements',{recursive:true});
  for(const [locale,width] of [['fr',1440],['fr',390],['ar',390]]){
   await page.setViewportSize({width,height:950});
   await page.goto(`${base}/${locale}`,{waitUntil:'networkidle'});
   await page.locator('#revenue').scrollIntoViewIfNeeded();
   await page.evaluate(()=>document.fonts.ready);
   const offset=await page.locator('.analysis-network-hub').evaluate(hub=>{
    const svg=hub.querySelector('svg');const b=svg.getBBox();const m=svg.getScreenCTM();
    const point=new DOMPoint(b.x+b.width/2,b.y+b.height/2).matrixTransform(m);const r=hub.getBoundingClientRect();
    return {x:Math.abs(point.x-(r.left+r.width/2)),y:Math.abs(point.y-(r.top+r.height/2))};
   });
   assert.ok(offset.x<1&&offset.y<1,`Logo artwork is off center: ${JSON.stringify(offset)}`);
   assert.equal(await page.locator('#revenue .section-description').count(),0);
   await page.waitForFunction(()=>document.querySelectorAll('.analysis-wire').length===9);
   await page.locator('#revenue').screenshot({path:`.tmp/journal-refinements/tools-${locale}-${width}.png`,style:'.site-header,.floating-whatsapp,nextjs-portal{visibility:hidden!important}'});
   await page.locator('#destinations').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>[...document.querySelectorAll('#destinations img')].every(i=>i.complete&&i.naturalWidth>0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   console.log('PASS',locale,width,'artwork centered within 1px, phrase removed, photos loaded, no overflow');
  }
  await page.goto(`${base}/fr/blog`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('main article').count(),8);
  const titles=await page.locator('main article h2').allTextContents();
  assert.ok(titles.some(t=>t.includes('créer une annonce')));
  assert.ok(titles.some(t=>t.includes('Casablanca')));
  assert.ok(titles.every(t=>!/Copropriété|vrai budget|Arrière-saison|Palmeraie|Riad en médina|Gérer les avis négatifs|Propriétaire étranger/.test(t)));
  assert.deepEqual(errors,[]);
  console.log('PASS eight selected guides; excluded topics absent; no browser errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
