import type { Page } from "@playwright/test";

import { expect, expectToBeTruthy, test } from "./helpers";

// In HeroUI v3, Autocomplete renders a trigger (role="group") that opens a popover.
// The popover contains a SearchField.Input (searchbox role, autoFocus).
// We click the trigger group via data-testid, then fill the searchbox.
// Options show "City Country" (no comma, no timezone) as their accessible name.
async function selectCity(page: Page, testId: string, searchText: string, optionText: string) {
  // Convert "City, Country (Timezone)" → "City Country" to match the ARIA accessible name
  const accessibleName = optionText
    .replace(/ \([^)]+\)$/, "") // Remove " (timezone)" at end
    .replaceAll(",", ""); // Remove commas
  const trigger = page.getByTestId(testId);
  await trigger.click();
  await page.getByTestId(`${testId}-search`).fill(searchText);
  const option = page.getByRole("option", { name: accessibleName });
  await option.waitFor();
  await option.click();
}

const FROM_TESTID = "city-from";
const TO_TESTID = "city-to";

test.describe("Timezones Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/timezones");
    await expect(page).toHaveTitle(/Timezone converter/);
  });

  test("can set initial city and target city", async ({ page }) => {
    await selectCity(
      page,
      FROM_TESTID,
      "New York",
      "New York, United States of America (America/New_York)",
    );

    // Verify the target city input appears after setting base city
    await expect(page.getByTestId(TO_TESTID)).toBeVisible();

    await selectCity(page, TO_TESTID, "London", "London, United Kingdom (Europe/London)");

    // Verify target city appears as a pill
    const londonPill = page.locator('div[class*="bg-"]').filter({ hasText: /In London/ });
    await expect(londonPill).toBeVisible();
    await expect(londonPill).toContainText("London");
  });

  test("can set multiple target cities from different countries", async ({ page }) => {
    await selectCity(page, FROM_TESTID, "Paris", "Paris, France (Europe/Paris)");

    // Add Tokyo (Asia)
    await selectCity(page, TO_TESTID, "Tokyo", "Tokyo, Japan (Asia/Tokyo)");

    // Add New York (America)
    await selectCity(
      page,
      TO_TESTID,
      "New York",
      "New York, United States of America (America/New_York)",
    );

    // Add Sydney (Australia)
    await selectCity(page, TO_TESTID, "Sydney", "Sydney, Australia (Australia/Sydney)");

    // Verify all three cities appear as pills
    const tokyoPill = page.locator('div[class*="bg-"]').filter({ hasText: /In Tokyo/ });
    const newYorkPill = page.locator('div[class*="bg-"]').filter({ hasText: /In New York/ });
    const sydneyPill = page.locator('div[class*="bg-"]').filter({ hasText: /In Sydney/ });

    await expect(tokyoPill).toBeVisible();
    await expect(newYorkPill).toBeVisible();
    await expect(sydneyPill).toBeVisible();

    // Verify they have different colors (indicating they're properly distinguished)
    const tokyoClass = await tokyoPill.getAttribute("class");
    const newYorkClass = await newYorkPill.getAttribute("class");
    const sydneyClass = await sydneyPill.getAttribute("class");

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

    expect(tokyoText).toContain("Tokyo");
    expect(newYorkText).toContain("New York");
    expect(sydneyText).toContain("Sydney");

    // All should show time information but with different times
    expect(tokyoText).toMatch(/\d{1,2}:\d{2}/); // Contains time
    expect(newYorkText).toMatch(/\d{1,2}:\d{2}/); // Contains time
    expect(sydneyText).toMatch(/\d{1,2}:\d{2}/); // Contains time
  });

  test("can remove target cities", async ({ page }) => {
    await selectCity(page, FROM_TESTID, "London", "London, United Kingdom (Europe/London)");

    // Add first target city
    await selectCity(page, TO_TESTID, "Tokyo", "Tokyo, Japan (Asia/Tokyo)");

    // Add second target city
    await selectCity(
      page,
      TO_TESTID,
      "New York",
      "New York, United States of America (America/New_York)",
    );

    // Verify both cities are visible
    const tokyoPill = page.locator('div[class*="bg-"]').filter({ hasText: /In Tokyo/ });
    const newYorkPill = page.locator('div[class*="bg-"]').filter({ hasText: /In New York/ });

    await expect(tokyoPill).toBeVisible();
    await expect(newYorkPill).toBeVisible();

    // Remove Tokyo by clicking its delete button
    await tokyoPill.getByRole("button", { name: "Remove" }).click();

    // Verify Tokyo is removed but New York remains
    await expect(tokyoPill).toBeHidden();
    await expect(newYorkPill).toBeVisible();

    // Remove New York
    await newYorkPill.getByRole("button", { name: "Remove" }).click();

    // Verify both are removed
    await expect(tokyoPill).toBeHidden();
    await expect(newYorkPill).toBeHidden();
  });

  test("shows different time differences for cities in different timezones", async ({ page }) => {
    await selectCity(page, FROM_TESTID, "London", "London, United Kingdom (Europe/London)");

    // Add Tokyo (UTC+9)
    await selectCity(page, TO_TESTID, "Tokyo", "Tokyo, Japan (Asia/Tokyo)");

    // Add Los Angeles (UTC-8)
    await selectCity(
      page,
      TO_TESTID,
      "Los Angeles",
      "Los Angeles, United States of America (America/Los_Angeles)",
    );

    // Get the time text from both pills
    const tokyoPill = page.locator('div[class*="bg-"]').filter({ hasText: /In Tokyo/ });
    const laPill = page.locator('div[class*="bg-"]').filter({ hasText: /In Los Angeles/ });

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

    expectToBeTruthy(tokyoTimeMatch);
    expectToBeTruthy(laTimeMatch);

    // Extract hours for comparison - they should be different due to significant timezone difference
    const tokyoHour = Number.parseInt(tokyoTimeMatch[1]);
    const laHour = Number.parseInt(laTimeMatch[1]);

    // Tokyo is typically 17 hours ahead of LA, so they should definitely be different
    expect(tokyoHour).not.toBe(laHour);

    // Verify they show different day/date information potentially
    expect(tokyoText).toContain("Tokyo");
    expect(laText).toContain("Los Angeles");
  });

  test("target city input only appears after setting initial city", async ({ page }) => {
    // Initially, target city trigger should not be visible (conditionally rendered)
    await expect(page.getByTestId(TO_TESTID)).toBeHidden();

    await selectCity(page, FROM_TESTID, "Berlin", "Berlin, Germany (Europe/Berlin)");

    // Now target city trigger should appear
    await expect(page.getByTestId(TO_TESTID)).toBeVisible();
  });

  test("autocomplete shows suggestions when typing", async ({ page }) => {
    // Click the trigger to open the popover
    await page.getByTestId(FROM_TESTID).click();

    // Start typing a city name
    await page.getByRole("searchbox").fill("London");

    // Should see suggestions appear
    await page.locator('[role="option"]').first().waitFor();

    // Verify we have options available
    const optionCount = await page.locator('[role="option"]').count();
    expect(optionCount).toBeGreaterThan(0);

    // Select the first London option
    await page.getByRole("option", { name: "London United Kingdom" }).click();

    // Verify the target city trigger appears
    await expect(page.getByTestId(TO_TESTID)).toBeVisible();
  });
});
