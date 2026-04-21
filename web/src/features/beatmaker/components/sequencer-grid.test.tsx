import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { buildDefaultState } from "#features/beatmaker/models/index.ts";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { SequencerGrid } from "./sequencer-grid";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const state = buildDefaultState();

const defaultProps = {
  activeStep: undefined as number | undefined,
  decodeErrors: {} as Record<string, string>,
  onFileLoad: vi.fn(),
  onStepToggle: vi.fn(),
  tracks: state.tracks,
};

test("renders one row per track (6 rows)", () => {
  const { getAllByRole } = render(<SequencerGrid {...defaultProps} />, {
    wrapper,
  });
  const stepBtns = getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null,
  );
  // 6 tracks × 16 steps = 96 step buttons
  expect(stepBtns).toHaveLength(6 * 16);
});
