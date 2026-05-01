import { expect, test } from "./helpers";

test("Blog loads article list and navigates to them", async ({ page }) => {
  await page.goto("/blog");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blog/);

  const articleTitle = "Engineering 101: Understanding Pointers";

  // Click on the first article link and wait for navigation to complete.
  await page.getByRole("link", { name: articleTitle }).click();
  await page.waitForURL(/engineering-101-understanding-pointers/, { timeout: 30_000 });

  // Expects page to have loaded with the article title.
  await expect(page).toHaveTitle(new RegExp(articleTitle));
});
