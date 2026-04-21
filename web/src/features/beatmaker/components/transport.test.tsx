import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import type { StepCount } from "#features/beatmaker/models/index.ts";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Transport } from "./transport";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const defaultProps = {
  bpm: 120,
  copied: false,
  isPlaying: false,
  onBpmChange: vi.fn(),
  onCopy: vi.fn(),
  onPlayToggle: vi.fn(),
  onStepCountChange: vi.fn(),
  stepCount: 16 as const,
};

test("renders Play button when not playing", () => {
  const { getByRole } = render(<Transport {...defaultProps} />, { wrapper });
  expect(getByRole("button", { name: "Play" })).toBeDefined();
});

test("renders Stop button when playing", () => {
  const { getByRole } = render(<Transport {...defaultProps} isPlaying />, {
    wrapper,
  });
  expect(getByRole("button", { name: "Stop" })).toBeDefined();
});

test("calls onPlayToggle when Play button clicked", async () => {
  const user = userEvent.setup();
  const onPlayToggle = vi.fn<() => void>();
  const { getByRole } = render(<Transport {...defaultProps} onPlayToggle={onPlayToggle} />, {
    wrapper,
  });
  await user.click(getByRole("button", { name: "Play" }));
  expect(onPlayToggle).toHaveBeenCalledTimes(1);
});

test("renders step count chips for 8, 16, 32", () => {
  const { getByRole } = render(<Transport {...defaultProps} />, { wrapper });
  expect(getByRole("button", { name: "8" })).toBeDefined();
  expect(getByRole("button", { name: "16" })).toBeDefined();
  expect(getByRole("button", { name: "32" })).toBeDefined();
});

test("calls onStepCountChange when a step chip is clicked", async () => {
  const user = userEvent.setup();
  const onStepCountChange = vi.fn<(steps: StepCount) => void>();
  const { getByRole } = render(
    <Transport {...defaultProps} onStepCountChange={onStepCountChange} />,
    { wrapper },
  );
  await user.click(getByRole("button", { name: "32" }));
  expect(onStepCountChange).toHaveBeenCalledWith(32);
});

test("BPM slider is present with correct label", () => {
  const { getByRole } = render(<Transport {...defaultProps} />, {
    wrapper,
  });
  expect(getByRole("slider", { name: "BPM" })).toBeDefined();
});
