import { test, expect } from '@playwright/test';
test('localized pages render without runtime errors or overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const locale of ['fr', 'en', 'ar']) {
    await page.goto(`/${locale}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('#estimate')).toBeVisible();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  expect(errors).toEqual([]);
});
test('service offers link to the complete included service pages', async ({ page }) => {
  await page.goto('/en');
  const cards = page.locator('.comparison-card');
  await expect(cards).toHaveCount(3);
  for (const [index, plan] of ['audit', 'optimize', 'cohost'].entries()) {
    await expect(cards.nth(index).locator('.plan-more-link')).toHaveAttribute('href', `/en/services/${plan}`);
    await expect(cards.nth(index).locator('.plan-whatsapp')).toHaveAttribute('href', /^https:\/\/wa.me\//);
  }
  await cards.last().locator('.plan-more-link').click();
  await expect(page.locator('h1')).toHaveText('COHOST');
  await expect(page.locator('.service-detail-group li')).toHaveCount(12);
  await page.locator('.service-detail-form').first().click();
  await expect(page).toHaveURL(/plan=COHOST#estimate$/);
  await expect(page.locator('#estimate')).toBeVisible();
});
test('admin requests and exports require authentication', async ({ page, request }) => {
  await page.goto('/admin/requests');
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await request.get('/api/admin/export')).status()).toBe(401);
});
