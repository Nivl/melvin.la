import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Kit } from "#features/beatmaker/models/index";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { KitSelector } from "./kit-selector";

describe(KitSelector, () => {
  it("renders a button for each kit", () => {
    expect.assertions(3);
    const { getByRole } = render(
      <KitSelector activeKit="808" onKitChange={vi.fn<(kit: Kit) => void>()} />,
      { wrapper },
    );
    expect(getByRole("button", { name: "808" })).toBeDefined();
    expect(getByRole("button", { name: "Acoustic" })).toBeDefined();
    expect(getByRole("button", { name: "Lo-fi" })).toBeDefined();
  }, 5000);

  it("calls onKitChange with kit id on click", async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    const onKitChange = vi.fn<(kit: Kit) => void>();
    const { getByRole } = render(<KitSelector activeKit="808" onKitChange={onKitChange} />, {
      wrapper,
    });
    await user.click(getByRole("button", { name: "Acoustic" }));
    expect(onKitChange).toHaveBeenCalledWith("acoustic");
  }, 5000);
});
