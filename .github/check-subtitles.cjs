const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 900, 390]) {
      for (const locale of ['fr', 'en', 'ar']) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${process.env.SUBTITLE_URL || 'http://localhost:3130'}/${locale}`, { waitUntil: 'networkidle' });
        const subtitles = await page.locator('.destination-heading>p, .section-heading>p, .reservation-heading>p, .section-description').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent, size: parseFloat(getComputedStyle(node).fontSize) })));
        assert.ok(subtitles.length >= 4);
        assert.ok(subtitles.every(node => node.size === (width <= 760 ? 18 : 20)), JSON.stringify(subtitles));
        const compact = await page.locator('.estimate-intro, .plan-subtitle').evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize)));
        assert.ok(compact.length >= 1 && compact.every(size => size === 16));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        assert.deepEqual(errors, []);
        if (locale === 'fr') await page.screenshot({ path: `.github/subtitles-${width}.png`, fullPage: true });
        console.log(`PASS ${locale} ${width}px: larger section and compact subtitles, no overflow or runtime errors`);
        await page.close();
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
