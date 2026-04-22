import "vitest-canvas-mock";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "#trpc/mock";

Object.defineProperty(globalThis, "matchMedia", {
  value: vi.fn<(query: string) => object>().mockImplementation((query: string) => ({
    addEventListener: vi.fn<() => void>(),
    addListener: vi.fn<() => void>(),
    dispatchEvent: vi.fn<() => void>(),
    matches: false,
    media: query,
    removeEventListener: vi.fn<() => void>(),
    removeListener: vi.fn<() => void>(),
  })),
  writable: true,
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
