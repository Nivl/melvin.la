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

  describe('Multi-language string counting', () => {
    it('counts English text correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = 'Hello world test';

      // First clear and ensure it's empty
      await user.clear(textarea);
      expect(textarea.value).toBe('');

      // Type the text
      await user.type(textarea, text);

      // Verify the text was typed correctly - should be exactly 16 characters
      expect(textarea.value).toBe(text);
      expect(text.length).toBe(16); // Verify our expectation

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count (16 characters: "Hello world test") and byte count (16 bytes for ASCII)
      const sixteenElements = screen.getAllByText('16');
      expect(sixteenElements.length).toBeGreaterThanOrEqual(2); // char count and byte count

      // Check word count (3 words)
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    });

    it('counts Korean text without spaces correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = '안녕하세요'; // "Hello" in Korean (5 characters)

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count (5 Korean characters)
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);

      // Check word count (1 word - no spaces in Korean)
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);

      // Check byte count (Korean characters are 3 bytes each in UTF-8: 5 * 3 = 15)
      expect(screen.getAllByText('15').length).toBeGreaterThan(0);
    });

    it('counts French text with accents correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = 'Café français'; // "French café" (13 characters including space)

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count (13 characters)
      expect(screen.getAllByText('13').length).toBeGreaterThan(0);

      // Check word count (2 words)
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);

      // Check byte count (accented characters take more bytes: é=2, ç=2, à=2, others=1 each)
      // C(1) + a(1) + f(1) + é(2) + space(1) + f(1) + r(1) + a(1) + n(1) + ç(2) + a(1) + i(1) + s(1) = 15 bytes
      expect(screen.getAllByText('15').length).toBeGreaterThan(0);
    });

    it('counts Chinese text correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = '你好世界'; // "Hello world" in Chinese (4 characters)

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count (4 Chinese characters)
      expect(screen.getAllByText('4').length).toBeGreaterThan(0);

      // Check word count (1 word - no spaces in Chinese)
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);

      // Check byte count (Chinese characters are 3 bytes each in UTF-8: 4 * 3 = 12)
      expect(screen.getAllByText('12').length).toBeGreaterThan(0);
    });

    it('counts mixed language text correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = 'Hello 안녕 café 你好'; // Mixed: English, Korean, French, Chinese

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count: H(1) + e(1) + l(1) + l(1) + o(1) + space(1) + 안(1) + 녕(1) + space(1) + c(1) + a(1) + f(1) + é(1) + space(1) + 你(1) + 好(1) = 16 characters
      expect(screen.getAllByText('16').length).toBeGreaterThan(0);

      // Check word count (4 words separated by spaces)
      expect(screen.getAllByText('4').length).toBeGreaterThan(0);

      // Check byte count: Hello(5) + space(1) + 안녕(6) + space(1) + café(5) + space(1) + 你好(6) = 25 bytes
      expect(screen.getAllByText('25').length).toBeGreaterThan(0);
    });

    it('handles empty text correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;

      await user.clear(textarea);

      // All counts should be 0 for empty text
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThanOrEqual(3);
    });

    it('handles whitespace-only text correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = '   '; // 3 spaces

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Check character count (3 spaces) and byte count (3 bytes for 3 spaces)
      const threeElements = screen.getAllByText('3');
      expect(threeElements.length).toBeGreaterThanOrEqual(2);

      // Check word count (0 words - only whitespace)
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });

    it('counts Korean sentence without spaces correctly', async () => {
      const user = userEvent.setup();
      render(<StringLength />);

      const textarea = screen.getAllByTestId(
        'string-input',
      )[0] as HTMLTextAreaElement;
      const text = '오늘날씨가좋습니다'; // "The weather is nice today" in Korean (9 characters, no spaces)

      await user.clear(textarea);
      await user.type(textarea, text);

      // Verify the text was typed correctly
      expect(textarea.value).toBe(text);

      // Wait a bit for state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check character count (9 Korean characters)
      expect(screen.getAllByText('9').length).toBeGreaterThan(0);

      // Check word count (1 word - no spaces, treated as single word)
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);

      // Check byte count (Korean characters are 3 bytes each in UTF-8: 9 * 3 = 27)
      expect(screen.getAllByText('27').length).toBeGreaterThan(0);
    });
  });
});
