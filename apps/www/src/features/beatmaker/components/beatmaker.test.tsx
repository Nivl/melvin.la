import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { buildDefaultState, encode } from "#features/beatmaker/models/index";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Beatmaker } from "./beatmaker";

// ── Mock audio engine ──────────────────────────────────────────────────────
const mockEngine = {
  clearCustomFiles: vi.fn<() => void>(),
  dispose: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  init: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  loadCustomFile: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  loadKit: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  start: vi.fn<() => void>(),
  stop: vi.fn<() => void>(),
};

vi.mock(
  import("@melvinla/next-themes"),
  () =>
    ({
      ThemeProvider: ({ children }: { children: ReactElement }): ReactElement => children,
    }) as unknown as Awaited<typeof import("@melvinla/next-themes")>,
);

vi.mock(import("#features/beatmaker/models"), async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, createEngine: () => mockEngine } as unknown as Awaited<
    typeof import("#features/beatmaker/models")
  >;
});

const setup = () => {
  vi.clearAllMocks();
  globalThis.location.hash = "";
};

const renderWithWrapper = (element: ReactNode) => {
  const Wrapper = wrapper;
  return <Wrapper>{element}</Wrapper>;
};

const mockNavigator = ({
  userAgent,
  platform,
  maxTouchPoints,
}: {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}) => {
  Object.defineProperty(globalThis.navigator, "userAgent", {
    configurable: true,
    value: userAgent,
  });
  Object.defineProperty(globalThis.navigator, "platform", {
    configurable: true,
    value: platform,
  });
  Object.defineProperty(globalThis.navigator, "maxTouchPoints", {
    configurable: true,
    value: maxTouchPoints,
  });
};

describe(Beatmaker, () => {
  it("renders the Play button on initial load", () => {
    expect.assertions(1);
    setup();
    const { getByRole } = render(<Beatmaker />, { wrapper });
    expect(getByRole("button", { name: "Play" })).toBeDefined();
  }, 5000);

  it("clicking Play initialises engine and starts playback", async () => {
    expect.assertions(2);
    setup();
    const user = userEvent.setup();
    const { getByRole } = render(<Beatmaker />, { wrapper });
    await user.click(getByRole("button", { name: "Play" }));
    expect(mockEngine.init).toHaveBeenCalledTimes(1);
    expect(mockEngine.start).toHaveBeenCalledTimes(1);
  }, 5000);

  it("mount hydration does not overwrite an early Play interaction", async () => {
    expect.assertions(4);
    setup();
    const user = userEvent.setup();

    render(<Beatmaker />, { wrapper });

    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(mockEngine.init).toHaveBeenCalledTimes(1);
    expect(mockEngine.start).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Stop" })).toBeDefined();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Stop" })).toBeDefined();
    });
  }, 5000);

  it("initial mount does not write a default share hash before interaction", () => {
    expect.assertions(2);
    setup();
    vi.useFakeTimers();

    render(<Beatmaker />, { wrapper });

    expect(globalThis.location.hash).toBe("");

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(globalThis.location.hash).toBe("");
    vi.useRealTimers();
  }, 5000);

  it("clicking Stop stops playback", async () => {
    expect.assertions(1);
    setup();
    const user = userEvent.setup();
    const { getByRole } = render(<Beatmaker />, { wrapper });
    await user.click(getByRole("button", { name: "Play" }));
    await user.click(getByRole("button", { name: "Stop" }));
    expect(mockEngine.stop).toHaveBeenCalledTimes(1);
  }, 5000);

  it("clicking a step button toggles it", async () => {
    expect.assertions(1);
    setup();
    const user = userEvent.setup();
    const { getAllByRole } = render(<Beatmaker />, { wrapper });
    const stepBtn = getAllByRole("button").find(
      (btn) =>
        btn.getAttribute("aria-pressed") !== null &&
        (btn.getAttribute("aria-label") ?? "").includes(" step "),
    )!;
    const wasPressed = stepBtn.getAttribute("aria-pressed") === "true";
    await user.click(stepBtn);
    expect(stepBtn.getAttribute("aria-pressed")).toBe(String(!wasPressed));
  }, 5000);

  it("hydrates the UI from a shared hash on initial page load", async () => {
    expect.assertions(2);
    setup();
    const sharedState = {
      ...buildDefaultState(),
      bpm: 173,
      isPlaying: false,
      kit: "lofi" as const,
      stepCount: 32 as const,
      tracks: {
        ...buildDefaultState().tracks,
        kick: {
          ...buildDefaultState().tracks.kick,
          steps: Array.from({ length: 32 }, (_, index) => index === 2),
        },
      },
    };
    const hash = encode(sharedState);

    vi.stubGlobal("window", { matchMedia: globalThis.matchMedia });
    const serverMarkup = renderToString(renderWithWrapper(<Beatmaker />));
    vi.unstubAllGlobals();

    globalThis.location.hash = `#${hash}`;
    const container = document.createElement("div");
    container.innerHTML = serverMarkup;
    document.body.append(container);

    const root = hydrateRoot(container, renderWithWrapper(<Beatmaker />));

    await waitFor(() => {
      expect(screen.getByText("173")).toBeDefined();
      expect(screen.getByRole("button", { name: "32" }).getAttribute("aria-pressed")).toBe("true");
    });

    root.unmount();
    container.remove();
  }, 5000);

  it("shows an iOS warning banner on iOS and lets the user dismiss it", async () => {
    expect.assertions(2);
    setup();
    mockNavigator({
      maxTouchPoints: 5,
      platform: "iPhone",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    });
    const user = userEvent.setup();

    render(<Beatmaker />, { wrapper });

    await expect(screen.findByText("No sounds?")).resolves.toBeDefined();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    await waitFor(() => {
      expect(screen.queryByText("No sounds?")).toBeNull();
    });
  }, 5000);

  it("does not show the iOS warning banner on non-iOS devices", async () => {
    expect.assertions(1);
    setup();
    mockNavigator({
      maxTouchPoints: 0,
      platform: "MacIntel",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    });

    render(<Beatmaker />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText("No sounds?")).toBeNull();
    });
  }, 5000);
});
