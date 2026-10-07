import { expect, test } from '@playwright/test';
test('hero loads one photo on entry and manual navigation loads valid photos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const gallery = page.locator('.hero-property');
  await expect(gallery.locator('img')).toHaveCount(1);
  await expect.poll(() => gallery.locator('[data-active=true] img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await gallery.getByRole('button', { name: 'Next photo', exact: true }).click();
  await expect(gallery.locator('[data-active=true] img')).toHaveAttribute('src', /hero-interior-6/);
  await gallery.getByRole('button', { name: 'Previous photo', exact: true }).click();
  await expect(gallery.locator('[data-active=true] img')).toHaveAttribute('src', /hero-airbnb/);
  await gallery.getByRole('button', { name: 'Previous photo', exact: true }).click();
  await expect(gallery.locator('[data-active=true] img')).toHaveAttribute('src', /hero-interior-4/);
});
test('FAQ expands with keyboard navigation', async ({ page }) => {
  await page.goto('/en');
  const items = page.locator('#faq .faq-item');
  await expect(items).toHaveCount(8);
  await items.first().locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(items.first()).toHaveAttribute('open', '');
  await expect(items.first().locator('.faq-answer')).toBeVisible();
});
