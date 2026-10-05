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
        for (let index = 0; index < 3; index++) {
          if (width <= 1000 && index > 0) {
            await page.locator('.plan-services-close').click();
            await page.waitForTimeout(100);
          }
          const card = await cards.nth(index).boundingBox();
          assert.ok(card.x >= 0 && card.x + card.width <= width + 1, 'Every plan fits without horizontal scrolling');
          if (width > 540) assert.ok(Math.abs(card.y - (await cards.first().boundingBox()).y) < 2, 'All plans stay in one row');
          await page.locator('.plan-services-button').nth(index).click();
          await page.waitForTimeout(400);
          const panel = page.locator('.plan-services-panel');
          assert.equal(await panel.count(), 1);
          assert.equal(await panel.locator('h3').innerText(), ['AUDIT', 'OPTIMIZE', 'COHOST'][index]);
          const details = await panel.boundingBox();
          const last = await cards.last().boundingBox();
          if (width > 1000) assert.ok(details.x >= last.x + last.width - 1, 'Details open to the right of every offer');
          else assert.ok(details.x + details.width >= width - 14, 'Services drawer opens on the right');
          assert.ok(await panel.locator('li').count() > 0);
          if (index === 2) assert.equal(await panel.locator('li').count(), 12);
          if (locale === 'fr' && index === 0) await page.screenshot({ path: `.github/right-services-${width}.png` });
        }
        await page.keyboard.press('Escape');
        await page.waitForTimeout(100);
        assert.equal(await page.locator('.plan-services-panel').count(), 0);
        assert.equal(await page.locator('.plan-services-button').last().evaluate(el => el === document.activeElement), true);
        const color = await page.locator('.plan-services-button').first().evaluate(el => getComputedStyle(el).backgroundColor);
        assert.equal(color, 'rgb(255, 116, 21)');
        await page.locator('.plan-services-button').first().click();
        await page.waitForTimeout(100);
        await page.locator('.plan-services-close').click();
        await page.waitForTimeout(100);
        assert.equal(await page.locator('.plan-services-panel').count(), 0);
        await page.locator('.analytics-bar').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.analytics-tool-logo')].every(img => img.complete && img.naturalWidth > 0));
        assert.ok(await page.locator('.analytics-tool-logo').evaluateAll(imgs => imgs.length === 3 && imgs.every(img => img.complete && img.naturalWidth > 0)), 'Tool logos load');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No page overflow');
        assert.deepEqual(errors, []);
        if (locale === 'fr') await page.locator('#services').screenshot({ path: `.github/finished-plans-${width}.png` });
        console.log(`PASS ${locale} ${width}px: compact plans, orange buttons, services switch/close, logos, no overflow/runtime errors`);
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
    if (!process.env.FORM_ONLY) {
      const animated = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'no-preference' });
      const errors = [];
      animated.on('pageerror', error => errors.push(error.message));
      await animated.goto('http://localhost:3130/fr', { waitUntil: 'networkidle' });
      await animated.locator('.plan-services-button').first().click();
      await animated.waitForTimeout(1200);
      assert.equal(await animated.locator('.plan-services-panel h3').innerText(), 'AUDIT');
      await animated.locator('.plan-services-button').nth(1).click();
      await animated.waitForTimeout(1200);
      assert.equal(await animated.locator('.plan-services-panel').count(), 1);
      assert.equal(await animated.locator('.plan-services-panel h3').innerText(), 'OPTIMIZE');
      await animated.screenshot({ path: '.github/right-services-animated.png' });
      await animated.keyboard.press('Escape');
      await animated.waitForTimeout(600);
      assert.equal(await animated.locator('.plan-services-panel').count(), 0);
      assert.equal(await animated.locator('.plan-services-button').nth(1).evaluate(el => el === document.activeElement), true);
      assert.deepEqual(errors, []);
      console.log('PASS animated right-side opening, switching, Escape and keyboard focus');
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
