import { test, expect } from '@playwright/test';
test('hero hydrates safely and honors a changed motion preference', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en');
  const gallery = page.locator('.hero-property');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute('data-motion', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(gallery).toHaveAttribute('data-motion', 'false');
  await expect.poll(() => gallery.locator('[data-active=true] img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
