import { expect, test } from './helpers';

test.describe('UUID Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/uuid');
    await expect(page).toHaveTitle(/UUID Generator/);
  });

  test('generates a single v4 UUID', async ({ page }) => {
    // Select v4 version (should be default, but let's select it explicitly)
    await page.getByRole('button', { name: /UUID Version/ }).click();
    await page.getByRole('option', { name: 'v4' }).waitFor();
    await page.getByRole('option', { name: 'v4' }).click();

    // Click generate button
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    // Verify a UUID is generated
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const generatedUuid = page
      .locator('div')
      .filter({ hasText: uuidRegex })
      .first();
    await expect(generatedUuid).toBeVisible();
    await expect(generatedUuid).toHaveText(uuidRegex);
  });

  test('generates multiple v4 UUIDs at once', async ({ page }) => {
    // Select v4 version
    await page.getByRole('button', { name: /UUID Version/ }).click();
    await page.getByRole('option', { name: 'v4' }).waitFor();
    await page.getByRole('option', { name: 'v4' }).click();

    // Set count to 5
    const countInput = page.getByRole('textbox', {
      name: /How many to generate/,
    });
    await countInput.clear();
    await countInput.fill('5');

    // Click generate button
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    // Verify 5 UUIDs are generated
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const generatedUuids = page.locator('div').filter({ hasText: uuidRegex });
    await expect(generatedUuids).toHaveCount(5);

    // Verify all generated UUIDs are unique and valid v4 UUIDs
    const uuidTexts = await generatedUuids.allTextContents();
    const uniqueUuids = new Set(uuidTexts);
    expect(uniqueUuids.size).toBe(5); // All UUIDs should be unique

    for (const uuid of uuidTexts) {
      expect(uuid).toMatch(uuidRegex);
    }
  });

  test('can select v3 and see required fields appear', async ({ page }) => {
    // Select v3 version
    await page.getByRole('button', { name: /UUID Version/ }).click();
    await page.getByRole('option', { name: 'v3' }).waitFor();
    await page.getByRole('option', { name: 'v3' }).click();

    // Verify that name and namespace fields appear for v3
    await expect(page.getByRole('textbox', { name: /Name/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Namespace/ })).toBeVisible();

    // Verify count input is not visible for v3 (deterministic UUID)
    await expect(
      page.getByRole('textbox', { name: /How many to generate/ }),
    ).toBeHidden();
  });

  test('form fields appear/disappear based on UUID version selection', async ({
    page,
  }) => {
    // Initially with v4, name and namespace fields should not be visible
    await expect(page.getByRole('textbox', { name: /Name/ })).toBeHidden();
    await expect(page.getByRole('button', { name: /Namespace/ })).toBeHidden();

    // Select v3 version
    await page.getByRole('button', { name: /UUID Version/ }).click();
    await page.getByRole('option', { name: 'v3' }).waitFor();
    await page.getByRole('option', { name: 'v3' }).click();

    // Name and namespace fields should appear for v3
    await expect(page.getByRole('textbox', { name: /Name/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Namespace/ })).toBeVisible();

    // Switch back to v4
    await page.getByRole('button', { name: /UUID Version/ }).click();
    await page.getByRole('option', { name: 'v4' }).waitFor();
    await page.getByRole('option', { name: 'v4' }).click();

    // Fields should disappear again
    await expect(page.getByRole('textbox', { name: /Name/ })).toBeHidden();
    await expect(page.getByRole('button', { name: /Namespace/ })).toBeHidden();
  });
});
