import { expect, test } from '@playwright/test';

test('Blog loads article and navigates to them', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Melvin Laplanche/);
});
