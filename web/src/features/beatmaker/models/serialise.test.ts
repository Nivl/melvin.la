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
