import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { StringLength } from './StringLength';

describe('StringLength', () => {
  it('renders without crashing', () => {
    expect(() => render(<StringLength />)).not.toThrow();
  });

  it('renders all count labels', () => {
    render(<StringLength />);
    expect(screen.getAllByText('Characters').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Words').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bytes (UTF-8)').length).toBeGreaterThan(0);
  });

  it('shows zero counts for empty input', () => {
    render(<StringLength />);

    // Should show 0 for all counts initially
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(3); // Characters, Words, Bytes (may have more from other tests)
  });

  it('can type in the textarea', async () => {
    const user = userEvent.setup();
    render(<StringLength />);

    const textarea = screen.getAllByTestId(
      'string-input',
    )[0] as HTMLTextAreaElement;
    await user.type(textarea, 'hello');

    expect(textarea.value).toBe('hello');
  });

  it('updates display when typing', async () => {
    const user = userEvent.setup();
    render(<StringLength />);

    const textarea = screen.getAllByTestId('string-input')[0];
    await user.type(textarea, 'test');

    // After typing, we should not see all zeros anymore
    const allElements = screen.getAllByText(/\d+/);
    const hasNonZero = allElements.some(el => el.textContent !== '0');
    expect(hasNonZero).toBe(true);
  });

  it('has functional input element', async () => {
    const user = userEvent.setup();
    render(<StringLength />);

    const textareas = screen.getAllByTestId('string-input');
    const textarea = textareas.at(-1) as HTMLTextAreaElement; // Get the last one to avoid interference

    // Should accept input
    await user.clear(textarea);
    await user.type(textarea, 'Hello World');
    expect(textarea.value).toBe('Hello World');

    // Should be able to clear
    await user.clear(textarea);
    expect(textarea.value).toBe('');
  });
});
