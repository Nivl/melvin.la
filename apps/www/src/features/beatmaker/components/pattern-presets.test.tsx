import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { PatternPresets } from "./pattern-presets";

describe(PatternPresets, () => {
  it("renders all preset buttons", () => {
    expect.assertions(2);
    const { getByRole } = render(
      <PatternPresets onPresetSelect={vi.fn<(presetId: string) => void>()} />,
      {
        wrapper,
      },
    );
    expect(getByRole("button", { name: "Basic Rock" })).toBeDefined();
    expect(getByRole("button", { name: "Blank" })).toBeDefined();
  }, 5000);

  it("calls onPresetSelect with preset id on click", async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    const onPresetSelect = vi.fn<(presetId: string) => void>();
    const { getByRole } = render(<PatternPresets onPresetSelect={onPresetSelect} />, { wrapper });
    await user.click(getByRole("button", { name: "Blank" }));
    expect(onPresetSelect).toHaveBeenCalledWith("blank");
  }, 5000);
});
