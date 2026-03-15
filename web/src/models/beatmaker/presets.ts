import type { BeatmakerState, TrackId } from './types';
import { TRACK_IDS } from './types';

type PresetDef = Omit<BeatmakerState, 'isPlaying'>;

function makeTrack(steps: boolean[]): BeatmakerState['tracks'][TrackId] {
  return { steps, volume: 0.8, pan: 0, muted: false };
}

function blank(n: number) {
  return Array.from<boolean>({ length: n }).fill(false);
}

// 16-step helpers: T=true, F=false
const T = true,
  F = false;

const BASIC_ROCK: PresetDef = {
  kit: '808',
  bpm: 120,
  stepCount: 16,
  tracks: {
    kick: makeTrack([T, F, F, F, F, F, F, F, T, F, F, F, F, F, F, F]),
    snare: makeTrack([F, F, F, F, T, F, F, F, F, F, F, F, T, F, F, F]),
    hihat: makeTrack([T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F]),
    openhat: makeTrack(blank(16)),
    clap: makeTrack(blank(16)),
    ride: makeTrack(blank(16)),
  },
};

const FOUR_ON_FLOOR: PresetDef = {
  kit: '808',
  bpm: 128,
  stepCount: 16,
  tracks: {
    kick: makeTrack([T, F, F, F, T, F, F, F, T, F, F, F, T, F, F, F]),
    snare: makeTrack(blank(16)),
    hihat: makeTrack([F, F, F, F, T, F, F, F, F, F, F, F, T, F, F, F]),
    openhat: makeTrack([F, F, T, F, F, F, T, F, F, F, T, F, F, F, T, F]),
    clap: makeTrack(blank(16)),
    ride: makeTrack(blank(16)),
  },
};

const BOOM_BAP: PresetDef = {
  kit: '808',
  bpm: 90,
  stepCount: 16,
  tracks: {
    kick: makeTrack([T, F, F, F, F, F, F, T, F, F, F, F, T, F, F, F]),
    snare: makeTrack([F, F, F, F, T, F, F, F, F, F, F, F, T, F, F, F]),
    hihat: makeTrack([T, F, T, F, T, F, T, F, T, F, T, T, T, F, T, F]),
    openhat: makeTrack(blank(16)),
    clap: makeTrack([F, F, F, F, T, F, F, F, F, F, F, F, T, F, F, F]),
    ride: makeTrack(blank(16)),
  },
};

// 32-step trap pattern (semiquavers)
const TRAP: PresetDef = {
  kit: '808',
  bpm: 140,
  stepCount: 32,
  tracks: {
    kick: makeTrack([
      T,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
    ]),
    snare: makeTrack([
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
    ]),
    hihat: makeTrack(Array.from({ length: 32 }, (_, i) => i % 2 === 0)),
    openhat: makeTrack(blank(32)),
    clap: makeTrack([
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
      F,
      F,
      F,
      F,
      T,
      F,
    ]),
    ride: makeTrack(blank(32)),
  },
};

const BLANK_16: PresetDef = {
  kit: '808',
  bpm: 120,
  stepCount: 16,
  tracks: Object.fromEntries(
    TRACK_IDS.map(id => [id, makeTrack(blank(16))]),
  ) as BeatmakerState['tracks'],
};

export const PRESETS: Record<string, PresetDef> = {
  'basic-rock': BASIC_ROCK,
  'four-on-floor': FOUR_ON_FLOOR,
  'boom-bap': BOOM_BAP,
  trap: TRAP,
  blank: BLANK_16,
};

export function buildDefaultState(): BeatmakerState {
  return { ...PRESETS['basic-rock'], isPlaying: false };
}
