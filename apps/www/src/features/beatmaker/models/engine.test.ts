import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createEngine } from "#features/beatmaker/models/engine";
import type { BeatmakerState } from "#features/beatmaker/models/types";

// ── Mock Web Audio API ─────────────────────────────────────────────────────

const mockStart = vi.fn<() => void>();
const mockStop = vi.fn<() => void>();
const mockConnect = vi.fn<() => void>();
const mockCreateBufferSource = vi.fn<() => object>(() => ({
  addEventListener: vi.fn<() => void>(),
  buffer: undefined,
  connect: mockConnect,
  onended: undefined,
  start: mockStart,
  stop: mockStop,
}));
const mockGainNode = { connect: mockConnect, gain: { value: 0 } };
const mockPanNode = { connect: mockConnect, pan: { value: 0 } };
const mockCreateGain = vi.fn<() => object>(() => mockGainNode);
const mockCreateStereoPanner = vi.fn<() => object>(() => mockPanNode);
const mockDecodeAudioData = vi.fn<(buffer: ArrayBuffer) => Promise<object>>().mockResolvedValue({});
const mockCreateBuffer = vi.fn<() => object>(() => ({}));
const mockResume = vi.fn<() => void>().mockImplementation(() => {});
const mockClose = vi.fn<() => void>().mockImplementation(() => {});
const mockAddEventListener = vi.fn<(event: string, ...args: unknown[]) => void>();

beforeEach(() => {
  mockAddEventListener.mockClear();
  const MockAudioContext = vi.fn<() => void>(function MockAudioContext(this: object) {
    Object.assign(this, {
      addEventListener: mockAddEventListener,
      close: mockClose,
      createBuffer: mockCreateBuffer,
      createBufferSource: mockCreateBufferSource,
      createGain: mockCreateGain,
      createStereoPanner: mockCreateStereoPanner,
      currentTime: 0,
      decodeAudioData: mockDecodeAudioData,
      destination: {},
      resume: mockResume,
      sampleRate: 44_100,
      state: "running",
    });
  });
  vi.stubGlobal("AudioContext", MockAudioContext);
  vi.stubGlobal(
    "fetch",
    vi.fn<() => Promise<object>>().mockResolvedValue({
      arrayBuffer: vi.fn<() => Promise<ArrayBuffer>>().mockResolvedValue(new ArrayBuffer(8)),
      ok: true,
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe(createEngine, () => {
  test("does not create AudioContext on construction", () => {
    createEngine();
    expect(vi.mocked(AudioContext)).not.toHaveBeenCalled();
  }, 5000);

  test("init() creates AudioContext and resumes it", async () => {
    const engine = createEngine();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
    expect(mockResume).toHaveBeenCalledTimes(1);
  }, 5000);

  test("init() called twice reuses the same context", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
  }, 5000);

  test("init() called twice adds only one statechange listener", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.init();
    // Filter calls to check only for 'statechange' event
    const stateChangeCalls = mockAddEventListener.mock.calls.filter(
      (args) => args[0] === "statechange",
    );
    expect(stateChangeCalls).toHaveLength(1);
  }, 5000);

  test("loadKit() fetches 6 samples", async () => {
    const engine = createEngine();
    await engine.loadKit("808");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6);
  }, 5000);

  test("dispose() closes the AudioContext", async () => {
    const engine = createEngine();
    await engine.init();
    await engine.dispose();
    expect(mockClose).toHaveBeenCalledTimes(1);
  }, 5000);

  test("stop() immediately stops all active sources", async () => {
    vi.useFakeTimers();
    const engine = createEngine();
    await engine.init();
    await engine.loadKit("808");

    const steps = Array.from<boolean>({ length: 16 }).fill(true);
    const track = { customFile: undefined, muted: false, pan: 0, steps, volume: 1 };
    const state: BeatmakerState = {
      bpm: 120,
      isPlaying: false,
      kit: "808" as const,
      stepCount: 16,
      tracks: {
        clap: track,
        hihat: track,
        kick: track,
        openhat: track,
        ride: track,
        snare: track,
      },
    };

    await engine.start(() => state);
    // Advance timers so the scheduler interval fires and sources get created
    vi.advanceTimersByTime(25);

    expect(mockStart).toHaveBeenCalled();

    engine.stop();
    expect(mockStop).toHaveBeenCalled();

    vi.useRealTimers();
  }, 5000);

  test("concurrent init calls do not report duplicate decode errors for the same pending kit buffers", async () => {
    const seenBuffers = new WeakSet<ArrayBuffer>();
    mockDecodeAudioData.mockImplementation(async (arrayBuffer: ArrayBuffer) => {
      if (seenBuffers.has(arrayBuffer)) {
        throw new Error("duplicate decode");
      }

      seenBuffers.add(arrayBuffer);
      return {};
    });

    vi.stubGlobal(
      "fetch",
      vi.fn<() => Promise<object>>().mockResolvedValue({
        arrayBuffer: vi.fn<() => ArrayBuffer>().mockImplementation(() => new ArrayBuffer(8)),
        ok: true,
      }),
    );

    const onError = vi.fn<(error: Error) => void>();
    const engine = createEngine({ onError });

    await engine.loadKit("808");
    await Promise.all([engine.init(), engine.init()]);

    expect(onError).not.toHaveBeenCalled();
  }, 5000);
});
