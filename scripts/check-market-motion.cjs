const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MOTION_TEST_URL || 'http://localhost:3136';
const screenshotStyle = '.site-header,.floating-whatsapp,.skip-link,nextjs-portal{visibility:hidden!important}';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('.tmp/market-motion', { recursive: true });
  try {
    for (const [locale, width] of [['fr',1440], ['fr',900], ['fr',390], ['en',1440], ['ar',1440], ['ar',390]]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'no-preference' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
      await page.locator('#destinations').scrollIntoViewIfNeeded();
      const scene = page.locator('#destinations [data-running]');
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#destinations [data-running]').parentElement).transform === 'none');
      await page.waitForFunction(() => document.querySelector('#destinations [data-running]')?.dataset.running === 'true');
      const mapButtons = scene.locator('button[aria-pressed]').filter({ hasNot: page.locator('svg') });
      assert.equal(await mapButtons.count(), 6);
      assert.equal(await scene.locator('button[aria-pressed]').count(), 7);
      const labels = await mapButtons.allTextContents();
      assert.ok(labels.every(label => label.trim()));
      await mapButtons.nth(3).click();
      await expect(mapButtons.nth(3)).toHaveAttribute('aria-pressed', 'true');
      assert.equal(await scene.getAttribute('data-running'), 'false');
      assert.equal(await scene.locator('h3').innerText(), labels[3].trim());
      await scene.locator('button').first().click();
      await page.waitForFunction(() => document.querySelector('#destinations [data-running]')?.dataset.running === 'true');
      await page.locator('#destinations').screenshot({ path: `.tmp/market-motion/map-${locale}-${width}.png`, style: screenshotStyle });
      await page.locator('#revenue').scrollIntoViewIfNeeded();
      const network = page.locator('.analysis-network');
      await page.waitForFunction(() => document.querySelector('.analysis-network')?.dataset.running === 'true');
      assert.equal(await network.locator('[data-flow-source]').count(), 3);
      assert.equal(await network.locator('[data-flow-target]').count(), 6);
      await page.waitForFunction(() => document.querySelectorAll('.analysis-network .analysis-wire').length === 9);
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.analysis-network').parentElement).transform === 'none');
      assert.equal(await network.locator('.analysis-connection.input').count(), 3);
      assert.equal(await network.locator('.analysis-connection.output').count(), 6);
      const error = await network.evaluate(stage => {
        const box = stage.getBoundingClientRect();
        const targets = [...stage.querySelectorAll('[data-flow-target]')];
        return [...stage.querySelectorAll('.analysis-connection.output .analysis-wire')].map((path,i) => {
          const point = path.getPointAtLength(path.getTotalLength());
          const rect = targets[i].getBoundingClientRect();
          const isMobile = matchMedia('(max-width:760px)').matches;
          const expectedX = isMobile || document.documentElement.dir !== 'rtl' ? rect.left-box.left : rect.right-box.left;
          return Math.abs(point.x-expectedX) + Math.abs(point.y-(rect.top+rect.height/2-box.top));
        });
      });
      assert.ok(error.every(value => value < 2), `Wire endpoints missed targets: ${error}`);
      const moving = await network.locator('.analysis-projectile').first().evaluate(element => element.getAnimations().some(animation => animation.playState === 'running'));
      assert.ok(moving);
      // Capture the outgoing phase consistently without changing application state.
      await network.evaluate(stage => stage.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 2900; }));
      await page.locator('#revenue').screenshot({ path: `.tmp/market-motion/analysis-${locale}-${width}.png`, style: screenshotStyle });
      await network.locator('.analysis-network-pause').click();
      assert.equal(await network.getAttribute('data-running'), 'false');
      const paused = await network.locator('.analysis-projectile').first().evaluate(element => element.getAnimations().every(animation => animation.playState === 'paused'));
      assert.ok(paused);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1), `Overflow ${locale} ${width}`);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => document.querySelector('.analysis-network')?.dataset.reduced === 'true');
      assert.equal(await network.locator('.analysis-projectile').first().evaluate(element => getComputedStyle(element).display), 'none');
      assert.equal(await network.locator('[data-flow-target]').count(), 6);
      assert.deepEqual(errors, []);
      console.log(`PASS ${locale} ${width}px: six city selections, three sources, six connected targets, live arrows, pause, reduced motion, no overflow/errors`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width:1440, height:1000 }, reducedMotion:'no-preference' });
    await page.goto(`${base}/fr`, { waitUntil:'networkidle' });
    await page.locator('#destinations').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#destinations [data-running]')?.dataset.running === 'true');
    const before = await page.locator('#destinations h3').innerText();
    await page.waitForFunction(value => document.querySelector('#destinations h3')?.textContent !== value, before, { timeout:7000 });
    await page.locator('#revenue').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#destinations [data-running]')?.dataset.running === 'false');
    console.log('PASS city auto-cycle and off-screen suspension');
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
