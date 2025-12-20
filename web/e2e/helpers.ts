import { expect, test as testBase } from '@playwright/test';
export * from '@playwright/test';
import { createNetworkFixture, type NetworkFixture } from '@msw/playwright';

import { handlers as mockedHandlers } from '../src/backend/mocks/handlers';

type Fixtures = {
  network: NetworkFixture;
};

export const test = testBase.extend<Fixtures>({
  // Create a fixture that will control the network in your tests.
  network: createNetworkFixture({
    initialHandlers: mockedHandlers,
  }),
});

export function expectToBeThruthy<T>(
  value: T | undefined | null,
): asserts value is T {
  expect(value).toBeTruthy();
}
