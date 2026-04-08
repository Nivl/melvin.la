/* eslint-disable import/no-default-export */

import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Run your local dev server before starting the tests */
  webServer: {
    // In CI, run a production build to avoid JIT compilation delays that
    // cause React hydration to complete after Playwright starts interacting.
    command: process.env.CI ? "pnpm run build && pnpm run start" : "pnpm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // Allow enough time for `next build` to complete in CI
    timeout: process.env.CI ? 5 * 60 * 1000 : 60 * 1000,
    // .env.development sets NEXT_PUBLIC_API_URL but next build reads
    // .env.production (not .env.development), so the var would be missing
    // and the app would make relative requests instead of http://localhost.
    // MSW handlers also default to http://localhost, so the URLs must match.
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost",
    },
  },
  // Default test options
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // MSW has issues running browsers in parallel as of 2025-12-19
    // https://github.com/mswjs/playwright/issues/15
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // MSW has known issues with Mobile Safari as of 2025-12-19
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});
