import { expect, test } from '@playwright/test';

test('property gallery replaces the video and synchronizes both compact device screens', async ({ page }) => {
  await page.goto('/en');
  const section = page.locator('#showcase');
  await expect(section.locator('video')).toHaveCount(0);
  await expect(section.locator('.listing-switch')).toHaveCount(0);
  await expect(section.locator('.cohosty-gallery-bar')).toContainText('COOHOSTY');
  await expect(section.locator('.gallery-thumbnails')).toHaveCount(0);
  const next = section.getByRole('button', { name: 'Next photo', exact: true });
  const previous = section.getByRole('button', { name: 'Previous photo', exact: true });
  await expect(section.locator('.cohosty-gallery-bar')).toContainText('01 / 10');
  await previous.click();
  await expect(section.locator('.cohosty-gallery-bar')).toContainText('10 / 10');
  const laptop = section.locator('.gallery-device-photo img');
  const phone = section.locator('.editor-stack-main img');
  const laptopSource = new URL((await laptop.getAttribute('src'))!, 'http://localhost:3000');
  const phoneSource = new URL((await phone.getAttribute('src'))!, 'http://localhost:3000');
  expect(phoneSource.searchParams.get('url')).toBe(laptopSource.searchParams.get('url'));
  await next.click();
  await expect(section.locator('.cohosty-gallery-bar')).toContainText('01 / 10');
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(section.locator('.cohosty-gallery-bar')).toContainText('02 / 10');
  const frame = await section.locator('.phone-device').boundingBox();
  const island = await section.locator('.phone-island').boundingBox();
  expect(frame).not.toBeNull();
  expect(island).not.toBeNull();
  expect(Math.abs(island!.x + island!.width / 2 - frame!.x - frame!.width / 2)).toBeLessThan(2);

});

test('FAQ expands with keyboard navigation', async ({ page }) => {
  await page.goto('/en');
  const items = page.locator('#faq .faq-item');
  await expect(items).toHaveCount(8);
  const question = items.first().locator('summary');
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(items.first()).toHaveAttribute('open', '');
  await expect(items.first().locator('.faq-answer')).toBeVisible();
});
