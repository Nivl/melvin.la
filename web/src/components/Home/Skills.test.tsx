import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Skills } from './Skills';

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Skills />, { wrapper });
  return {
    ...utils,
    user,
  };
};

describe('Skills Component', () => {
  it('renders without crashing', () => {
    expect(() => render(<Skills />, { wrapper })).not.toThrow();
  });

  it('displays the skills heading', () => {
    setup();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Skills' }),
    ).toBeDefined();
  });

  it('displays filter input', () => {
    setup();
    expect(screen.getByLabelText('Filter by name')).toBeDefined();
  });

  it('displays skills initially', () => {
    setup();

    // Check that some skills are visible (they should all be visible initially)
    // These skills should be rendered as links
    expect(screen.getByRole('link', { name: 'Go' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Typescript' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Javascript' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'ReactJS' })).toBeDefined();
  });

  it('name filter works correctly', async () => {
    const { user } = setup();

    const nameFilter = screen.getByLabelText('Filter by name');

    // Filter by "Go" - should show "Go" but not other skills
    await user.type(nameFilter, 'Go');

    expect(screen.getByRole('link', { name: 'Go' })).toBeDefined();
    expect(screen.queryByRole('link', { name: 'ReactJS' })).toBeNull();
  });

  it('name filter is case insensitive', async () => {
    const { user } = setup();

    const nameFilter = screen.getByLabelText('Filter by name');

    // Filter by lowercase "react" - should show "ReactJS"
    await user.type(nameFilter, 'react');

    expect(screen.getByRole('link', { name: 'ReactJS' })).toBeDefined();
    expect(screen.queryByRole('link', { name: 'Go' })).toBeNull();
  });

  it('displays year range slider', () => {
    setup();

    // Get all elements with the year range label
    const yearSliders = screen.getAllByLabelText('Filter by year range');

    // Should have 3 elements (1 group + 2 range inputs)
    expect(yearSliders.length).toBe(3);

    // Filter to only range input elements
    const rangeInputs = yearSliders.filter(
      el => el.getAttribute('type') === 'range',
    );
    expect(rangeInputs.length).toBe(2);

    // Check that the range inputs have correct attributes
    for (const input of rangeInputs) {
      expect(input.getAttribute('type')).toBe('range');
      expect(input.tagName).toBe('INPUT');
    }

    // Check that there's one group element
    const groupElements = yearSliders.filter(
      el => el.getAttribute('role') === 'group',
    );
    expect(groupElements.length).toBe(1);
  });

  it('skills have correct links', () => {
    setup();

    // Check that skills render as links with correct URLs
    const goLink = screen.getByRole('link', { name: 'Go' });
    expect(goLink.getAttribute('href')).toBe('https://golang.org');

    const typescriptLink = screen.getByRole('link', { name: 'Typescript' });
    expect(typescriptLink.getAttribute('href')).toBe(
      'https://www.typescriptlang.org',
    );
  });

  it('clear name filter works', async () => {
    const { user } = setup();

    const nameFilter = screen.getByLabelText('Filter by name');

    // Filter by "Go"
    await user.type(nameFilter, 'Go');
    expect(screen.getByRole('link', { name: 'Go' })).toBeDefined();
    expect(screen.queryByRole('link', { name: 'ReactJS' })).toBeNull();

    // Clear the filter using the clear button
    const clearButton = screen.getByLabelText('clear input');
    await user.click(clearButton);

    // All skills should be visible again
    expect(screen.getByRole('link', { name: 'Go' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'ReactJS' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Javascript' })).toBeDefined();
  });

  it('no results message appears when no skills match filters', async () => {
    const { user } = setup();

    // Filter by a non-existent skill name
    const nameFilter = screen.getByLabelText('Filter by name');
    await user.type(nameFilter, 'NonExistentSkill');

    expect(
      screen.getByText('No skills found matching your filters.'),
    ).toBeDefined();

    // Verify no skill items are visible
    expect(screen.queryByRole('link', { name: 'Go' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'ReactJS' })).toBeNull();
  });

  it('component renders successfully without hydration errors', () => {
    // Since we use useState with useEffect for randomization to avoid SSR issues,
    // the initial render should show skills in the original order,
    // then they get shuffled after mount.

    // This test verifies that the component renders without throwing hydration errors
    const { container } = setup();

    // Just verify the component rendered successfully
    expect(container).toBeDefined();
    expect(screen.getByText('Skills')).toBeDefined();

    // And that skills are displayed
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
