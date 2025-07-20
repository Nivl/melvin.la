import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';

import { Timestamp } from './Timestamp';

afterEach(() => {
  cleanup();
});

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Timestamp />);
  return {
    ...utils,
    user,
  };
};

test('All the elements are on the page', () => {
  const { getByRole, getByLabelText } = setup();

  expect(
    getByRole('heading', { level: 1, name: 'Timestamp Lookup' }),
  ).toBeDefined();

  expect(getByLabelText('Timestamp')).toBeDefined();
});

test('Inserting a timestamp add it to the timestamp list', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');
  expect(input).toBeDefined();

  await user.type(input, '1752974231');
  await user.keyboard('{Enter}');

  expect(await findByText('2025/07/20 01:17:11 UTC')).toBeDefined();
});
