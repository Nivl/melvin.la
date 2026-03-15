import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { testWrapper as wrapper } from '#utils/tests';

import { Beatmaker } from './Beatmaker';

// ── Mock audio engine ──────────────────────────────────────────────────────
const mockEngine = {
  init: vi.fn().mockImplementation(() => Promise.resolve()),
  loadKit: vi.fn().mockImplementation(() => Promise.resolve()),
  loadCustomFile: vi.fn().mockImplementation(() => Promise.resolve()),
  start: vi.fn(),
  stop: vi.fn(),
  dispose: vi.fn(),
  clearCustomFiles: vi.fn(),
};

vi.mock('#models/beatmaker', async importOriginal => {
  const actual = await importOriginal<typeof import('#models/beatmaker')>();
  return { ...actual, createEngine: () => mockEngine };
});

beforeEach(() => {
  vi.clearAllMocks();
  // Reset hash
  globalThis.location.hash = '';
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('renders the Play button on initial load', () => {
  const { getByRole } = render(<Beatmaker />, { wrapper });
  expect(getByRole('button', { name: 'Play' })).toBeDefined();
});

test('clicking Play initialises engine and starts playback', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<Beatmaker />, { wrapper });
  await user.click(getByRole('button', { name: 'Play' }));
  expect(mockEngine.init).toHaveBeenCalledTimes(1);
  expect(mockEngine.start).toHaveBeenCalledTimes(1);
});

test('clicking Stop stops playback', async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<Beatmaker />, { wrapper });
  await user.click(getByRole('button', { name: 'Play' }));
  await user.click(getByRole('button', { name: 'Stop' }));
  expect(mockEngine.stop).toHaveBeenCalledTimes(1);
});

test('clicking a step button toggles it', async () => {
  const user = userEvent.setup();
  const { getAllByRole } = render(<Beatmaker />, { wrapper });
  const stepBtn = getAllByRole('button').find(
    btn => btn.getAttribute('aria-pressed') !== null,
  );
  if (!stepBtn) throw new Error('No step button found');
  const wasPressed = stepBtn.getAttribute('aria-pressed') === 'true';
  await user.click(stepBtn);
  expect(stepBtn.getAttribute('aria-pressed')).toBe(String(!wasPressed));
});
