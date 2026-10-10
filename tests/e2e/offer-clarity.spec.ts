import { expect, test } from '@playwright/test';

test('offers distinguish free estimates, quoted services and cohosting commission', async ({ page }) => {
  await page.goto('/fr', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-offer-terms="AUDIT"]')).toContainText('Sur devis');
  await expect(page.locator('[data-offer-terms="OPTIMIZE"]')).toContainText('Sur devis');
  await expect(page.locator('[data-offer-terms="COHOST"]')).toContainText('20 %');
  await expect(page.locator('.offer-scope')).toContainText('L’estimation initiale est gratuite');
  await expect(page.locator('#about-coohosty')).toContainText('COOHOSTY');
  const pricing = page.locator('#faq details').filter({ hasText: 'Comment sont fixés les tarifs' });
  await pricing.locator('summary').click();
  await expect(pricing.locator('.faq-answer')).toContainText('AUDIT et OPTIMIZE sont sur devis');
  await expect(pricing.locator('.faq-answer')).toContainText('20 %');
});

test('city photos load on selection and tool logos render with the initial markup', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const imageRequests: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'image') imageRequests.push(request.url()); });
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  const scene = page.locator('#destinations [data-running]');
  await expect(scene.locator('img')).toHaveCount(1);
  await expect(page.locator('.analytics-tool-logo > svg')).toHaveCount(3);
  await scene.getByRole('button', { name: 'Marrakech', exact: true }).click();
  await expect(scene.locator('img')).toHaveCount(2);
  await expect(scene.getByRole('heading', { name: 'Marrakech', exact: true })).toBeVisible();
  await expect(page.locator('#estimate-city')).toHaveValue('Marrakech');
  const selected = scene.locator('img[alt^="Marrakech"]');
  await expect.poll(() => selected.evaluate(image => (image as HTMLImageElement).naturalWidth), { timeout: 15000 }).toBeGreaterThan(0);
  expect(imageRequests.some(url => url.includes('/_next/image'))).toBe(false);
  expect(imageRequests.some(url => /fes-original|agadir-original|tanger-original|rabat-original|meknes-original/.test(url))).toBe(false);
});
