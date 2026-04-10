import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { buildDefaultState, encode } from "#features/beatmaker/models/index.ts";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Beatmaker } from "./Beatmaker";

// ── Mock audio engine ──────────────────────────────────────────────────────
const mockEngine = {
  init: vi.fn().mockImplementation(() => Promise.resolve()),
  loadKit: vi.fn().mockImplementation(() => Promise.resolve()),
  loadCustomFile: vi.fn().mockImplementation(() => Promise.resolve()),
  start: vi.fn(),
  stop: vi.fn(),
  dispose: vi.fn(),
  clearCustomFiles: vi.fn(),
};

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("#features/beatmaker/models", async (importOriginal) => {
  const actual = await importOriginal<typeof import("#features/beatmaker/models")>();
  return { ...actual, createEngine: () => mockEngine };
});

beforeEach(() => {
  vi.clearAllMocks();
  // Reset hash
  globalThis.location.hash = "";
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function renderWithWrapper(element: ReactNode) {
  const Wrapper = wrapper;
  return <Wrapper>{element}</Wrapper>;
}

function mockNavigator({
  userAgent,
  platform,
  maxTouchPoints,
}: {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}) {
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
}

test("renders the Play button on initial load", () => {
  const { getByRole } = render(<Beatmaker />, { wrapper });
  expect(getByRole("button", { name: "Play" })).toBeDefined();
});

test("clicking Play initialises engine and starts playback", async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<Beatmaker />, { wrapper });
  await user.click(getByRole("button", { name: "Play" }));
  expect(mockEngine.init).toHaveBeenCalledTimes(1);
  expect(mockEngine.start).toHaveBeenCalledTimes(1);
});

test("mount hydration does not overwrite an early Play interaction", async () => {
  const user = userEvent.setup();

  render(<Beatmaker />, { wrapper });

  await user.click(screen.getByRole("button", { name: "Play" }));

  expect(mockEngine.init).toHaveBeenCalledTimes(1);
  expect(mockEngine.start).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy();

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy();
  });
});

test("initial mount does not write a default share hash before interaction", () => {
  vi.useFakeTimers();

  render(<Beatmaker />, { wrapper });

  expect(globalThis.location.hash).toBe("");

  act(() => {
    vi.advanceTimersByTime(350);
  });

  expect(globalThis.location.hash).toBe("");
});

test("clicking Stop stops playback", async () => {
  const user = userEvent.setup();
  const { getByRole } = render(<Beatmaker />, { wrapper });
  await user.click(getByRole("button", { name: "Play" }));
  await user.click(getByRole("button", { name: "Stop" }));
  expect(mockEngine.stop).toHaveBeenCalledTimes(1);
});

test("clicking a step button toggles it", async () => {
  const user = userEvent.setup();
  const { getAllByRole } = render(<Beatmaker />, { wrapper });
  const stepBtn = getAllByRole("button").find(
    (btn) =>
      btn.getAttribute("aria-pressed") !== null &&
      (btn.getAttribute("aria-label") ?? "").includes(" step "),
  );
  if (!stepBtn) throw new Error("No step button found");
  const wasPressed = stepBtn.getAttribute("aria-pressed") === "true";
  await user.click(stepBtn);
  expect(stepBtn.getAttribute("aria-pressed")).toBe(String(!wasPressed));
});

test("hydrates the UI from a shared hash on initial page load", async () => {
  const sharedState = {
    ...buildDefaultState(),
    kit: "lofi" as const,
    bpm: 173,
    stepCount: 32 as const,
    tracks: {
      ...buildDefaultState().tracks,
      kick: {
        ...buildDefaultState().tracks.kick,
        steps: Array.from({ length: 32 }, (_, index) => index === 2),
      },
    },
    isPlaying: false,
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
    expect(screen.getByText("173")).toBeTruthy();
    expect(screen.getByRole("button", { name: "32" }).getAttribute("aria-pressed")).toBe("true");
  });

  root.unmount();
  container.remove();
});

test("shows an iOS warning banner on iOS and lets the user dismiss it", async () => {
  mockNavigator({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    platform: "iPhone",
    maxTouchPoints: 5,
  });
  const user = userEvent.setup();

  render(<Beatmaker />, { wrapper });

  expect(await screen.findByText("No sounds?")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Dismiss" }));

  await waitFor(() => {
    expect(screen.queryByText("No sounds?")).toBeNull();
  });
});

test("does not show the iOS warning banner on non-iOS devices", async () => {
  mockNavigator({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    platform: "MacIntel",
    maxTouchPoints: 0,
  });

  render(<Beatmaker />, { wrapper });

  await waitFor(() => {
    expect(screen.queryByText("No sounds?")).toBeNull();
  });
});
