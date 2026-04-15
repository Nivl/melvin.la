import { expect, test as testBase } from "@playwright/test";
export * from "@playwright/test";
import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright";
import type { AnyHandler } from "msw";

import { e2eHandler as getStats } from "#features/fortnite/backend/getStats.mock";

type Fixtures = {
  handlers: AnyHandler[];
  network: NetworkFixture;
};

export const test = testBase.extend<Fixtures>({
  // Create a fixture that will control the network in your tests.
  handlers: [getStats],
  network: [
    async ({ context, handlers }, use) => {
      const network = defineNetworkFixture({
        context,
        handlers,
      });

      await network.enable();
      await use(network);
      await network.disable();
    },
    { auto: true },
  ],
});

export function expectToBeTruthy<T>(value: T | undefined | null): asserts value is T {
  expect(value).toBeTruthy();
}
