import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { MixerStrip } from "./MixerStrip";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const defaultProps = {
  trackId: "kick" as const,
  volume: 0.8,
  pan: 0,
  muted: false,
  onVolumeChange: vi.fn(),
  onPanChange: vi.fn(),
  onMuteToggle: vi.fn(),
};

test("renders volume slider", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, {
    wrapper,
  });
  expect(getByRole("slider", { name: "Volume" })).toBeDefined();
});

test("renders pan number field", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, {
    wrapper,
  });
  expect(getByRole("textbox", { name: "Pan" })).toBeDefined();
});

test("renders mute button", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, { wrapper });
  expect(getByRole("button", { name: "Mute" })).toBeDefined();
});

test("calls onMuteToggle when mute button pressed", async () => {
  const user = userEvent.setup();
  const onMuteToggle = vi.fn();
  const { getByRole } = render(<MixerStrip {...defaultProps} onMuteToggle={onMuteToggle} />, {
    wrapper,
  });
  await user.click(getByRole("button", { name: "Mute" }));
  expect(onMuteToggle).toHaveBeenCalledTimes(1);
});
