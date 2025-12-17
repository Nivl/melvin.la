import { expect, test } from '@playwright/test';

test('Blog loads article and navigates to them', async ({ page }) => {
  await page.goto('/blog');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blog/);

  const articleTitle = 'Engineering 101: Understanding Pointers';

  // Click on the first article link.
  await page.getByRole('link', { name: articleTitle }).click();

  // Expects page to have loaded.
  await expect(page).toHaveTitle(new RegExp(articleTitle));
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole('heading', { name: 'Installation' }),
//   ).toBeVisible();
// });
