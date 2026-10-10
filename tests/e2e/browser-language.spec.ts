import { expect, test } from '@playwright/test';

test.use({ locale: 'ar-MA' });

test('browser language selects the homepage and manual language choice persists', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/?ref=browser');
  await expect(page).toHaveURL(/\/ar\?ref=browser$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('.language-select').selectOption('en');
  await expect(page).toHaveURL(/\/en\?ref=browser$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const preference = (await context.cookies()).find(cookie => cookie.name === 'coohosty-locale');
  expect(preference?.value).toBe('en');
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await page.goto('/fr/services/conciergerie-tanger');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('#estimate-city')).toHaveValue('Tanger');
});
