const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
const origin = process.env.VERIFY_ORIGIN || 'http://localhost:3140';
(async () => {
const browser = await chromium.launch({ channel: 'chrome' });
try {
const context = await browser.newContext();
    for (const width of [390, 1440]) {
      const page = await context.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const locale of ['fr', 'en', 'ar']) {
        await page.goto(`${origin}/${locale}/services/conciergerie-marrakech`, { waitUntil: 'domcontentloaded' });
        const map = page.locator('[data-marrakech-map]');
        const choices = map.locator('button');
        assert.equal(await choices.count(), 4);
        for (let index = 0; index < 4; index++) {
          await choices.nth(index).click();
          await page.waitForFunction(index => document.querySelectorAll('[data-marrakech-map] button')[index].getAttribute('aria-pressed') === 'true', index);
          assert.ok((await map.locator('a').getAttribute('href')).startsWith('/fr/blog/'));
        }
        assert.equal(await page.locator('html').getAttribute('dir'), locale === 'ar' ? 'rtl' : 'ltr');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow: ${locale}, ${width}`);
      }
      assert.deepEqual(errors, [], `Marrakech runtime errors: ${width}`);
      await page.close();
    }
console.log('Marrakech desktop/mobile: all languages, four neighbourhood controls, guide links, RTL, no overflow or runtime errors passed.');
} finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
