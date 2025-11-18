import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  await page.getByRole('button', { name: 'Search (Ctrl+K)' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).press('CapsLock');
  await page.getByRole('searchbox', { name: 'Search' }).fill('XYZ');
  await page.getByRole('searchbox', { name: 'Search' }).press('CapsLock');
  await page.getByRole('searchbox', { name: 'Search' }).fill('Test');
  await page.getByRole('searchbox', { name: 'Search' }).press('Enter');
});