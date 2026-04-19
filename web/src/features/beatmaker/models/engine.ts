import { getSampleUrl } from "./kits";
import type { BeatmakerState, Kit, TrackId } from "./types";
import { TRACK_IDS } from "./types";

const SCHEDULE_INTERVAL_MS = 25;
const LOOKAHEAD_SECONDS = 0.1;

export type Engine = {
  /** Must be called before any playback. Safe to call multiple times. */
  init(): Promise<void>;
  loadKit(kit: Kit): Promise<void>;
  loadCustomFile(trackId: TrackId, file: File): Promise<void>;
  /** Removes all custom-file buffers so the kit buffer is used again. */
  clearCustomFiles(): void;
  start(getState: () => BeatmakerState): Promise<void>;
  stop(): void;
  dispose(): Promise<void>;
};

type EngineOptions = {
  onError?: (error: Error) => void;
  onStep?: (step: number) => void;
  onStateChange?: (state: AudioContextState) => void;
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function unlockAudioOutput(context: AudioContext): void {
  // 0.1s silent buffer to wake up the audio context on iOS
  const silentBuf = context.createBuffer(1, context.sampleRate / 10, context.sampleRate);
  const silentSrc = context.createBufferSource();

  silentSrc.buffer = silentBuf;
  silentSrc.connect(context.destination);
  silentSrc.start(0);
}

export function createEngine(onErrorOrOptions?: ((error: Error) => void) | EngineOptions): Engine {
  const opts: EngineOptions =
    typeof onErrorOrOptions === "function"
      ? { onError: onErrorOrOptions }
      : (onErrorOrOptions ?? {});
  const { onError, onStep, onStateChange } = opts;
  let ctx: AudioContext | undefined;
  const buffers = new Map<string, AudioBuffer>();
  // Raw fetched data waiting to be decoded once an AudioContext is available.
  // AudioContext must be created inside a user gesture on iOS Safari, so we
  // defer decoding until init() is called from the Play button handler.
  const pendingArrayBuffers = new Map<string, ArrayBuffer>();
  let schedulerTimer: ReturnType<typeof setInterval> | undefined;
  const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();
  const activeSources = new Set<AudioBufferSourceNode>();
  let initPromise: Promise<void> | undefined;
  let currentStep = 0;
  let nextNoteTime = 0;

  function reportError(error: unknown): void {
    onError?.(toError(error));
  }

  async function decodeAndStoreBuffer(
    context: AudioContext,
    key: string,
    arrayBuf: ArrayBuffer,
  ): Promise<void> {
    const audioBuf = await context.decodeAudioData(arrayBuf);
    buffers.set(key, audioBuf);
  }

  async function storeBuffer(key: string, arrayBuf: ArrayBuffer): Promise<void> {
    const context = ctx;
    if (context) {
      await decodeAndStoreBuffer(context, key, arrayBuf);
      return;
    }

    pendingArrayBuffers.set(key, arrayBuf);
  }

  async function decodePending(context: AudioContext): Promise<void> {
    await Promise.all(
      [...pendingArrayBuffers.entries()].map(async ([key, arrayBuf]) => {
        try {
          await decodeAndStoreBuffer(context, key, arrayBuf);
        } catch (error) {
          reportError(error);
        } finally {
          pendingArrayBuffers.delete(key);
        }
      }),
    );
  }

  async function init(): Promise<void> {
    if (initPromise) {
      await initPromise;
      return;
    }

    if (ctx) {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      return;
    }

    initPromise = (async () => {
      // Create the AudioContext here, inside the user gesture, so iOS Safari
      // allows it to play audio immediately without being permanently suspended.
      const context = (ctx ??= new AudioContext());

      context.addEventListener("statechange", () => {
        onStateChange?.(context.state);
      });

      await context.resume();
      // iOS Safari requires at least one AudioBufferSourceNode to be started
      // within the user gesture to connect the AudioContext to hardware output.
      // Without this, currentTime advances and API calls succeed, but no audio
      // is rendered. Play a silent 1-sample buffer to unlock the output.
      unlockAudioOutput(context);
      await decodePending(context);
    })();

    try {
      await initPromise;
    } finally {
      initPromise = undefined;
    }
  }

  async function loadKit(kit: Kit): Promise<void> {
    await Promise.all(
      TRACK_IDS.map(async (trackId) => {
        const url = getSampleUrl(kit, trackId);
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
          const arrayBuf = await res.arrayBuffer();
          await storeBuffer(`${kit}/${trackId}`, arrayBuf);
        } catch (error) {
          // Keep existing buffer if present; otherwise track plays silently
          reportError(error);
        }
      }),
    );
  }

  async function loadCustomFile(trackId: TrackId, file: File): Promise<void> {
    const arrayBuf = await file.arrayBuffer();
    await storeBuffer(`custom/${trackId}`, arrayBuf);
  }

  function getBuffer(state: BeatmakerState, trackId: TrackId): AudioBuffer | undefined {
    return buffers.get(`custom/${trackId}`) ?? buffers.get(`${state.kit}/${trackId}`);
  }

  function scheduleNote(state: BeatmakerState, trackId: TrackId, time: number): void {
    if (!ctx) return;
    const track = state.tracks[trackId];
    const buffer = getBuffer(state, trackId);
    if (!buffer) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.value = track.muted ? 0 : track.volume;

    const panner = ctx.createStereoPanner();
    panner.pan.value = track.pan;

    src.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);

    activeSources.add(src);
    src.addEventListener("ended", () => {
      activeSources.delete(src);
    });

    src.start(time);
  }

  function scheduler(getState: () => BeatmakerState): void {
    if (!ctx) return;
    const state = getState();
    const secondsPerBeat = 60 / state.bpm;
    const secondsPerStep = secondsPerBeat / 4; // 16th-note grid

    while (nextNoteTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      const step = currentStep % state.stepCount;
      for (const trackId of TRACK_IDS) {
        if (state.tracks[trackId].steps[step]) {
          scheduleNote(state, trackId, nextNoteTime);
        }
      }
      if (onStep) {
        const delayMs = Math.max(0, (nextNoteTime - ctx.currentTime) * 1000);
        const timeoutId = setTimeout(() => {
          pendingTimeouts.delete(timeoutId);
          onStep(step);
        }, delayMs);
        pendingTimeouts.add(timeoutId);
      }
      currentStep += 1;
      nextNoteTime += secondsPerStep;
    }
  }

  async function start(getState: () => BeatmakerState) {
    if (schedulerTimer !== undefined) return;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    currentStep = 0;
    nextNoteTime = ctx.currentTime;
    schedulerTimer = setInterval(() => {
      scheduler(getState);
    }, SCHEDULE_INTERVAL_MS);
  }

  function stop(): void {
    if (schedulerTimer !== undefined) {
      clearInterval(schedulerTimer);
      schedulerTimer = undefined;
    }
    for (const id of pendingTimeouts) clearTimeout(id);
    pendingTimeouts.clear();
    for (const src of activeSources) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    }
    activeSources.clear();
    currentStep = 0;
  }

  function clearCustomFiles(): void {
    for (const trackId of TRACK_IDS) {
      buffers.delete(`custom/${trackId}`);
      pendingArrayBuffers.delete(`custom/${trackId}`);
    }
  }

  async function dispose(): Promise<void> {
    stop();
    pendingArrayBuffers.clear();
    await ctx?.close();
    ctx = undefined;
  }

  return {
    init,
    loadKit,
    loadCustomFile,
    clearCustomFiles,
    start,
    stop,
    dispose,
  };
}
