import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { BobaCoordinate } from "#features/home/utils/boba";
import { bobaMaxAnimationDuration, defaultBobaCoordinates } from "#features/home/utils/boba";

import { Boba } from "./boba";

vi.mock(import("#features/home/utils/boba"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    generateBalls: vi.fn<() => BobaCoordinate[]>(() => actual.defaultBobaCoordinates.slice(0, 3)),
  } as Awaited<typeof import("#features/home/utils/boba")>;
});

const stubBobaEnv = () => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener() {},
    dispatchEvent() {
      return true;
    },
    matches: query === "(prefers-reduced-motion: no-preference)",
    media: query,
    onchange: undefined,
    removeEventListener() {},
  }));
};

describe(Boba, () => {
  it("starts and stops animating even when regenerated boba counts change", () => {
    expect.assertions(5);
    stubBobaEnv();
    const { container } = render(<Boba className="h-24 w-24" />);
    const svg = container.querySelector("svg")!;

    expect(container.querySelectorAll("circle")).toHaveLength(defaultBobaCoordinates.length);

    fireEvent.click(svg);

    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect(svg.getAttribute("class")).toContain("animate-shake");

    fireEvent.click(svg);

    act(() => {
      vi.advanceTimersByTime(bobaMaxAnimationDuration);
    });

    expect(container.querySelectorAll("circle")).toHaveLength(defaultBobaCoordinates.length);
    expect(svg.getAttribute("class")).not.toContain("animate-shake");
    vi.useRealTimers();
  }, 5000);
});
