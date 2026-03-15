import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { createEngine } from './engine';

// ── Mock Web Audio API ─────────────────────────────────────────────────────

const mockStart = vi.fn();
const mockConnect = vi.fn();
const mockCreateBufferSource = vi.fn(() => ({
  buffer: undefined as AudioBuffer | undefined,
  connect: mockConnect,
  start: mockStart,
  onended: undefined as (() => void) | undefined,
}));
const mockGainNode = { gain: { value: 0 }, connect: mockConnect };
const mockPanNode = { pan: { value: 0 }, connect: mockConnect };
const mockCreateGain = vi.fn(() => mockGainNode);
const mockCreateStereoPanner = vi.fn(() => mockPanNode);
const mockDecodeAudioData = vi.fn().mockResolvedValue({} as AudioBuffer);
const mockResume = vi.fn().mockImplementation(() => Promise.resolve());
const mockClose = vi.fn().mockImplementation(() => Promise.resolve());

beforeEach(() => {
  const MockAudioContext = vi.fn(function (this: object) {
    Object.assign(this, {
      createBufferSource: mockCreateBufferSource,
      createGain: mockCreateGain,
      createStereoPanner: mockCreateStereoPanner,
      decodeAudioData: mockDecodeAudioData,
      destination: {},
      currentTime: 0,
      state: 'running',
      resume: mockResume,
      close: mockClose,
    });
  });
  vi.stubGlobal('AudioContext', MockAudioContext);
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe('createEngine', () => {
  test('does not create AudioContext on construction', () => {
    createEngine();
    expect(vi.mocked(AudioContext)).not.toHaveBeenCalled();
  });

  test('init() creates AudioContext and resumes it', async () => {
    const engine = createEngine();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
    expect(mockResume).toHaveBeenCalledTimes(1);
  });

  test('init() called twice reuses the same context', async () => {
    const engine = createEngine();
    await engine.init();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
  });

  test('loadKit() fetches 6 samples', async () => {
    const engine = createEngine();
    await engine.loadKit('808');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6);
  });

  test('dispose() closes the AudioContext', async () => {
    const engine = createEngine();
    await engine.init();
    engine.dispose();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
