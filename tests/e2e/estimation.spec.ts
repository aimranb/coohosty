import { test, expect, type Page } from '@playwright/test';
async function fillDetails(page: Page) {
  const bar = page.locator('#estimate');
  await bar.getByLabel('City in Morocco').fill('Sidi Ifni');
  await bar.getByLabel('Property address').fill('12 Rue du Port');
  await bar.getByRole('button', { name: 'Continue', exact: true }).click();
  await bar.getByLabel('What is your main goal with COOHOSTY?').selectOption('time');
  await bar.getByLabel('How long do you plan to short-let your property for?').selectOption('yearplus');
  await bar.getByLabel('When would you be ready to start?').selectOption('month');
  await bar.getByRole('button', { name: 'Continue', exact: true }).click();
  await bar.getByLabel('Your full name').fill('Test Owner');
  await bar.getByLabel('Your email').fill('owner@example.com');
  await bar.getByLabel('Phone / WhatsApp (optional)').fill('+212600000000');
  await bar.getByLabel('I agree that COOHOSTY may use').check();
  return bar;
}
test('property estimate validates steps, preserves answers and submits all requested details', async ({ page }) => {
  let submitted = false;
  await page.route('**/api/estimate', async route => {
    const data = route.request().postDataJSON();
    expect(data).toMatchObject({ type: 'apartment', bedrooms: '2', city: 'Sidi Ifni', address: '12 Rue du Port', objective: 'time', duration: 'yearplus', ready: 'month', fullName: 'Test Owner', email: 'owner@example.com', phone: '+212600000000', consent: true });
    expect(data.submissionKey).toMatch(/^[0-9a-f-]{36}$/);
    submitted = true;
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, delivery: 'sent', benchmark: { lower: 2000, upper: 3000, currency: 'EUR', provider: 'PriceLabs', listings: 25, bedrooms: 2, retrievedAt: '2026-10-04T00:00:00Z' } }) });
  });
  await page.goto('/en');
  const bar = page.locator('#estimate');
  await bar.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(bar.getByLabel('City in Morocco')).toBeFocused();
  await expect(bar.getByText('This field is required.').first()).toBeVisible();
  await fillDetails(page);
  await bar.getByRole('button', { name: 'Previous step' }).click();
  await expect(bar.getByLabel('How long do you plan to short-let your property for?')).toHaveValue('yearplus');
  await bar.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(bar.getByLabel('Your email')).toHaveValue('owner@example.com');
  await bar.getByRole('button', { name: 'Get my estimate' }).click();
  await expect(bar.getByRole('heading', { name: 'Your request is received' })).toBeVisible();
  await expect(bar.getByText(/A 2-bedroom rental in Sidi Ifni could generate/)).toBeVisible();
  await expect(bar.getByText(/PriceLabs · 25/)).toBeVisible();
  await expect(bar.getByText(/earnings are not guaranteed/)).toBeVisible();
  expect(submitted).toBe(true);
});
test('email failure retains details and WhatsApp prepares a complete message without claiming delivery', async ({ page }) => {
  await page.route('**/api/estimate', async route => {
    const email = route.request().postDataJSON().channel === 'email';
    await route.fulfill({ status: email ? 503 : 200, contentType: 'application/json', body: JSON.stringify(email ? { error: 'email_unavailable' } : { ok: true, delivery: 'whatsapp_prepared', benchmark: null }) });
  });
  await page.goto('/en');
  const bar = await fillDetails(page);
  // Email is enabled in the controlled preview; production defaults to WhatsApp if no sender is configured.
  if (await bar.getByRole('radio', { name: 'Email', exact: true }).isEnabled()) {
    await bar.getByRole('radio', { name: 'Email', exact: true }).check();
    await bar.getByRole('button', { name: 'Get my estimate' }).click();
    await expect(bar.getByRole('alert')).toContainText('Email is temporarily unavailable');
    await expect(bar.getByLabel('Your email')).toHaveValue('owner@example.com');
  }
  await bar.getByRole('radio', { name: 'WhatsApp', exact: true }).check();
  await bar.getByRole('button', { name: 'Get my estimate' }).click();
  await expect(bar.getByRole('heading', { name: 'Your WhatsApp message is ready' })).toBeVisible();
  const href = await bar.getByRole('link', { name: 'Open WhatsApp and send' }).getAttribute('href');
  const message = new URL(href!).searchParams.get('text')!;
  for (const text of ['Sidi Ifni', '12 Rue du Port', 'owner@example.com', '+212600000000', '2', 'Save time', 'A year or longer', 'Within a month']) expect(message).toContain(text);
  await expect(bar.getByRole('status')).toContainText('press Send');
});
test('all localized estimate forms fit the viewport', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar']) {
    await page.goto('/'+locale);
    await expect(page.locator('#estimate')).toBeVisible();
    await expect(page.locator('.hero-headline br')).toHaveCount(0);
    expect(await page.locator('.hero-headline').evaluate(el => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight) + 1)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
