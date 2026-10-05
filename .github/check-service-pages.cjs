const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const base = process.env.SERVICES_URL || 'http://localhost:3130';
  try {
    for (const width of [1440, 390]) {
      for (const locale of ['fr', 'en', 'ar']) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const [index, plan] of ['audit', 'optimize', 'cohost'].entries()) {
          await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
          assert.equal(await page.locator('.plan-more-link').count(), 3);
          assert.equal(await page.locator('.plan-services-button').count(), 0);
          await page.locator('.plan-more-link').nth(index).click();
          await page.waitForURL(`**/${locale}/services/${plan}`);
          assert.equal(await page.locator('h1').innerText(), plan.toUpperCase());
          assert.equal(await page.locator('.service-detail-group li').count(), [9, 19, 12][index]);
          assert.equal(await page.locator('.service-detail-form').count(), 2);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          if (locale === 'en' && index === 2) await page.screenshot({ path: `.github/service-detail-${width}.png`, fullPage: true });
          await page.locator('.service-detail-form').last().click();
          await page.waitForURL(`**/${locale}?plan=${plan.toUpperCase()}#estimate`);
          await page.locator('#estimate-city').waitFor();
          assert.ok(await page.locator('#estimate-city').isVisible());
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${locale} ${width}px: See more navigation, all three full service lists, form links, no overflow/errors`);
        await page.close();
      }
    }
    const page = await browser.newPage();
    await page.goto(`${base}/en/services/unknown`);
    assert.equal(await page.locator('.error-page h1').innerText(), '404');
    console.log('PASS invalid service shows the not-found page');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
