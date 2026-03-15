import { getSampleUrl } from './kits';
import type { BeatmakerState, Kit, TrackId } from './types';
import { TRACK_IDS } from './types';

const SCHEDULE_INTERVAL_MS = 25;
const LOOKAHEAD_SECONDS = 0.1;

export type Engine = {
  /** Must be called before any playback. Safe to call multiple times. */
  init(): Promise<void>;
  loadKit(kit: Kit): Promise<void>;
  loadCustomFile(trackId: TrackId, file: File): Promise<void>;
  /** Removes all custom-file buffers so the kit buffer is used again. */
  clearCustomFiles(): void;
  start(getState: () => BeatmakerState): void;
  stop(): void;
  dispose(): void;
};

type EngineOptions = {
  onError?: (error: Error) => void;
  onStep?: (step: number) => void;
};

export function createEngine(
  onErrorOrOptions?: ((error: Error) => void) | EngineOptions,
): Engine {
  const opts: EngineOptions =
    typeof onErrorOrOptions === 'function'
      ? { onError: onErrorOrOptions }
      : (onErrorOrOptions ?? {});
  const { onError, onStep } = opts;
  let ctx: AudioContext | undefined;
  const buffers = new Map<string, AudioBuffer>();
  let schedulerTimer: ReturnType<typeof setInterval> | undefined;
  const pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();
  let currentStep = 0;
  let nextNoteTime = 0;

  // Creates the AudioContext without resuming — safe to call before a user gesture.
  function ensureContext(): void {
    ctx ??= new AudioContext();
  }

  async function init(): Promise<void> {
    ensureContext();
    const context = ctx;
    if (context) await context.resume();
  }

  async function loadKit(kit: Kit): Promise<void> {
    // Ensure context exists — kit preloads may happen before first user gesture
    ensureContext();
    const context = ctx;
    if (!context) return;
    await Promise.all(
      TRACK_IDS.map(async trackId => {
        const url = getSampleUrl(kit, trackId);
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
          const arrayBuf = await res.arrayBuffer();
          const audioBuf = await context.decodeAudioData(arrayBuf);
          buffers.set(`${kit}/${trackId}`, audioBuf);
        } catch (error) {
          // Keep existing buffer if present; otherwise track plays silently
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      }),
    );
  }

  async function loadCustomFile(trackId: TrackId, file: File): Promise<void> {
    ensureContext();
    const context = ctx;
    if (!context) return;
    const arrayBuf = await file.arrayBuffer();
    const audioBuf = await context.decodeAudioData(arrayBuf);
    buffers.set(`custom/${trackId}`, audioBuf);
  }

  function getBuffer(
    state: BeatmakerState,
    trackId: TrackId,
  ): AudioBuffer | undefined {
    return (
      buffers.get(`custom/${trackId}`) ?? buffers.get(`${state.kit}/${trackId}`)
    );
  }

  function scheduleNote(
    state: BeatmakerState,
    trackId: TrackId,
    time: number,
  ): void {
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
      currentStep++;
      nextNoteTime += secondsPerStep;
    }
  }

  function start(getState: () => BeatmakerState): void {
    if (schedulerTimer !== undefined) return;
    if (!ctx) return;
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
    currentStep = 0;
  }

  function clearCustomFiles(): void {
    for (const trackId of TRACK_IDS) {
      buffers.delete(`custom/${trackId}`);
    }
  }

  function dispose(): void {
    stop();
    void ctx?.close();
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
