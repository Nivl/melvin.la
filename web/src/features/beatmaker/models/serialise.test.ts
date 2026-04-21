import { expect, test } from "vitest";

import { buildDefaultState } from "./presets";
import { decode, encode } from "./serialise";
import type { BeatmakerState } from "./types";

const state: BeatmakerState = buildDefaultState();

test('encode produces a string starting with "v1:"', () => {
  const hash = encode(state);
  expect(hash).toMatch(/^v1:/);
});

test("encode excludes isPlaying", () => {
  const playing = { ...state, isPlaying: true };
  const notPlaying = { ...state, isPlaying: false };
  expect(encode(playing)).toBe(encode(notPlaying));
});

test("round-trip: decode(encode(state)) reproduces state", () => {
  const hash = encode(state);
  const decoded = decode(hash);
  // isPlaying is not encoded, so compare without it
  expect(decoded?.bpm).toBe(state.bpm);
  expect(decoded?.kit).toBe(state.kit);
  expect(decoded?.stepCount).toBe(state.stepCount);
  expect(decoded?.tracks.kick.steps).toEqual(state.tracks.kick.steps);
  expect(decoded?.tracks.kick.volume).toBe(state.tracks.kick.volume);
  expect(decoded?.tracks.kick.muted).toBe(state.tracks.kick.muted);
});

test("round-trip: decode(encode(state)) reproduces non-default track values", () => {
  const customSteps = Array.from({ length: 16 }, (_, i) => i % 3 === 0);
  const modified: BeatmakerState = {
    ...state,
    tracks: {
      ...state.tracks,
      kick: {
        ...state.tracks.kick,
        steps: customSteps,
        volume: 0.42,
        pan: -0.5,
        muted: true,
      },
    },
  };
  const hash = encode(modified);
  const decoded = decode(hash);
  expect(decoded?.tracks.kick.steps).toEqual(customSteps);
  expect(decoded?.tracks.kick.volume).toBe(0.42);
  expect(decoded?.tracks.kick.pan).toBe(-0.5);
  expect(decoded?.tracks.kick.muted).toBe(true);
}, 5000);

test("decode returns undefined for garbage input", () => {
  expect(decode("garbage")).toBeUndefined();
  expect(decode("")).toBeUndefined();
  expect(decode("v1:!!notbase64!!")).toBeUndefined();
});

test("hasCustomSamples flag survives round-trip when true", () => {
  const hash = encode(state, true);
  const decoded = decode(hash);
  expect(decoded?.hasCustomSamples).toBe(true);
});
