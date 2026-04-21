import type { NetworkFixture } from "@msw/playwright";
import { defineNetworkFixture } from "@msw/playwright";
import { expect, test as testBase } from "@playwright/test";
import type { AnyHandler } from "msw";

import { handler as getStats } from "#features/fortnite/backend/get-stats.mock";

export * from "@playwright/test";

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

export const expectToBeTruthy: <T>(value: T | undefined | null) => asserts value is T = (value) => {
  expect(value).toBeTruthy();
};
