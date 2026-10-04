import { test, expect } from '@playwright/test';

test('hero eyes hydrate safely during pointer movement and respect reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'This animation responds to a mouse pointer.');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  // Exercise the layout listener while streamed components are still hydrating.
  await page.addInitScript(() => {
    const interval = window.setInterval(() => window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 900, clientY: 300 })), 20);
    window.setTimeout(() => window.clearInterval(interval), 3000);
  });
  await page.route('**/_next/static/**/*.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.continue();
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/fr');
  const pupils = page.locator('.hero-note .pupil');
  await expect(pupils).toHaveCount(2);
  let pointerX = 900;
  await expect.poll(async () => {
    await page.mouse.move(pointerX++, 300);
    return pupils.first().evaluate(el => (el as SVGElement).style.transform);
  }, { timeout: 10000 }).not.toBe('translate(0px, 0px)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => pupils.first().evaluate(el => (el as SVGElement).style.transform)).toBe('translate(0px, 0px)');
  await page.waitForTimeout(500);
  expect(errors.filter(message => /hydrat|Minified React error/i.test(message))).toEqual([]);
});
