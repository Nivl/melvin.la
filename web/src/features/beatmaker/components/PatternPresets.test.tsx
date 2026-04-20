import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { PatternPresets } from "./PatternPresets";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("renders all preset buttons", () => {
  const { getByRole } = render(
    <PatternPresets onPresetSelect={vi.fn<(presetId: string) => void>()} />,
    {
      wrapper,
    },
  );
  expect(getByRole("button", { name: "Basic Rock" })).toBeDefined();
  expect(getByRole("button", { name: "Blank" })).toBeDefined();
});

test("calls onPresetSelect with preset id on click", async () => {
  const user = userEvent.setup();
  const onPresetSelect = vi.fn<(presetId: string) => void>();
  const { getByRole } = render(<PatternPresets onPresetSelect={onPresetSelect} />, { wrapper });
  await user.click(getByRole("button", { name: "Blank" }));
  expect(onPresetSelect).toHaveBeenCalledWith("blank");
});
