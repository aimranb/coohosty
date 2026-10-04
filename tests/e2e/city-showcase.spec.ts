import { expect, test } from '@playwright/test';

test('compact packages preserve expandable services and plan selection', async ({ page }) => {
  await page.goto('/en');
  const cards = page.locator('.comparison-card');
  await expect(cards).toHaveCount(3);
  const counts = [9, 19, 28];
  for (let index = 0; index < 3; index++) {
    await expect(cards.nth(index).locator('.plan-highlights li')).toHaveCount(4);
    await expect(cards.nth(index).locator('.plan-details')).not.toHaveAttribute('open', '');
    await cards.nth(index).locator('.plan-details summary').click();
    await expect(cards.nth(index).locator('.plan-details')).toHaveAttribute('open', '');
    await expect(cards.nth(index).locator('.comparison-row')).toHaveCount(counts[index]);
    await expect(cards.nth(index).locator('.is-included')).toHaveCount(counts[index]);
    await expect(cards.nth(index).locator('.is-unavailable')).toHaveCount(0);
    await expect(cards.nth(index).getByRole('link', { name: 'Talk on WhatsApp' })).toHaveAttribute('href', 'https://wa.me/212663448785');
    await cards.nth(index).locator('.plan-details summary').click();
  }
  await expect(page.locator('.package-icon')).toHaveCount(0);
  await cards.nth(1).getByRole('link', { name: 'Optimize my revenue' }).click();
  await expect(page.getByLabel('Desired plan')).toHaveValue('OPTIMIZE');
});

test('city selection pauses rotation and exposes the selected photograph', async ({ page }) => {
  await page.goto('/en');
  const carousel = page.getByRole('region', { name: 'Explore Morocco' });
  await carousel.getByRole('button', { name: 'Tangier', exact: true }).click();
  await expect(carousel.getByRole('heading', { name: 'Tangier', exact: true })).toBeVisible();
  await expect(carousel.getByRole('button', { name: 'Tangier', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(carousel.getByRole('button', { name: 'Resume slideshow' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.destination-card')).toHaveCount(6);
  await expect(page.locator('.platform-logo')).toHaveCount(3);
});

test('reduced motion keeps the city slideshow stationary', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const carousel = page.getByRole('region', { name: 'Explore Morocco' });
  await expect(carousel).toHaveAttribute('data-paused', 'true');
  await expect(carousel.getByRole('heading', { name: 'Casablanca' })).toBeVisible();
});
