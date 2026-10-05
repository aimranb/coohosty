const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of process.env.FORM_ONLY ? [] : [1440, 900, 390]) {
      for (const locale of ['fr', 'en', 'ar']) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`http://localhost:3130/${locale}`, { waitUntil: 'networkidle' });
        await page.locator('#services').scrollIntoViewIfNeeded();
        const cards = page.locator('.plan-services-card');
        assert.equal(await cards.count(), 3);
        assert.equal(await page.locator('.plan-services-panel').count(), 0);
        assert.equal(await page.locator('.plan-services-button').count(), 0);
        for (let index = 0; index < 3; index++) {
          const card = await cards.nth(index).boundingBox();
          assert.ok(card.x >= 0 && card.x + card.width <= width + 1);
          if (width > 540) assert.ok(Math.abs(card.y - (await cards.first().boundingBox()).y) < 2);
        }
        await page.locator('.analytics-bar').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.analytics-tool-logo')].every(img => img.complete && img.naturalWidth > 0));
        assert.ok(await page.locator('.analytics-tool-logo').evaluateAll(imgs => imgs.length === 3 && imgs.every(img => img.complete && img.naturalWidth > 0)), 'Tool logos load');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No page overflow');
        assert.deepEqual(errors, []);
        if (locale === 'fr') await page.locator('#services').screenshot({ path: `.github/finished-plans-${width}.png` });
        console.log(`PASS ${locale} ${width}px: compact plans, included-services buttons removed, logos, no overflow/runtime errors`);
        await page.close();
      }
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => console.log('FORM RUNTIME:', error.message));
    await page.goto('http://localhost:3130/en', { waitUntil: 'networkidle' });
    await page.locator('.estimate-next').click();
    assert.ok(await page.locator('.estimate-field-error').count() > 0);
    await page.locator('#estimate-city').fill('Marrakech');
    await page.locator('#estimate-address').fill('12 Rue de la Palmeraie');
    await page.locator('#estimate-type').selectOption('apartment');
    await page.locator('#estimate-bedrooms').selectOption('2');
    await page.locator('.estimate-next').click();
    await page.waitForURL('**/en/estimate');
    await page.locator('#estimate-objective').waitFor();
    await page.reload();
    await page.locator('#estimate-objective').waitFor();
    await page.locator('.estimate-back').click();
    assert.equal(await page.locator('#estimate-city').inputValue(), 'Marrakech');
    await page.locator('.estimate-next').click();
    await page.locator('#estimate-objective').selectOption('revenue');
    await page.locator('#estimate-duration').selectOption('yearplus');
    await page.locator('#estimate-ready').selectOption('now');
    await page.locator('.estimate-next').click();
    let data;
    await page.route('**/api/estimate', async route => {
      data = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, delivery: 'queued' }) });
    });
    await page.locator('#estimate-fullName').fill('Test Owner');
    await page.locator('#estimate-email').fill('owner@example.com');
    await page.locator('.estimate-consent input').check();
    await page.locator('.estimate-next').click();
    await page.locator('.estimate-result').waitFor();
    assert.equal(data.city, 'Marrakech');
    assert.equal(data.email, 'owner@example.com');
    const response = await page.request.get('http://localhost:3130/api/admin/export');
    assert.equal(response.status(), 401);
    console.log('PASS estimate validation, navigation, reload/back persistence, mocked submission, admin export protection');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
