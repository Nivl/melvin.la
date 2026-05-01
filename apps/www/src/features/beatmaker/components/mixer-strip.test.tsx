import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { MixerStrip } from "./mixer-strip";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const defaultProps = {
  muted: false,
  onMuteToggle: vi.fn<() => void>(),
  onPanChange: vi.fn<(v: number) => void>(),
  onVolumeChange: vi.fn<(v: number) => void>(),
  pan: 0,
  trackId: "kick" as const,
  volume: 0.8,
};

test("renders volume slider", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, {
    wrapper,
  });
  expect(getByRole("slider", { name: "Volume" })).toBeDefined();
}, 5000);

test("renders pan number field", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, {
    wrapper,
  });
  expect(getByRole("textbox", { name: "Pan" })).toBeDefined();
}, 5000);

test("renders mute button", () => {
  const { getByRole } = render(<MixerStrip {...defaultProps} />, { wrapper });
  expect(getByRole("button", { name: "Mute" })).toBeDefined();
}, 5000);

test("calls onMuteToggle when mute button pressed", async () => {
  const user = userEvent.setup();
  const onMuteToggle = vi.fn<() => void>();
  const { getByRole } = render(<MixerStrip {...defaultProps} onMuteToggle={onMuteToggle} />, {
    wrapper,
  });
  await user.click(getByRole("button", { name: "Mute" }));
  expect(onMuteToggle).toHaveBeenCalledTimes(1);
}, 5000);
