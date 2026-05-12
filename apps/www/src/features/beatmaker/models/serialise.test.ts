import { describe, expect, it } from "vitest";

import { buildDefaultState } from "./presets";
import { decode, encode } from "./serialise";
import type { BeatmakerState } from "./types";

const state: BeatmakerState = buildDefaultState();

describe("serialise", () => {
  it('encode produces a string starting with "v1:"', () => {
    expect.assertions(1);
    const hash = encode(state);
    expect(hash).toMatch(/^v1:/);
  }, 5000);

  it("encode excludes isPlaying", () => {
    expect.assertions(1);
    const playing = { ...state, isPlaying: true };
    const notPlaying = { ...state, isPlaying: false };
    expect(encode(playing)).toBe(encode(notPlaying));
  }, 5000);

  it("round-trip: decode(encode(state)) reproduces state", () => {
    expect.assertions(6);
    const hash = encode(state);
    const decoded = decode(hash);
    // isPlaying is not encoded, so compare without it
    expect(decoded?.bpm).toBe(state.bpm);
    expect(decoded?.kit).toBe(state.kit);
    expect(decoded?.stepCount).toBe(state.stepCount);
    expect(decoded?.tracks.kick.steps).toStrictEqual(state.tracks.kick.steps);
    expect(decoded?.tracks.kick.volume).toBe(state.tracks.kick.volume);
    expect(decoded?.tracks.kick.muted).toBe(state.tracks.kick.muted);
  }, 5000);

  it("round-trip: decode(encode(state)) reproduces non-default track values", () => {
    expect.assertions(4);
    const customSteps = Array.from({ length: 16 }, (_, i) => i % 3 === 0);
    const modified: BeatmakerState = {
      ...state,
      tracks: {
        ...state.tracks,
        kick: {
          ...state.tracks.kick,
          muted: true,
          pan: -0.5,
          steps: customSteps,
          volume: 0.42,
        },
      },
    };
    const hash = encode(modified);
    const decoded = decode(hash);
    expect(decoded?.tracks.kick.steps).toStrictEqual(customSteps);
    expect(decoded?.tracks.kick.volume).toBe(0.42);
    expect(decoded?.tracks.kick.pan).toBe(-0.5);
    expect(decoded?.tracks.kick.muted).toBe(true);
  }, 5000);

  it("decode returns undefined for garbage input", () => {
    expect.assertions(3);
    expect(decode("garbage")).toBeUndefined();
    expect(decode("")).toBeUndefined();
    expect(decode("v1:!!notbase64!!")).toBeUndefined();
  }, 5000);

  it("hasCustomSamples flag survives round-trip when true", () => {
    expect.assertions(1);
    const hash = encode(state, true);
    const decoded = decode(hash);
    expect(decoded?.hasCustomSamples).toBe(true);
  }, 5000);
});
