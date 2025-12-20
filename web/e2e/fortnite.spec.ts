import { expect, test } from './helpers';

test.describe('Fortnite Tool', () => {
  test('main page loads correctly', async ({ page }) => {
    await page.goto('/tools/fortnite');

    await expect(page).toHaveTitle(/Fortnite Data/);
    await expect(
      page.getByRole('heading', { name: /See how well you are doing in/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /Or pick a famous content creator/i,
      }),
    ).toBeVisible();
  });

  test('clicking on a preset correctly loads a page with content', async ({
    page,
  }) => {
    await page.goto('/tools/fortnite');

    // Click on the first preset (Nikof)
    await page.getByRole('img', { name: 'Nikof' }).click();

    // Wait for URL to change
    await expect(page).toHaveURL(/\/tools\/fortnite\/M8%20N%C3%AEkof\//);

    // Wait for content to load - this is the main indicator that data was fetched successfully
    await expect(
      page.getByText(/That's how long you've spent in the game/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('searching for user "200" correctly loads a page with content', async ({
    page,
  }) => {
    await page.goto('/tools/fortnite');

    // Fill in the search form (debounced input, no submit button)
    const input = page.getByPlaceholder(/Account Name/i);
    await input.fill('200');

    // Wait for debounce and URL update
    await page.waitForURL(/.*200.*/);

    // Wait for content to load - this is the main indicator that data was fetched successfully
    await expect(
      page.getByText(/That's how long you've spent in the game/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('searching for user "400" displays data unavailable error', async ({
    page,
  }) => {
    await page.goto('/tools/fortnite');

    // Fill in the search form (debounced input, no submit button)
    const input = page.getByPlaceholder(/Account Name/i);
    await input.fill('400');

    // Wait for debounce and URL update
    await page.waitForURL(/.*400.*/);

    // Check for error message
    await expect(
      page.getByText(/Looks like the data aren't available right now/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('searching for user "403" displays private account error', async ({
    page,
  }) => {
    await page.goto('/tools/fortnite');

    // Fill in the search form (debounced input, no submit button)
    const input = page.getByPlaceholder(/Account Name/i);
    await input.fill('403');

    // Wait for debounce and URL update
    await page.waitForURL(/.*403.*/);

    // Check for error message
    await expect(
      page.getByText(/This gamer doesn't want you to see their data/i),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('searching for user "404" displays user not found error', async ({
    page,
  }) => {
    await page.goto('/tools/fortnite');

    // Fill in the search form (debounced input, no submit button)
    const input = page.getByPlaceholder(/Account Name/i);
    await input.fill('404');

    // Wait for debounce and URL update
    await page.waitForURL(/.*404.*/);

    // Wait for error message
    await expect(
      page.getByText(/Nobody goes by this name, on this platform/i),
    ).toBeVisible({ timeout: 15_000 });
  });
});
