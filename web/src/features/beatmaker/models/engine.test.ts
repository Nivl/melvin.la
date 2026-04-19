import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createEngine } from "#features/beatmaker/models/engine";
import type { BeatmakerState } from "#features/beatmaker/models/types";

// ── Mock Web Audio API ─────────────────────────────────────────────────────

const mockStart = vi.fn();
const mockStop = vi.fn();
const mockConnect = vi.fn();
const mockCreateBufferSource = vi.fn(() => ({
  buffer: undefined,
  connect: mockConnect,
  start: mockStart,
  stop: mockStop,
  addEventListener: vi.fn(),
  onended: undefined,
}));
const mockGainNode = { gain: { value: 0 }, connect: mockConnect };
const mockPanNode = { pan: { value: 0 }, connect: mockConnect };
const mockCreateGain = vi.fn(() => mockGainNode);
const mockCreateStereoPanner = vi.fn(() => mockPanNode);
const mockDecodeAudioData = vi.fn().mockResolvedValue({});
const mockCreateBuffer = vi.fn(() => ({}));
const mockResume = vi.fn().mockImplementation(() => {});
const mockClose = vi.fn().mockImplementation(() => {});
const mockAddEventListener = vi.fn();

beforeEach(() => {
  mockAddEventListener.mockClear();
  const MockAudioContext = vi.fn(function (this: object) {
    Object.assign(this, {
      createBufferSource: mockCreateBufferSource,
      createGain: mockCreateGain,
      createStereoPanner: mockCreateStereoPanner,
      decodeAudioData: mockDecodeAudioData,
      createBuffer: mockCreateBuffer,
      addEventListener: mockAddEventListener,
      destination: {},
      currentTime: 0,
      sampleRate: 44_100,
      state: "running",
      resume: mockResume,
      close: mockClose,
    });
  });
  vi.stubGlobal("AudioContext", MockAudioContext);
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("createEngine", () => {
  test("does not create AudioContext on construction", () => {
    createEngine();
    expect(vi.mocked(AudioContext)).not.toHaveBeenCalled();
  });

  test("init() creates AudioContext and resumes it", async () => {
    const engine = createEngine();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
    expect(mockResume).toHaveBeenCalledTimes(1);
  });

  test("init() called twice reuses the same context", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
  });

  test("init() called twice adds only one statechange listener", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.init();
    // Filter calls to check only for 'statechange' event
    const stateChangeCalls = mockAddEventListener.mock.calls.filter(
      (args) => args[0] === "statechange",
    );
    expect(stateChangeCalls).toHaveLength(1);
  });

  test("loadKit() fetches 6 samples", async () => {
    const engine = createEngine();
    await engine.loadKit("808");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6);
  });

  test("dispose() closes the AudioContext", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.dispose();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("stop() immediately stops all active sources", async () => {
    vi.useFakeTimers();
    const engine = createEngine();
    await engine.init();
    await engine.loadKit("808");

    const steps = Array.from<boolean>({ length: 16 }).fill(true);
    const track = { steps, volume: 1, muted: false, pan: 0, customFile: undefined };
    const state: BeatmakerState = {
      kit: "808" as const,
      bpm: 120,
      stepCount: 16,
      isPlaying: false,
      tracks: {
        kick: track,
        snare: track,
        hihat: track,
        openhat: track,
        clap: track,
        ride: track,
      },
    };

    await engine.start(() => state);
    // Advance timers so the scheduler interval fires and sources get created
    vi.advanceTimersByTime(25);

    expect(mockStart).toHaveBeenCalled();

    engine.stop();
    expect(mockStop).toHaveBeenCalled();

    vi.useRealTimers();
  });

  test("concurrent init calls do not report duplicate decode errors for the same pending kit buffers", async () => {
    const seenBuffers = new WeakSet<ArrayBuffer>();
    mockDecodeAudioData.mockImplementation((arrayBuffer: ArrayBuffer) => {
      if (seenBuffers.has(arrayBuffer)) {
        throw new Error("duplicate decode");
      }

      seenBuffers.add(arrayBuffer);
      return {};
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockImplementation(() => new ArrayBuffer(8)),
      }),
    );

    const onError = vi.fn();
    const engine = createEngine({ onError });

    await engine.loadKit("808");
    await Promise.all([engine.init(), engine.init()]);

    expect(onError).not.toHaveBeenCalled();
  });
});
