import { expect, test } from './helpers';

test('Loads the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Melvin Laplanche/);
});
