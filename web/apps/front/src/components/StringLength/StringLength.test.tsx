import { render, screen } from '@testing-library/react';
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
});
