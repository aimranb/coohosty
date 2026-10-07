const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = process.env.BLOG_TEST_URL || 'http://localhost:3135';
const slugs = ['fiche-de-police-airbnb-maroc', 'fiscalite-taxes-airbnb-maroc', 'commission-airbnb-maroc', 'sous-location-airbnb-maroc', 'airbnb-maroc-definition', 'conciergerie-airbnb-marrakech', 'creer-annonce-airbnb-maroc', 'conciergerie-airbnb-casablanca'];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('.tmp/blog', { recursive: true });
  try {
    for (const width of [1440, 900, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}/fr/blog`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main article').count(), 8);
      assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://coohosty.com/fr/blog');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Blog index overflows at ${width}`);
      if (width === 390) {
        await page.locator('.mobile-toggle').click();
        assert.equal(await page.locator('#mobile-menu a[href="/fr/blog"]').count(), 1);
        await page.keyboard.press('Escape');
        await page.screenshot({ path: '.tmp/blog/index-mobile.png', fullPage: true });
      }
      for (const slug of slugs) {
        const result = await page.goto(`${base}/fr/blog/${slug}`, { waitUntil: 'networkidle' });
        assert.equal(result.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        assert.equal(canonical, `https://coohosty.com/fr/blog/${slug}`);
        const data = JSON.parse(await page.locator('main script[type="application/ld+json"]').textContent());
        assert.equal(data['@graph'][0]['@type'], 'BlogPosting');
        assert.equal(data['@graph'][0].url, canonical);
        assert.equal(await page.locator('link[hreflang]').count(), 0);
        assert.equal(await page.locator('#questions details').count(), 3);
        await page.locator('#questions summary').first().click();
        assert.equal(await page.locator('#questions details').first().getAttribute('open'), '');
        const brokenAnchors = await page.locator('main a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
        assert.deepEqual(brokenAnchors, []);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} overflows at ${width}`);
        if (slug === slugs[0] && width !== 900) {
          assert.ok(await page.locator('main a[href*="Decret-n"]').count() > 0);
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: `.tmp/blog/police-${width}.png`, fullPage: true });
        }
      }
      await page.goto(`${base}/fr`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#blog-preview-title').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Homepage overflows at ${width}`);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: blog, eight articles, SEO, FAQ, anchors, homepage, no browser errors`);
      await page.close();
    }
    const request = await browser.newContext();
    for (const path of ['/fr/blog/missing', '/xx/blog', '/xx/blog/fiche-de-police-airbnb-maroc']) {
      assert.equal((await request.request.get(`${base}${path}`)).status(), 404);
    }
    for (const locale of ['en', 'ar']) {
      const redirect = await request.request.get(`${base}/${locale}/blog/${slugs[0]}`, { maxRedirects: 0 });
      assert.equal(redirect.status(), 308);
      assert.equal(new URL(redirect.headers().location, base).pathname, `/fr/blog/${slugs[0]}`);
      const page = await request.newPage();
      await page.goto(`${base}/${locale}`);
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.equal(await page.locator('.desktop-nav a[href="/fr/blog"]').count(), 1);
      await page.close();
    }
    const xml = await (await request.request.get(`${base}/sitemap.xml`)).text();
    for (const slug of slugs) assert.ok(xml.includes(`/fr/blog/${slug}`));
    for (const plan of ['audit', 'optimize', 'cohost']) {
      assert.ok(xml.includes(`/fr/services/${plan}`));
      const page = await request.newPage();
      await page.goto(`${base}/fr/services/${plan}`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://coohosty.com/fr/services/${plan}`);
      await page.close();
    }
    console.log('PASS invalid routes, French redirects, multilingual navigation, sitemap and service canonicals');
    await request.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
