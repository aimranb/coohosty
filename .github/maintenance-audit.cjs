const { chromium } = require('@playwright/test');
const fs = require('node:fs');

(async () => {
  const origin = process.env.AUDIT_ORIGIN || 'https://www.coohosty.com';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const locale of ['fr', 'en', 'ar']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      const errors = [], failures = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) failures.push({ url: response.url(), status: response.status() }); });
      await page.addInitScript(() => {
        window.auditLcp = 0;
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.auditLcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
      const response = await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' });
      const initial = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        return { ttfb: Math.round(nav.responseStart), lcp: Math.round(window.auditLcp), htmlBytes: nav.decodedBodySize, resourceBytes: resources.reduce((sum, item) => sum + item.transferSize, 0), heroRequests: resources.filter(item => item.name.includes('hero-')).length, lang: document.documentElement.lang, dir: document.documentElement.dir, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      });
      await page.locator('#services').scrollIntoViewIfNeeded();
      if (await page.locator('.plan-services-card').count() !== 3) throw new Error('Expected three service offers');
      await page.locator('#destinations').scrollIntoViewIfNeeded();
      const cityButtons = page.locator('button[aria-pressed]', { hasText: /Casablanca|Agadir|Rabat|Tanger|Mekn|F.s|الرباط|أكادير|طنجة|مكناس|فاس|الدار/ });
      if (await cityButtons.count()) await cityButtons.last().click();
      results.push({ locale, status: response.status(), ...initial, errors, failures });
      await page.close();
    }
    const page = await browser.newPage();
    for (const path of ['/fr/blog', '/fr/estimate', '/fr/privacy', '/fr/legal', '/fr/services/audit', '/fr/services/optimize', '/fr/services/cohost', '/admin/login', '/fr/blog/nonexistent']) {
      const response = await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
      results.push({ path, status: response.status() });
    }
    console.log(JSON.stringify(results, null, 2));
    fs.writeFileSync(process.env.AUDIT_OUTPUT || '.github/maintenance-baseline.json', JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
