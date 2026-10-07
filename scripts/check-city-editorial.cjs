const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.CITY_TEST_URL||'http://localhost:3000';
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 fs.mkdirSync('.tmp/city-editorial',{recursive:true});
 try{
  for(const[locale,width]of[['fr',1440],['fr',390],['ar',390]]){
   const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(`${base}/${locale}`,{waitUntil:'networkidle'});const section=p.locator('#destinations');await section.scrollIntoViewIfNeeded();
   await p.waitForFunction(()=>[...document.querySelectorAll('#destinations img')].every(i=>i.complete&&i.naturalWidth>0));
   assert.equal(await section.locator('details').count(),0);
   assert.equal(await section.locator('button[aria-pressed]').count(),7);
   const images=await section.locator('img').evaluateAll(es=>es.map(e=>e.getAttribute('src')));
   assert.equal(images.length,6);assert.ok(images.every(src=>decodeURIComponent(src).includes('-original.webp')));
   const panel=section.locator('img').first().locator('xpath=../../..');
   assert.equal(await panel.locator(':scope > button, :scope > div > button').count(),0);
   assert.equal(await panel.locator(':scope > a[href="#estimate"]').count(),1);
   if(locale==='fr')assert.equal(await panel.locator(':scope > a').innerText(),'Parlons de votre propriété');
   const labels=section.locator('button[aria-pressed]').filter({hasNot:p.locator('svg')});
   for(let i=0;i<6;i++){await labels.nth(i).click();assert.equal(await labels.nth(i).getAttribute('aria-pressed'),'true');assert.equal(await section.locator('h3').innerText(),(await labels.nth(i).innerText()).trim());}
   await labels.first().click();
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await section.screenshot({path:`.tmp/city-editorial/${locale}-${width}.png`,style:'.site-header,.floating-whatsapp,nextjs-portal{visibility:hidden!important}'});
   assert.deepEqual(errors,[]);console.log('PASS',base,locale,width,'six original photos, map selection, only CTA below photo, no credits or overflow');await p.close();
  }
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
