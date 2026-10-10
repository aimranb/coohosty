import { expect, test } from '@playwright/test';

test('city cohosting keeps the same services, transparent arithmetic and city on form continuation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [city, name] of [['marrakech', 'Marrakech'], ['casablanca', 'Casablanca'], ['tanger', 'Tanger']]) {
    await page.goto(`/fr/services/conciergerie-${city}`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toContainText(name);
    await expect(page.locator('#services li')).toHaveCount(12);
    const calculator = page.locator('[data-commission]');
    await calculator.scrollIntoViewIfNeeded();
    await expect(calculator.locator('[data-commission-value]')).toContainText('2');
    const range = calculator.getByRole('slider');
    await range.focus();
    await range.press('Home');
    await range.press('ArrowRight');
    await expect(range).toHaveValue('1500');
    await expect(calculator.locator('[data-commission-value]')).toContainText('300');
    await expect(calculator.locator('[data-balance-value]')).toContainText('1');
    await calculator.getByRole('button', { name: 'Le total du mois' }).click();
    await expect(calculator.locator('[data-commission-value]')).toContainText('300');
    await expect(calculator.getByRole('button', { name: 'Le total du mois' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#estimate-city')).toHaveValue(name);
    await page.locator('#estimate-address').fill('Résidence test, appartement 4');
    await page.locator('#estimate button.estimate-next').click();
    await expect(page).toHaveURL(new RegExp(`/fr/estimate\\?market=${city}$`));
    await expect(page.locator('#estimate-objective')).toBeVisible();
    await page.reload();
    await expect(page.locator('#estimate-objective')).toBeVisible();
    const property = await page.evaluate(() => JSON.parse(sessionStorage.getItem('coohosty-estimate-property-fr')!));
    expect(property.city).toBe(name);
    expect(property.plan).toBe('COHOST');
    await expect(page.locator('.estimate-home-link')).toHaveAttribute('href', `/fr/services/conciergerie-${city}#estimate`);
  }
  expect(errors).toEqual([]);
});

test('city pages support translated layouts and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}/services/conciergerie-tanger`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await page.locator('#commission').scrollIntoViewIfNeeded();
    expect(await page.locator('#commission').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(page.locator('#cohosting a')).toHaveCount(3);
  }
});
