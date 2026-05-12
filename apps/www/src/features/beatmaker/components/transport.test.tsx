import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { StepCount } from "#features/beatmaker/models/index";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Transport } from "./transport";

const defaultProps = {
  bpm: 120,
  copied: false,
  isPlaying: false,
  onBpmChange: vi.fn<(bpm: number) => void>(),
  onCopy: vi.fn<() => void>(),
  onPlayToggle: vi.fn<() => void>(),
  onStepCountChange: vi.fn<(steps: StepCount) => void>(),
  stepCount: 16 as const,
};

describe(Transport, () => {
  it("renders Play button when not playing", () => {
    expect.assertions(1);
    const { getByRole } = render(<Transport {...defaultProps} />, { wrapper });
    expect(getByRole("button", { name: "Play" })).toBeDefined();
  }, 5000);

  it("renders Stop button when playing", () => {
    expect.assertions(1);
    const { getByRole } = render(<Transport {...defaultProps} isPlaying />, {
      wrapper,
    });
    expect(getByRole("button", { name: "Stop" })).toBeDefined();
  }, 5000);

  it("calls onPlayToggle when Play button clicked", async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    const onPlayToggle = vi.fn<() => void>();
    const { getByRole } = render(<Transport {...defaultProps} onPlayToggle={onPlayToggle} />, {
      wrapper,
    });
    await user.click(getByRole("button", { name: "Play" }));
    expect(onPlayToggle).toHaveBeenCalledTimes(1);
  }, 5000);

  it("renders step count chips for 8, 16, 32", () => {
    expect.assertions(3);
    const { getByRole } = render(<Transport {...defaultProps} />, { wrapper });
    expect(getByRole("button", { name: "8" })).toBeDefined();
    expect(getByRole("button", { name: "16" })).toBeDefined();
    expect(getByRole("button", { name: "32" })).toBeDefined();
  }, 5000);

  it("calls onStepCountChange when a step chip is clicked", async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    const onStepCountChange = vi.fn<(steps: StepCount) => void>();
    const { getByRole } = render(
      <Transport {...defaultProps} onStepCountChange={onStepCountChange} />,
      { wrapper },
    );
    await user.click(getByRole("button", { name: "32" }));
    expect(onStepCountChange).toHaveBeenCalledWith(32);
  }, 5000);

  it("bPM slider is present with correct label", () => {
    expect.assertions(1);
    const { getByRole } = render(<Transport {...defaultProps} />, {
      wrapper,
    });
    expect(getByRole("slider", { name: "BPM" })).toBeDefined();
  }, 5000);
});
