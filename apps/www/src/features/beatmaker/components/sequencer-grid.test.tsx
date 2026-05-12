import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { buildDefaultState } from "#features/beatmaker/models/index";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { SequencerGrid } from "./sequencer-grid";

const state = buildDefaultState();

const defaultProps = {
  activeStep: undefined as number | undefined,
  decodeErrors: {} as Record<string, string>,
  onFileLoad: vi.fn<() => void>(),
  onStepToggle: vi.fn<() => void>(),
  tracks: state.tracks,
};

describe(SequencerGrid, () => {
  it("renders one row per track (6 rows)", () => {
    expect.assertions(1);
    const { getAllByRole } = render(<SequencerGrid {...defaultProps} />, {
      wrapper,
    });
    const stepBtns = getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-pressed") !== null,
    );
    // 6 tracks × 16 steps = 96 step buttons
    expect(stepBtns).toHaveLength(6 * 16);
  }, 5000);
});
