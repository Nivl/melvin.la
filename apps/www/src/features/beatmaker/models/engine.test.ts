import { describe, expect, it, vi } from "vitest";

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

const setup = () => {
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
};

const teardown = () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe(createEngine, () => {
  it("does not create AudioContext on construction", () => {
    expect.assertions(1);
    setup();
    createEngine();
    expect(vi.mocked(AudioContext)).not.toHaveBeenCalled();
    teardown();
  }, 5000);

  it("init() creates AudioContext and resumes it", async () => {
    expect.assertions(2);
    setup();
    const engine = createEngine();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
    expect(mockResume).toHaveBeenCalledTimes(1);
    teardown();
  }, 5000);

  it("init() called twice reuses the same context", async () => {
    expect.assertions(1);
    setup();
    const engine = createEngine();
    await engine.init();
    await engine.init();
    expect(vi.mocked(AudioContext)).toHaveBeenCalledTimes(1);
    teardown();
  }, 5000);

  it("init() called twice adds only one statechange listener", async () => {
    expect.assertions(1);
    setup();
    const engine = createEngine();
    await engine.init();
    await engine.init();
    // Filter calls to check only for 'statechange' event
    const stateChangeCalls = mockAddEventListener.mock.calls.filter(
      (args) => args[0] === "statechange",
    );
    expect(stateChangeCalls).toHaveLength(1);
    teardown();
  }, 5000);

  it("loadKit() fetches 6 samples", async () => {
    expect.assertions(1);
    setup();
    const engine = createEngine();
    await engine.loadKit("808");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(6);
    teardown();
  }, 5000);

  it("dispose() closes the AudioContext", async () => {
    expect.assertions(1);
    setup();
    const engine = createEngine();
    await engine.init();
    await engine.dispose();
    expect(mockClose).toHaveBeenCalledTimes(1);
    teardown();
  }, 5000);

  it("stop() immediately stops all active sources", async () => {
    expect.assertions(2);
    setup();
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

    expect(mockStart).toHaveBeenCalledWith(expect.any(Number));

    engine.stop();
    expect(mockStop).toHaveBeenCalledWith();

    teardown();
  }, 5000);

  it("concurrent init calls do not report duplicate decode errors for the same pending kit buffers", async () => {
    expect.assertions(1);
    setup();
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
        // Each call must return a NEW ArrayBuffer so the test can distinguish buffers
        // across the 6 sample fetches; mockReturnValue would alias them.
        // eslint-disable-next-line jest/prefer-mock-return-shorthand
        arrayBuffer: vi.fn<() => ArrayBuffer>().mockImplementation(() => new ArrayBuffer(8)),
        ok: true,
      }),
    );

    const onError = vi.fn<(error: Error) => void>();
    const engine = createEngine({ onError });

    await engine.loadKit("808");
    await Promise.all([engine.init(), engine.init()]);

    expect(onError).not.toHaveBeenCalled();
    teardown();
  }, 5000);
});
