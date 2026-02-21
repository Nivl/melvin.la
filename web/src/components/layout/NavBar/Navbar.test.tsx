import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Navbar } from './Navbar';

vi.mock('motion/react', async () => {
  const { motionMock } = await import('#utils/mocks/motion');
  return motionMock;
});

let mockPathname = '/';

vi.mock('#i18n/routing', async importOriginal => {
  const actual = await importOriginal<typeof import('#i18n/routing')>();
  return {
    ...actual,
    usePathname: () => mockPathname,
  };
});

const setup = (pathname = '/') => {
  mockPathname = pathname;
  return render(<Navbar />, { wrapper });
};

describe('Navbar', () => {
  it('renders without crashing', () => {
    expect(() => setup()).not.toThrow();
  });

  it('renders all nav items', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Home' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Blog' })).toBeDefined();
    expect(screen.getByRole('button', { name: /Games/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Tools/i })).toBeDefined();
  });

  it('shows nav indicator on home route', () => {
    setup('/');
    // The motion.span with layoutId="nav-indicator" renders as a plain span
    // We verify it appears only once (for the active home item)
    // At least one indicator span exists when on home route
    const activeLink = screen.getByRole('link', { name: 'Home' });
    expect(activeLink.closest('span')?.querySelector('span')).not.toBeNull();
  });

  it('shows nav indicator on blog route', () => {
    setup('/blog');
    const activeLink = screen.getByRole('link', { name: 'Blog' });
    expect(activeLink.closest('span')?.querySelector('span')).not.toBeNull();
  });

  it('shows nav indicator on games route', () => {
    setup('/games/conway');
    const gamesButton = screen.getByRole('button', { name: /Games/i });
    expect(gamesButton.closest('span')?.querySelector('span')).not.toBeNull();
  });

  it('shows nav indicator on tools route', () => {
    setup('/tools/uuid');
    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    expect(toolsButton.closest('span')?.querySelector('span')).not.toBeNull();
  });

  it('games indicator absent on non-games route', () => {
    setup('/');
    const gamesButton = screen.getByRole('button', { name: /Games/i });
    expect(gamesButton.closest('span')?.querySelector('span')).toBeNull();
  });

  it('tools indicator absent on non-tools route', () => {
    setup('/');
    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    expect(toolsButton.closest('span')?.querySelector('span')).toBeNull();
  });

  it('home link is active on / route', () => {
    setup('/');
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeDefined();
    // Blog link should not have an indicator span sibling
    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(blogLink.closest('span')?.querySelector('span')).toBeNull();
  });

  it('blog link is active on /blog route', () => {
    setup('/blog');
    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(blogLink).toBeDefined();
    // Home link should not have an indicator span sibling
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.closest('span')?.querySelector('span')).toBeNull();
  });

  it('games button has bold style on /games route', () => {
    setup('/games/conway');
    const gamesButton = screen.getByRole('button', { name: /Games/i });
    expect(gamesButton.className).toContain('font-semibold');
  });

  it('games button does not have bold style on non-games route', () => {
    setup('/');
    const gamesButton = screen.getByRole('button', { name: /Games/i });
    expect(gamesButton.className).not.toContain('font-semibold');
  });

  it('tools button has bold style on /tools route', () => {
    setup('/tools/uuid');
    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    expect(toolsButton.className).toContain('font-semibold');
  });

  it('tools button does not have bold style on non-tools route', () => {
    setup('/');
    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    expect(toolsButton.className).not.toContain('font-semibold');
  });

  it('dropdown buttons use !h-auto !min-h-0 to fix button height', () => {
    setup();
    const gamesButton = screen.getByRole('button', { name: /Games/i });
    expect(gamesButton.className).toContain('!h-auto');
    expect(gamesButton.className).toContain('!min-h-0');
  });

  it('home link points to /', () => {
    setup();
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('blog link points to /blog', () => {
    setup();
    const blogLink = screen.getByRole('link', { name: 'Blog' });
    expect(blogLink.getAttribute('href')).toBe('/blog');
  });
});
