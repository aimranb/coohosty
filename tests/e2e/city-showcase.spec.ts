import { expect, test } from '@playwright/test';
test('city selection exposes the selected photograph and pauses rotation', async ({ page }) => {
  await page.goto('/en');
  const scene = page.locator('#destinations [data-running]');
  await scene.getByRole('button', { name: 'Tangier', exact: true }).click();
  await expect(scene.getByRole('heading', { name: 'Tangier', exact: true })).toBeVisible();
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
});
