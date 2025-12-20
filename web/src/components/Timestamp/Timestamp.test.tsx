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

test('Input accepts numeric characters', async () => {
  const { user, getByLabelText } = setup();

  const input = getByLabelText('Timestamp') as HTMLInputElement;

  await user.type(input, '123456789');
  expect(input.value).toBe('123456789');
});

test('Inserting a timestamp add it to the timestamp list', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');
  expect(input).toBeDefined();

  await user.type(input, '1752974231');
  await user.keyboard('{Enter}');

  expect(await findByText('2025/07/20 01:17:11 UTC')).toBeDefined();
});

test('Converts seconds timestamp (10 digits) to correct date', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Unix timestamp for 2024-01-01 00:00:00 UTC
  await user.type(input, '1704067200');
  await user.keyboard('{Enter}');

  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
});

test('Converts milliseconds timestamp (13 digits) to correct date', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Milliseconds timestamp for 2024-01-01 00:00:00 UTC
  await user.type(input, '1704067200000');
  await user.keyboard('{Enter}');

  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
});

test('Converts microseconds timestamp (16 digits) to correct date', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Microseconds timestamp for 2024-01-01 00:00:00 UTC
  await user.type(input, '1704067200000000');
  await user.keyboard('{Enter}');

  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
});

test('Converts nanoseconds timestamp (19 digits) to correct date', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Nanoseconds timestamp for 2024-01-01 00:00:00 UTC
  await user.type(input, '1704067200000000000');
  await user.keyboard('{Enter}');

  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
});

test('Has delete button for timestamps', async () => {
  const { user, getByLabelText, findByText, getByRole } = setup();

  const input = getByLabelText('Timestamp');

  await user.type(input, '1704067200'); // 2024-01-01
  await user.keyboard('{Enter}');

  // Verify timestamp is added
  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();

  // Verify delete button exists with correct aria-label
  const deleteButton = getByRole('button', { name: /remove/i });
  expect(deleteButton).toBeDefined();
});

test('Delete button removes timestamp from list', async () => {
  const { user, getByLabelText, findByText, getByRole } = setup();

  const input = getByLabelText('Timestamp');

  // Add a timestamp
  await user.type(input, '1704067200'); // 2024-01-01
  await user.keyboard('{Enter}');

  // Verify timestamp is added
  const timestampElement = await findByText('2024/01/01 00:00:00 UTC');
  expect(timestampElement).toBeDefined();

  // Click the delete button
  const deleteButton = getByRole('button', { name: /remove/i });
  await user.click(deleteButton);

  // Wait a bit for animations to complete
  await new Promise(resolve => setTimeout(resolve, 600));

  // Verify timestamp is no longer in the document
  const { queryByText } = setup();
  expect(queryByText('2024/01/01 00:00:00 UTC')).toBeNull();
});

test('Can delete specific timestamp when multiple exist', async () => {
  const { user, getByLabelText, findByText, getAllByRole } = setup();

  const input = getByLabelText('Timestamp');

  // Add first timestamp
  await user.type(input, '1704067200'); // 2024-01-01
  await user.keyboard('{Enter}');

  // Add second timestamp
  await user.type(input, '1704153600'); // 2024-01-02
  await user.keyboard('{Enter}');

  // Verify both timestamps exist
  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
  expect(await findByText('2024/01/02 00:00:00 UTC')).toBeDefined();

  // Get all delete buttons and click the first one
  const deleteButtons = getAllByRole('button', { name: /remove/i });
  expect(deleteButtons.length).toBe(2);

  await user.click(deleteButtons[0]);

  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 600));

  // Check that we now have only one delete button remaining
  const remainingDeleteButtons = getAllByRole('button', { name: /remove/i });
  expect(remainingDeleteButtons.length).toBe(1);
});

test('Clears input after successful timestamp conversion', async () => {
  const { user, getByLabelText } = setup();

  const input = getByLabelText('Timestamp') as HTMLInputElement;

  await user.type(input, '1704067200');
  await user.keyboard('{Enter}');

  // Input should be cleared after successful conversion
  expect(input.value).toBe('');
});

test('Shows multiple timestamps in order', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Add first timestamp
  await user.type(input, '1704067200'); // 2024-01-01
  await user.keyboard('{Enter}');

  // Add second timestamp
  await user.type(input, '1704153600'); // 2024-01-02
  await user.keyboard('{Enter}');

  expect(await findByText('2024/01/01 00:00:00 UTC')).toBeDefined();
  expect(await findByText('2024/01/02 00:00:00 UTC')).toBeDefined();
});

test('Shows description about automatic format detection', () => {
  const { getByText } = setup();

  expect(
    getByText(
      'Automatically detects milliseconds, microseconds, and nanoseconds',
    ),
  ).toBeDefined();
});

test('Input has maxLength attribute set to 20', () => {
  const { getByLabelText } = setup();

  const input = getByLabelText('Timestamp') as HTMLInputElement;

  // Check that maxLength attribute is set
  expect(input.maxLength).toBe(20);
});

test('Handles edge case timestamps correctly', async () => {
  const { user, getByLabelText, findByText } = setup();

  const input = getByLabelText('Timestamp');

  // Unix epoch (0)
  await user.clear(input);
  await user.type(input, '0');
  await user.keyboard('{Enter}');

  expect(await findByText('1970/01/01 00:00:00 UTC')).toBeDefined();
});
