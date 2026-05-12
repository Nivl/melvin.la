import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Contact } from "./contact";

vi.mock(import("next/dynamic"), async () => {
  const { dynamicMock } = await import("#shared/utils/mocks/dynamic");
  return dynamicMock as unknown as Awaited<typeof import("next/dynamic")>;
});

vi.mock(
  import("./map"),
  async () =>
    ({
      Map: () => <div data-testid="map-loaded" />,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    }) as unknown as Awaited<typeof import("./map")>,
);

const stubIntersectionObserver = () => {
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
};

describe(Contact, () => {
  it("renders a placeholder when the map is not yet in view", () => {
    expect.assertions(2);
    stubIntersectionObserver();
    render(<Contact />, { wrapper });
    expect(screen.getByTestId("map-placeholder")).toBeDefined();
    expect(screen.queryByTestId("map-loaded")).toBeNull();
  }, 5000);

  it("still exposes the Email / LinkedIn / GitHub contact links", () => {
    expect.assertions(3);
    stubIntersectionObserver();
    render(<Contact />, { wrapper });
    expect(screen.getByText("jobs@melvin.la")).toBeDefined();
    expect(screen.getByText("in/melvinlaplanche")).toBeDefined();
    expect(screen.getByText("@Nivl")).toBeDefined();
  }, 5000);

  it("lazy-loads the LinkedIn modal only when the link is clicked", async () => {
    expect.assertions(2);
    stubIntersectionObserver();
    const user = userEvent.setup();
    render(<Contact />, { wrapper });

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByText("in/melvinlaplanche"));

    await expect(screen.findByRole("dialog")).resolves.toBeDefined();
  }, 5000);
});
