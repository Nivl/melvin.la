import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Contact } from "./contact";

vi.mock(
  import("./map"),
  async () =>
    ({
      Map: () => <div data-testid="map-loaded" />,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    }) as unknown as Awaited<typeof import("./map")>,
);

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class MockIntersectionObserver {
      public disconnect = vi.fn<() => void>();
      public observe = vi.fn<() => void>();
      public rootMargin = "";
      public takeRecords = vi.fn<() => []>();
      public thresholds: readonly number[] = [];
      public unobserve = vi.fn<() => void>();
    },
  );
});

describe("Contact component", () => {
  it("renders a placeholder when the map is not yet in view", () => {
    render(<Contact />, { wrapper });
    expect(screen.getByTestId("map-placeholder")).toBeDefined();
    expect(screen.queryByTestId("map-loaded")).toBeNull();
  }, 5000);

  it("still exposes the Email / LinkedIn / GitHub contact links", () => {
    render(<Contact />, { wrapper });
    expect(screen.getByText("jobs@melvin.la")).toBeDefined();
    expect(screen.getByText("in/melvinlaplanche")).toBeDefined();
    expect(screen.getByText("@Nivl")).toBeDefined();
  }, 5000);
});
