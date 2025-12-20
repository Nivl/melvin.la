import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { Conway } from './Conway';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Conway />);
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
  expect(getByLabelText('Grid Size', { selector: 'input' })).toBeDefined();
  expect(getByRole('switch', { name: 'Play' })).toBeDefined();
});
