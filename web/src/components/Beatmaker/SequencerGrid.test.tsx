import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { buildDefaultState } from "#models/beatmaker";
import { testWrapper as wrapper } from "#utils/tests";

import { SequencerGrid } from "./SequencerGrid";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const state = buildDefaultState();

const defaultProps = {
  tracks: state.tracks,
  onStepToggle: vi.fn(),
  onFileLoad: vi.fn(),
  decodeErrors: {} as Record<string, string>,
  activeStep: undefined as number | undefined,
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
