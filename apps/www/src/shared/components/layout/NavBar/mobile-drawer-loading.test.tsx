import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { MobileDrawerLoading } from "./mobile-drawer-loading";

describe("mobile drawer loading", () => {
  it("does not expose the visual placeholder button to assistive technology", () => {
    expect.assertions(1);
    render(<MobileDrawerLoading />, { wrapper });

    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
  }, 5000);
});
