import { expect, test } from "vitest";

import { buildDefaultState, PRESETS } from "./presets";
import { TRACK_IDS } from "./types";

test("each preset has steps arrays matching its stepCount", () => {
  for (const preset of Object.values(PRESETS)) {
    for (const trackId of TRACK_IDS) {
      expect(preset.tracks[trackId].steps).toHaveLength(preset.stepCount);
    }
  }
});

test("trap preset has stepCount 32", () => {
  expect(PRESETS.trap.stepCount).toBe(32);
});

test("blank preset has all steps off", () => {
  const { blank } = PRESETS;
  for (const trackId of TRACK_IDS) {
    expect(blank.tracks[trackId].steps.every((step) => !step)).toBe(true);
  }
});

test("buildDefaultState returns a valid BeatmakerState", () => {
  const state = buildDefaultState();
  expect(state.isPlaying).toBe(false);
  expect(state.bpm).toBe(120);
  expect(state.stepCount).toBe(16);
  expect(state.kit).toBe("808");
});
