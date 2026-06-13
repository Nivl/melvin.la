import "vitest-canvas-mock";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "#trpc/mock";

vi.mock(import("server-only"), () => ({}));

/* eslint-disable unicorn/no-document-cookie -- jsdom lacks the Cookie Store
   API; this shim has to back it with document.cookie. The definition is
   unconditional because jsdom never provides cookieStore, and the DOM types
   declare it always-present, so a runtime existence check doesn't type-check. */
const fallbackCookieStore = {
  async delete(name: string): Promise<void> {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    await Promise.resolve();
  },
  async get(name: string): Promise<{ name: string; value: string } | undefined> {
    const entry = document.cookie.split("; ").find((candidate) => candidate.startsWith(`${name}=`));
    return await Promise.resolve(
      entry === undefined ? undefined : { name, value: entry.slice(name.length + 1) },
    );
  },
  async set(init: { name: string; value: string }): Promise<void> {
    document.cookie = `${init.name}=${init.value}`;
    await Promise.resolve();
  },
};
// configurable so tests can delete the global to simulate browsers
// without the Cookie Store API.
Object.defineProperty(globalThis, "cookieStore", {
  configurable: true,
  value: fallbackCookieStore,
  writable: true,
});
/* eslint-enable unicorn/no-document-cookie */

// jsdom doesn't implement CSS.escape, which react-aria uses to build the
// selectors backing menu selection behavior.
Object.defineProperty(globalThis, "CSS", {
  value: { escape: (value: string) => value.replaceAll(/[^\w-]/gu, String.raw`\$&`) },
  writable: true,
});

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

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
