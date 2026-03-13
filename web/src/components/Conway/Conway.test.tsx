import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Conway } from './Conway';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Conway />, { wrapper });
  return {
    ...utils,
    user,
  };
};

test('All the elements are on the page', () => {
  const { getByRole, getByLabelText } = setup();

  expect(
    getByRole('heading', { level: 1, name: "Conway's Game of Life" }),
  ).toBeDefined();

  expect(getByLabelText('Speed', { selector: 'input' })).toBeDefined();
  expect(getByLabelText('Board Size', { selector: 'input' })).toBeDefined();
  expect(getByRole('button', { name: 'Play' })).toBeDefined();
  expect(getByRole('switch', { name: 'Wrap edges' })).toBeDefined();
});

test('Grid renders correct number of cells for default board size (25×25 = 625)', () => {
  const { getAllByRole } = setup();
  // Each cell is a div inside the grid container; the grid itself has role="grid"
  const grid = getAllByRole('grid')[0];
  expect(grid).toBeDefined();
  // Default boardSize is 25, so 625 cells
  expect(grid?.children.length).toBe(625);
});
