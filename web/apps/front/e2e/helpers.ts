import { expect } from '@playwright/test';

export function expectToBeThruthy<T>(
  value: T | undefined | null,
): asserts value is T {
  expect(value).toBeTruthy();
}
