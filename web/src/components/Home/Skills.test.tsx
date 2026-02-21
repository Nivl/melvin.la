import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Skills } from './Skills';

// Mock motion/react so AnimatePresence removes children synchronously in jsdom.
// Without this, exit animations keep elements in the DOM forever (no RAF loop in jsdom).
vi.mock('motion/react', async () => {
  const { motionMock } = await import('#utils/mocks/motion');
  return motionMock;
});

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

  it('displays year from slider', () => {
    setup();

    // Get all elements with the year filter label
    const yearSliders = screen.getAllByLabelText('Active years');

    // Should have 2 elements (1 group + 1 range input)
    expect(yearSliders.length).toBe(2);

    // Filter to only range input elements
    const rangeInputs = yearSliders.filter(
      el => el.getAttribute('type') === 'range',
    );
    expect(rangeInputs.length).toBe(1);

    // Check that the range input has correct attributes
    expect(rangeInputs[0].getAttribute('type')).toBe('range');
    expect(rangeInputs[0].tagName).toBe('INPUT');

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

  it('skills from earliest year (2004) are shown at max slider value', async () => {
    const { user } = setup();

    // PHP and MySQL have usages in 2004 (the earliest year in the dataset).
    // Regression test: the slider's maxValue must be currentYear - minYear + 1
    // so that fromYear = minYear - 1 and the strict `year > fromYear` filter
    // correctly includes 2004 data. A maxValue of currentYear - minYear would
    // set fromYear = 2004 and `year > 2004` would wrongly exclude those skills.
    const rangeInput = screen
      .getAllByLabelText('Active years')
      .find(el => el.getAttribute('type') === 'range');

    if (!rangeInput) throw new Error('Slider range input not found');

    // Set slider to its maximum value
    const max = Number(rangeInput.getAttribute('max'));
    await user.type(rangeInput, '{End}');
    // Verify max attribute is currentYear - 2004 + 1 (not currentYear - 2004)
    expect(max).toBe(new Date().getFullYear() - 2004 + 1);

    // PHP has usage years starting from 2004 — must be visible at max slider
    expect(screen.getByRole('link', { name: 'PHP' })).toBeDefined();
    // Mysql also has usage from 2004
    expect(screen.getByRole('link', { name: 'Mysql' })).toBeDefined();
  });
});
