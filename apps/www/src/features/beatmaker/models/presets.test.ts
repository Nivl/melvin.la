import { describe, expect, it } from "vitest";

import { buildDefaultState, PRESETS } from "./presets";
import { TRACK_IDS } from "./types";

describe("presets", () => {
  it("each preset has steps arrays matching its stepCount", () => {
    expect.hasAssertions();
    for (const preset of Object.values(PRESETS)) {
      for (const trackId of TRACK_IDS) {
        expect(preset.tracks[trackId].steps).toHaveLength(preset.stepCount);
      }
    }
  }, 5000);

  it("trap preset has stepCount 32", () => {
    expect.assertions(1);
    expect(PRESETS.trap.stepCount).toBe(32);
  }, 5000);

  it("blank preset has all steps off", () => {
    expect.hasAssertions();
    const { blank } = PRESETS;
    for (const trackId of TRACK_IDS) {
      expect(blank.tracks[trackId].steps.every((step) => !step)).toBe(true);
    }
  }, 5000);

  it(
    buildDefaultState,
    () => {
      expect.assertions(4);
      const state = buildDefaultState();
      expect(state.isPlaying).toBe(false);
      expect(state.bpm).toBe(120);
      expect(state.stepCount).toBe(16);
      expect(state.kit).toBe("808");
    },
    5000,
  );
});
