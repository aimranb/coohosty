import { expect, test } from '@playwright/test';
test('city selection exposes the selected photograph and pauses rotation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en');
  const scene = page.locator('#destinations [data-running]');
  await scene.getByRole('button', { name: 'Tangier', exact: true }).click();
  await expect(scene.getByRole('heading', { name: 'Tangier', exact: true })).toBeVisible();
  await expect(page.locator('#estimate-city')).toHaveValue('Tanger');
  await expect(scene.getByRole('button', { name: 'Tangier', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(scene).toHaveAttribute('data-running', 'false');
  await expect(scene.getByRole('button', { name: 'Resume animation' })).toHaveAttribute('aria-pressed', 'true');
});
test('reduced motion keeps the city network stationary', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const scene = page.locator('#destinations [data-running]');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-reduced', 'true');
  await expect(scene).toHaveAttribute('data-running', 'false');
  await expect(scene.getByRole('heading', { name: 'Casablanca' })).toBeVisible();
  await expect(page.locator('#estimate-city')).toHaveValue('');
  await scene.locator('a[href="#estimate"]').click();
  await expect(page.locator('#estimate-city')).toHaveValue('Casablanca');
});

test('Marrakech is selectable on the homepage map and updates the form', async ({ page }) => {
  await page.goto('/fr');
  const scene = page.locator('#destinations [data-running]');
  await scene.getByRole('button', { name: 'Marrakech', exact: true }).click();
  await expect(scene.getByRole('heading', { name: 'Marrakech', exact: true })).toBeVisible();
  await expect(scene.getByRole('button', { name: 'Marrakech', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#estimate-city')).toHaveValue('Marrakech');
  await expect(scene.locator('img[alt^="Marrakech"]')).toHaveAttribute('src', /marrakech-original/);
  await expect(scene).toHaveAttribute('data-running', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
