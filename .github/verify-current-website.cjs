const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('@playwright/test');

// Discover current pages rather than relying on yesterday's fixed URL inventory.
const origin = process.env.VERIFY_ORIGIN || 'http://localhost:3140';
(async () => {
  const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'chrome' : undefined });
  try {
    const context = await browser.newContext();
    const response = await context.request.get(`${origin}/sitemap.xml`);
    assert.equal(response.status(), 200);
    const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    assert.ok(urls.length > 0);
    assert.equal(new Set(urls).size, urls.length);
    const queue = [...urls];
    const results = [];
    await Promise.all(Array.from({ length: 3 }, async () => {
      const page = await context.newPage();
      await page.route('**/*', route => ['image', 'font', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue());
      while (queue.length) {
        const canonical = queue.shift();
        const path = new URL(canonical).pathname;
        const response = await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200, path);
        assert.equal(new URL(page.url()).pathname, path, `Locale redirect: ${path}`);
        const data = await page.evaluate(() => ({
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content,
          robots: document.querySelector('meta[name="robots"]')?.content || '',
          h1: document.querySelectorAll('main h1').length,
          lang: document.documentElement.lang,
          schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)),
        }));
        assert.equal(data.canonical, canonical, path);
        assert.ok(data.title && data.description, path);
        assert.ok(!data.robots.includes('noindex'), path);
        assert.equal(data.h1, 1, path);
        assert.equal(data.lang, path.split('/')[1], path);
        if (!/\/(legal|privacy)$/.test(path)) assert.ok(data.schemas.length, path);
        results.push({ path, ...data });
      }
      await page.close();
    }));
    assert.equal(new Set(results.map(page => page.title)).size, results.length, 'Duplicate page titles');
    for (const path of ['/fr/nonexistent', '/fr/services/nonexistent', '/fr/blog/nonexistent']) {
      assert.equal((await context.request.get(`${origin}${path}`)).status(), 404, path);
    }
    const robots = await context.request.get(`${origin}/robots.txt`);
    assert.equal(robots.status(), 200);
    assert.ok((await robots.text()).includes('https://www.coohosty.com/sitemap.xml'));
    fs.writeFileSync(`${__dirname}/current-website-verification.json`, JSON.stringify({ origin, checkedAt: new Date().toISOString(), count: results.length, pages: results.sort((a, b) => a.path.localeCompare(b.path)) }, null, 2));
    console.log(`Verified ${results.length} public pages: status, language, canonical, metadata, headings and JSON-LD; robots and invalid-route 404s passed.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
