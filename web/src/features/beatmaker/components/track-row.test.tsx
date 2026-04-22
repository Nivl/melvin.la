import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { TrackRow } from "./track-row";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const steps16: boolean[] = Array.from<boolean>({ length: 16 }).fill(false);

const defaultProps = {
  activeStep: undefined as number | undefined,
  decodeError: undefined as string | undefined,
  hasCustomFile: false,
  onFileLoad: vi.fn<() => void>(),
  onStepToggle: vi.fn<() => void>(),
  steps: steps16,
  trackId: "kick" as const,
};

test("renders 16 step buttons", () => {
  const { getAllByRole } = render(<TrackRow {...defaultProps} />, { wrapper });
  const stepBtns = getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null,
  );
  expect(stepBtns).toHaveLength(16);
}, 5000);

test("toggles step on click", async () => {
  const user = userEvent.setup();
  const onStepToggle = vi.fn<(index: number) => void>();
  const { getAllByRole } = render(<TrackRow {...defaultProps} onStepToggle={onStepToggle} />, {
    wrapper,
  });
  const stepBtn = getAllByRole("button").find((btn) => btn.getAttribute("aria-pressed") !== null);
  if (!stepBtn) {
    throw new Error("No step button found");
  }
  await user.click(stepBtn);
  expect(onStepToggle).toHaveBeenCalledWith(0);
}, 5000);

test('active steps have aria-pressed="true"', () => {
  const activeSteps = steps16.map((_, i) => i === 3);
  const { getAllByRole } = render(<TrackRow {...defaultProps} steps={activeSteps} />, { wrapper });
  const stepBtns = getAllByRole("button").filter(
    (btn) => btn.getAttribute("aria-pressed") !== null,
  );
  expect(stepBtns[3].getAttribute("aria-pressed")).toBe("true");
  expect(stepBtns[0].getAttribute("aria-pressed")).toBe("false");
}, 5000);

test("shows decode error when provided", () => {
  const { getByText } = render(
    <TrackRow {...defaultProps} decodeError="Could not decode audio file." />,
    { wrapper },
  );
  expect(getByText("Could not decode audio file.")).toBeDefined();
}, 5000);

test("clicking the drop zone label triggers file selection (calls onFileLoad via change)", async () => {
  const user = userEvent.setup();
  const onFileLoad = vi.fn<(file: File) => void>();
  const file = new File(["audio"], "kick.mp3", { type: "audio/mpeg" });
  const { container } = render(<TrackRow {...defaultProps} onFileLoad={onFileLoad} />, { wrapper });
  const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!fileInput) {
    throw new Error("no file input");
  }
  await user.upload(fileInput, file);
  expect(onFileLoad).toHaveBeenCalledWith(file);
}, 5000);
