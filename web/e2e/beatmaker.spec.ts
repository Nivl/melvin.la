import { expect } from '@playwright/test';

import { test } from './helpers';

test.describe('Beatmaker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/games/beatmaker');
  });

  test('page loads with Play button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });

  test('Play button changes to Stop on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();
  });

  test('Stop returns to Play button', async ({ page }) => {
    await page.getByRole('button', { name: 'Play' }).click();
    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  });

  test('step buttons can be toggled', async ({ page }) => {
    // Find an initially-off step, capture its label, click it, then verify via the new "on" label.
    // We resolve the label up-front because the live locator re-evaluates after state changes.
    const offStep = page
      .locator('button[aria-label*=" step "][aria-pressed="false"]')
      .first();
    const offLabel = (await offStep.getAttribute('aria-label')) ?? '';
    const onLabel = offLabel.replace(/ off$/, ' on');

    await offStep.click();

    await expect(
      page.locator(`button[aria-label="${onLabel}"]`),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('URL hash updates after interaction', async ({ page }) => {
    // Toggle a step and wait for debounce (300ms + buffer)
    const steps = page.locator('button[aria-label*=" step "]').first();
    await steps.click();
    // Wait for debounce (300ms + buffer)
    await page.waitForFunction(() =>
      globalThis.location.hash.startsWith('#v1:'),
    );
    const url = page.url();
    expect(url).toContain('#v1:');
  });

  test('shared URL loads the same pattern', async ({ page, context }) => {
    // Toggle step 0 of first track, copy URL
    const firstStep = page.locator('button[aria-label*=" step "]').first();
    await firstStep.click();
    // Wait for debounce (300ms + buffer)
    await page.waitForFunction(() =>
      globalThis.location.hash.startsWith('#v1:'),
    );
    const sharedUrl = page.url();

    // Open in a new tab
    const newPage = await context.newPage();
    await newPage.goto(sharedUrl);
    const loadedStep = newPage.locator('button[aria-label*=" step "]').first();
    await expect(loadedStep).toHaveAttribute('aria-pressed', 'true');
    await newPage.close();
  });
});
