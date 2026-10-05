const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 900, 390]) {
      for (const locale of ['en', 'fr', 'ar']) {
        const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion: 'no-preference' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`http://localhost:3130/${locale}`, { waitUntil: 'networkidle' });
        await page.locator('#revenue').scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.locator('.analytics-bar').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.analytics-tool-logo')].every(img => img.complete && img.naturalWidth > 0));
        const result = await page.evaluate(() => {
          const heading = document.querySelector('#analytics-bar-title');
          const bars = [...document.querySelectorAll('.revenue-feature')];
          return {
            title: heading.textContent,
            titleTag: heading.tagName,
            titleSize: getComputedStyle(heading).fontSize,
            sectionSize: getComputedStyle(document.querySelector('#services h2')).fontSize,
            bodySize: getComputedStyle(document.querySelector('#revenue .section-description')).fontSize,
            phrases: bars.map(bar => ({ text: bar.querySelector('h3').textContent, size: getComputedStyle(bar.querySelector('h3')).fontSize, background: getComputedStyle(bar).backgroundColor, animation: getComputedStyle(bar.querySelector('.revenue-feature-icon')).animationName })),
            disclaimerParagraphs: document.querySelectorAll('.analytics-bar>p').length,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            logoCount: document.querySelectorAll('.analytics-tool-logo').length,
          };
        });
        console.log(JSON.stringify({ width, locale, ...result, errors }));
        if (result.titleTag !== 'H2' || result.titleSize !== result.sectionSize || result.phrases.length !== 6 || result.phrases.some(phrase => phrase.size !== result.bodySize || phrase.animation === 'none') || result.disclaimerParagraphs || result.overflow || errors.length) throw new Error('Analysis preview check failed');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const quiet = await page.locator('.revenue-feature-icon').evaluateAll(icons => icons.every(icon => getComputedStyle(icon).animationName === 'none'));
        if (!quiet) throw new Error('Reduced motion is not respected');
        if (locale === 'en') await page.locator('#revenue').screenshot({ path: `.github/analysis-emphasis-${width}.png` });
        await page.close();
      }
    }
    console.log('PASS analysis hierarchy, six animated branded bars, disclaimer removal, FR/EN/AR, desktop/tablet/mobile, reduced motion, loaded logos and no runtime errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
