import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { testWrapper as wrapper } from "#shared/utils/tests";

import { Contact } from "./contact";

vi.mock(import("next/dynamic"), async () => {
  const dynamicMock = {
    default: (factory: () => Promise<ComponentType<Record<string, unknown>>>) => {
      const Wrapper = (props: Record<string, unknown>) => {
        const [Comp, setComp] = useState<ComponentType<Record<string, unknown>> | undefined>(
          undefined,
        );
        useEffect(() => {
          factory()
            .then((mod) => {
              setComp(() => mod);
            })
            .catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
        }, []);
        return Comp ? <Comp {...props} /> : undefined;
      };
      return Wrapper;
    },
  };
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

  it("lazy-loads the LinkedIn modal only when the link is clicked", async () => {
    const user = userEvent.setup();
    render(<Contact />, { wrapper });

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByText("in/melvinlaplanche"));

    expect(await screen.findByRole("dialog")).toBeDefined();
  }, 5000);
});
