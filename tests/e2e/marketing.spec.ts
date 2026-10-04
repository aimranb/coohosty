import { test, expect } from '@playwright/test';
test('localized pages and Arabic direction', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar']) { await page.goto(`/${locale}`); await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('html')).toHaveAttribute('lang', locale); await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr'); await expect(page.locator('#contact')).toBeVisible(); await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate(body => body.clientWidth)); }
});
test('plan selection, draft persistence and complete form submission', async ({ page }) => {
  await page.route('**/api/audit', async route => { const data = route.request().postDataJSON(); expect(data.plan).toBe('COHOST'); expect(data.consent).toBe(true); expect(data.city).toBe('Marrakech'); await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true }) }); });
  await page.goto('/en');
  await page.getByRole('link', { name: 'Delegate my hosting' }).click();
  await expect(page.getByLabel('Desired plan')).toHaveValue('COHOST');
  await page.getByLabel('Full name', { exact: true }).fill('Test Owner'); await page.getByLabel('Phone / WhatsApp', { exact: true }).fill('+212 600 000 000'); await page.getByLabel('Email', { exact: true }).fill('owner@example.com'); await page.getByLabel('Country of residence').fill('Morocco');
  await page.reload(); await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('Test Owner');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('City', { exact: true }).fill('Marrakech'); await page.getByLabel('Neighborhood').fill('Gueliz'); await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Property availability').fill('Available all year'); await page.getByRole('button', { name: 'Send my request' }).click(); await expect(page.getByText('Your consent is required.')).toBeVisible();
  await page.getByLabel('I agree that COOHOSTY may process').check(); await page.getByRole('button', { name: 'Send my request' }).click();
  await expect(page.getByText('Thank you. Your audit will be prepared shortly.')).toBeVisible(); expect(await page.evaluate(() => localStorage.getItem('cohosty-audit-v1'))).toBeNull();
});
test('admin requests and exports require authentication', async ({ page, request }) => {
  await page.goto('/admin/requests'); await expect(page).toHaveURL(/\/admin\/login$/);
  const response = await request.get('/api/admin/export'); expect(response.status()).toBe(401);
});
