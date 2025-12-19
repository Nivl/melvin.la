import { expect, test } from './helpers';

test('Blog loads article list and navigates to them', async ({ page }) => {
  await page.goto('/blog');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blog/);

  const articleTitle = 'Engineering 101: Understanding Pointers';

  // Click on the first article link.
  await page.getByRole('link', { name: articleTitle }).click();

  // Expects page to have loaded.
  await expect(page).toHaveTitle(new RegExp(articleTitle));
});
