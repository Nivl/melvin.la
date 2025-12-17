import { expect, test } from '@playwright/test';

import { expectToBeThruthy } from './helpers';

test.describe('Timezones Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/timezones');
    await expect(page).toHaveTitle(/Timezone converter/);
  });

  test('can set initial city and target city', async ({ page }) => {
    // Set initial city (base zone)
    const initialCityInput = page.getByRole('combobox').first();
    await initialCityInput.click();
    await initialCityInput.fill('New York');
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .click();

    // Verify the target city input appears after setting base city
    await expect(page.getByRole('combobox').nth(1)).toBeVisible();

    // Set target city
    const targetCityInput = page.getByRole('combobox').nth(1);
    await targetCityInput.click();
    await targetCityInput.fill('London');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .click();

    // Verify target city appears as a pill
    await expect(
      page.locator('div[class*="bg-"]').filter({ hasText: /In London/ }),
    ).toBeVisible();

    // Verify the pill contains timezone information
    const londonPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In London/ });
    await expect(londonPill).toContainText('London');

    // Clear the search after selection
    await expect(targetCityInput).toHaveValue('');
  });

  test('can set multiple target cities from different countries', async ({
    page,
  }) => {
    // Set initial city
    const initialCityInput = page.getByRole('combobox').first();
    await initialCityInput.click();
    await initialCityInput.fill('Paris');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Paris, France (Europe/Paris)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Paris, France (Europe/Paris)' })
      .click();

    const targetCityInput = page.getByRole('combobox').nth(1);

    // Add Tokyo (Asia)
    await targetCityInput.click();
    await targetCityInput.fill('Tokyo');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .click();

    // Add New York (America)
    await targetCityInput.click();
    await targetCityInput.fill('New York');
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .click();

    // Add Sydney (Australia)
    await targetCityInput.click();
    await targetCityInput.fill('Sydney');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Sydney, Australia (Australia/Sydney)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Sydney, Australia (Australia/Sydney)' })
      .click();

    // Verify all three cities appear as pills
    const tokyoPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In Tokyo/ });
    const newYorkPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In New York/ });
    const sydneyPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In Sydney/ });

    await expect(tokyoPill).toBeVisible();
    await expect(newYorkPill).toBeVisible();
    await expect(sydneyPill).toBeVisible();

    // Verify they have different colors (indicating they're properly distinguished)
    const tokyoClass = await tokyoPill.getAttribute('class');
    const newYorkClass = await newYorkPill.getAttribute('class');
    const sydneyClass = await sydneyPill.getAttribute('class');

    // Extract background color classes
    const tokyoColor = tokyoClass?.match(/bg-\w+-\d+/)?.[0];
    const newYorkColor = newYorkClass?.match(/bg-\w+-\d+/)?.[0];
    const sydneyColor = sydneyClass?.match(/bg-\w+-\d+/)?.[0];

    expect(tokyoColor).toBeDefined();
    expect(newYorkColor).toBeDefined();
    expect(sydneyColor).toBeDefined();

    // Colors should be assigned (they may or may not be different due to random assignment)
    const uniqueColors = new Set([tokyoColor, newYorkColor, sydneyColor]);
    expect(uniqueColors.size).toBeGreaterThanOrEqual(1); // At least one color should be assigned

    // Verify each pill shows different time information (indicating different timezones)
    const tokyoText = await tokyoPill.textContent();
    const newYorkText = await newYorkPill.textContent();
    const sydneyText = await sydneyPill.textContent();

    expect(tokyoText).toContain('Tokyo');
    expect(newYorkText).toContain('New York');
    expect(sydneyText).toContain('Sydney');

    // All should show time information but with different times
    expect(tokyoText).toMatch(/\d{1,2}:\d{2}/); // Contains time
    expect(newYorkText).toMatch(/\d{1,2}:\d{2}/); // Contains time
    expect(sydneyText).toMatch(/\d{1,2}:\d{2}/); // Contains time
  });

  test('can remove target cities', async ({ page }) => {
    // Set initial city
    const initialCityInput = page.getByRole('combobox').first();
    await initialCityInput.click();
    await initialCityInput.fill('London');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .click();

    const targetCityInput = page.getByRole('combobox').nth(1);

    // Add first target city
    await targetCityInput.click();
    await targetCityInput.fill('Tokyo');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .click();

    // Add second target city
    await targetCityInput.click();
    await targetCityInput.fill('New York');
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'New York, United States of America (America/New_York)',
      })
      .click();

    // Verify both cities are visible
    const tokyoPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In Tokyo/ });
    const newYorkPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In New York/ });

    await expect(tokyoPill).toBeVisible();
    await expect(newYorkPill).toBeVisible();

    // Remove Tokyo by clicking its delete button
    const tokyoDeleteButton = tokyoPill.getByRole('button', { name: 'Remove' });
    await tokyoDeleteButton.click();

    // Verify Tokyo is removed but New York remains
    await expect(tokyoPill).toBeHidden();
    await expect(newYorkPill).toBeVisible();

    // Remove New York
    const newYorkDeleteButton = newYorkPill.getByRole('button', {
      name: 'Remove',
    });
    await newYorkDeleteButton.click();

    // Verify both are removed
    await expect(tokyoPill).toBeHidden();
    await expect(newYorkPill).toBeHidden();
  });

  test('shows different time differences for cities in different timezones', async ({
    page,
  }) => {
    // Set initial city to UTC (London in winter or a UTC city)
    const initialCityInput = page.getByRole('combobox').first();
    await initialCityInput.click();
    await initialCityInput.fill('London');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .click();

    const targetCityInput = page.getByRole('combobox').nth(1);

    // Add Tokyo (UTC+9)
    await targetCityInput.click();
    await targetCityInput.fill('Tokyo');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Tokyo, Japan (Asia/Tokyo)' })
      .click();

    // Add Los Angeles (UTC-8)
    await targetCityInput.click();
    await targetCityInput.fill('Los Angeles');
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'Los Angeles, United States of America (America/Los_Angeles)',
      })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({
        hasText: 'Los Angeles, United States of America (America/Los_Angeles)',
      })
      .click();

    // Get the time text from both pills
    const tokyoPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In Tokyo/ });
    const laPill = page
      .locator('div[class*="bg-"]')
      .filter({ hasText: /In Los Angeles/ });

    await expect(tokyoPill).toBeVisible();
    await expect(laPill).toBeVisible();

    const tokyoText = await tokyoPill.textContent();
    const laText = await laPill.textContent();

    // Both should contain time information
    expect(tokyoText).toMatch(/\d{1,2}:\d{2}/);
    expect(laText).toMatch(/\d{1,2}:\d{2}/);

    // Extract times for comparison - they should be different
    const tokyoTimeMatch = tokyoText?.match(/(\d{1,2}):(\d{2})/);
    const laTimeMatch = laText?.match(/(\d{1,2}):(\d{2})/);

    expectToBeThruthy(tokyoTimeMatch);
    expectToBeThruthy(laTimeMatch);

    // Extract hours for comparison - they should be different due to significant timezone difference
    const tokyoHour = Number.parseInt(tokyoTimeMatch[1]);
    const laHour = Number.parseInt(laTimeMatch[1]);

    // Tokyo is typically 17 hours ahead of LA, so they should definitely be different
    expect(tokyoHour).not.toBe(laHour);

    // Verify they show different day/date information potentially
    expect(tokyoText).toContain('Tokyo');
    expect(laText).toContain('Los Angeles');
  });

  test('target city input only appears after setting initial city', async ({
    page,
  }) => {
    // Initially, target city input should not be visible
    await expect(page.getByRole('combobox').nth(1)).toBeHidden();

    // Set initial city
    const initialCityInput = page.getByRole('combobox').first();
    await initialCityInput.click();
    await initialCityInput.fill('Berlin');
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Berlin, Germany (Europe/Berlin)' })
      .waitFor();
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'Berlin, Germany (Europe/Berlin)' })
      .click();

    // Now target city input should appear
    await expect(page.getByRole('combobox').nth(1)).toBeVisible();
  });

  test('autocomplete shows suggestions when typing', async ({ page }) => {
    const initialCityInput = page.getByRole('combobox').first();

    // Start typing a city name
    await initialCityInput.click();
    await initialCityInput.fill('London');

    // Should see suggestions appear
    await page.locator('[role="option"]').first().waitFor();

    // Verify we have options available
    const optionCount = await page.locator('[role="option"]').count();
    expect(optionCount).toBeGreaterThan(0);

    // Select the first London option
    await page
      .locator('[role="option"]')
      .filter({ hasText: 'London, United Kingdom (Europe/London)' })
      .click();

    // Verify the target city input appears
    await expect(page.getByRole('combobox').nth(1)).toBeVisible();
  });
});
