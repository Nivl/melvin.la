import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { testWrapper as wrapper } from "#utils/tests";

import { TrackRow } from "./TrackRow";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const steps16: boolean[] = Array.from<boolean>({ length: 16 }).fill(false);

const defaultProps = {
  trackId: "kick" as const,
  steps: steps16,
  onStepToggle: vi.fn(),
  onFileLoad: vi.fn(),
  hasCustomFile: false,
  decodeError: undefined as string | undefined,
  activeStep: undefined as number | undefined,
};

test("renders 16 step buttons", () => {
  const { getAllByRole } = render(<TrackRow {...defaultProps} />, { wrapper });
  const stepBtns = getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null,
  );
  expect(stepBtns).toHaveLength(16);
});

test("toggles step on click", async () => {
  const user = userEvent.setup();
  const onStepToggle = vi.fn();
  const { getAllByRole } = render(<TrackRow {...defaultProps} onStepToggle={onStepToggle} />, {
    wrapper,
  });
  const stepBtn = getAllByRole("button").find((btn) => btn.getAttribute("aria-pressed") !== null);
  if (!stepBtn) throw new Error("No step button found");
  await user.click(stepBtn);
  expect(onStepToggle).toHaveBeenCalledWith(0);
});

test('active steps have aria-pressed="true"', () => {
  const activeSteps = steps16.map((_, i) => i === 3);
  const { getAllByRole } = render(<TrackRow {...defaultProps} steps={activeSteps} />, { wrapper });
  const stepBtns = getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null,
  );
  expect(stepBtns[3].getAttribute("aria-pressed")).toBe("true");
  expect(stepBtns[0].getAttribute("aria-pressed")).toBe("false");
});

test("shows decode error when provided", () => {
  const { getByText } = render(
    <TrackRow {...defaultProps} decodeError="Could not decode audio file." />,
    { wrapper },
  );
  expect(getByText("Could not decode audio file.")).toBeDefined();
});

test("clicking the drop zone label triggers file selection (calls onFileLoad via change)", async () => {
  const user = userEvent.setup();
  const onFileLoad = vi.fn();
  const file = new File(["audio"], "kick.mp3", { type: "audio/mpeg" });
  const { container } = render(<TrackRow {...defaultProps} onFileLoad={onFileLoad} />, { wrapper });
  const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!fileInput) throw new Error("no file input");
  await user.upload(fileInput, file);
  expect(onFileLoad).toHaveBeenCalledWith(file);
});
