import { expect } from "@playwright/test";

import { test } from "./helpers";

test.describe("beatmaker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/games/beatmaker");
    await expect(page.getByRole("button", { name: "Kick step 1 on" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Kick step 2 off" })).toBeVisible();
  });

  test("page loads with Play button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  });

  test("Play button changes to Stop on click", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
  });

  test("Stop returns to Play button", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Stop" }).click();
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  });

  test("step buttons can be toggled", async ({ page }) => {
    const offStep = page.getByRole("button", { name: "Kick step 2 off" });
    const onStep = page.getByRole("button", { name: "Kick step 2 on" });

    await offStep.click();

    await expect(onStep).toHaveAttribute("aria-pressed", "true");
  });

  test("URL hash updates after interaction", async ({ page }) => {
    await page.getByRole("button", { name: "Kick step 2 off" }).click();
    await expect(page.getByRole("button", { name: "Kick step 2 on" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.waitForFunction(() => globalThis.location.hash.startsWith("#v1:"));
    const url = page.url();
    expect(url).toContain("#v1:");
  });

  test("shared URL loads the same pattern", async ({ page, context }) => {
    const offStep = page.getByRole("button", { name: "Kick step 2 off" });
    const onStep = page.getByRole("button", { name: "Kick step 2 on" });

    await offStep.click();
    await expect(onStep).toHaveAttribute("aria-pressed", "true");
    await page.waitForFunction(() => globalThis.location.hash.startsWith("#v1:"));
    const sharedUrl = page.url();

    const newPage = await context.newPage();
    await newPage.goto(sharedUrl);
    await expect(newPage.getByRole("button", { name: "Kick step 2 on" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await newPage.close();
  });
});
