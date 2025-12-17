import { expect } from '@playwright/test';

export function expectToBeDefined<T>(value: T | undefined): asserts value is T {
  expect(value).toBeDefined();
}

export function expectToBeThruthy<T>(
  value: T | undefined | null,
): asserts value is T {
  expect(value).toBeTruthy();
}
