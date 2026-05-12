import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { MixerStrip } from "./mixer-strip";

const defaultProps = {
  muted: false,
  onMuteToggle: vi.fn<() => void>(),
  onPanChange: vi.fn<(v: number) => void>(),
  onVolumeChange: vi.fn<(v: number) => void>(),
  pan: 0,
  trackId: "kick" as const,
  volume: 0.8,
};

describe(MixerStrip, () => {
  it("renders volume slider", () => {
    expect.assertions(1);
    const { getByRole } = render(<MixerStrip {...defaultProps} />, {
      wrapper,
    });
    expect(getByRole("slider", { name: "Volume" })).toBeDefined();
  }, 5000);

  it("renders pan number field", () => {
    expect.assertions(1);
    const { getByRole } = render(<MixerStrip {...defaultProps} />, {
      wrapper,
    });
    expect(getByRole("textbox", { name: "Pan" })).toBeDefined();
  }, 5000);

  it("renders mute button", () => {
    expect.assertions(1);
    const { getByRole } = render(<MixerStrip {...defaultProps} />, { wrapper });
    expect(getByRole("button", { name: "Mute" })).toBeDefined();
  }, 5000);

  it("calls onMuteToggle when mute button pressed", async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    const onMuteToggle = vi.fn<() => void>();
    const { getByRole } = render(<MixerStrip {...defaultProps} onMuteToggle={onMuteToggle} />, {
      wrapper,
    });
    await user.click(getByRole("button", { name: "Mute" }));
    expect(onMuteToggle).toHaveBeenCalledTimes(1);
  }, 5000);
});
