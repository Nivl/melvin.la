import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import type { Kit } from "#features/beatmaker/models/index.ts";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { KitSelector } from "./KitSelector";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("renders a button for each kit", () => {
  const { getByRole } = render(
    <KitSelector activeKit="808" onKitChange={vi.fn<(kit: Kit) => void>()} />,
    { wrapper },
  );
  expect(getByRole("button", { name: "808" })).toBeDefined();
  expect(getByRole("button", { name: "Acoustic" })).toBeDefined();
  expect(getByRole("button", { name: "Lo-fi" })).toBeDefined();
});

test("calls onKitChange with kit id on click", async () => {
  const user = userEvent.setup();
  const onKitChange = vi.fn<(kit: Kit) => void>();
  const { getByRole } = render(<KitSelector activeKit="808" onKitChange={onKitChange} />, {
    wrapper,
  });
  await user.click(getByRole("button", { name: "Acoustic" }));
  expect(onKitChange).toHaveBeenCalledWith("acoustic");
});
