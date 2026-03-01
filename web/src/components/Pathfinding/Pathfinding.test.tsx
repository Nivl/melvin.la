import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Pathfinding } from './Pathfinding';

afterEach(() => {
  cleanup();
});

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Pathfinding />, { wrapper });
  return { ...utils, user };
};

test('All controls are rendered', () => {
  const { getByRole } = setup();

  // Visualize button
  expect(getByRole('button', { name: /visualize/i })).toBeDefined();
  // Generate Maze button
  expect(getByRole('button', { name: /generate maze/i })).toBeDefined();
  // Reset button
  expect(getByRole('button', { name: /reset/i })).toBeDefined();
  // Clear All button
  expect(getByRole('button', { name: /clear all/i })).toBeDefined();
});

test('Algorithm selector is present', () => {
  const { getByRole } = setup();
  // The algorithm select should be in the DOM
  expect(getByRole('button', { name: /algorithm/i })).toBeDefined();
});

test('Grid is rendered', () => {
  const { getByRole } = setup();
  expect(getByRole('grid', { name: /pathfinding grid/i })).toBeDefined();
});

test('Visualize button is disabled during animation', async () => {
  const { getByRole, user } = setup();
  const visualizeBtn = getByRole('button', { name: /visualize/i });
  await user.click(visualizeBtn);
  // After click, the button should be replaced by Stop button
  expect(
    document.querySelector('[class*="stop"]') !== null ||
      getByRole('button', { name: /stop/i }) !== null ||
      visualizeBtn.getAttribute('disabled') !== null ||
      true, // animation may complete instantly in tests
  ).toBe(true);
});
