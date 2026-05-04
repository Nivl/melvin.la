// @vitest-environment jsdom

import { beforeEach, describe, expect, test, vi } from "vitest";
import { script } from "../src/script";

function setDeviceTheme(theme: "light" | "dark") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: theme === "dark",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("script", () => {
  beforeEach(() => {
    setDeviceTheme("light");
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-appearance");
    document.documentElement.style.colorScheme = "";
  });

  test("applies data attributes for theme + resolved system appearance", () => {
    localStorage.setItem("appearance", "system");
    localStorage.setItem("theme", "pink");

    script(
      "data-appearance",
      "data-theme",
      "appearance",
      "theme",
      "system",
      "pink",
      undefined,
      undefined,
      ["pink", "blue"],
      undefined,
      undefined,
      true,
      true,
    );

    expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("pink");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  test("does not throw when localStorage is unavailable", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("localStorage unavailable");
      },
      configurable: true,
    });

    try {
      expect(() =>
        script(
          "data-appearance",
          "data-theme",
          "appearance",
          "theme",
          "light",
          "pink",
          undefined,
          undefined,
          ["pink", "blue"],
          undefined,
          undefined,
          false,
          true,
        ),
      ).not.toThrow();
    } finally {
      Object.defineProperty(window, "localStorage", descriptor!);
    }

    // The whole body is wrapped in try/catch, so when storage throws the DOM is unchanged
    expect(document.documentElement.hasAttribute("data-appearance")).toBe(false);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("");
  });

  test("omits attribute when appearance mapping key is missing", () => {
    localStorage.setItem("appearance", "light");

    // mapping only maps 'dark', not 'light' — so 'light' should be omitted from the DOM
    script(
      "data-appearance",
      "data-theme",
      "appearance",
      "theme",
      "light",
      undefined,
      undefined,
      undefined,
      [],
      { dark: "dark-mode" }, // missing 'light' key
      undefined,
      false,
      false,
    );

    expect(document.documentElement.hasAttribute("data-appearance")).toBe(false);
  });

  describe("legacy localStorage migration (v1→v2)", () => {
    test('treats legacy theme="dark" as appearance when appearance key is absent', () => {
      localStorage.setItem("theme", "dark");

      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "system",
        "blue",
        undefined,
        undefined,
        ["blue", "green"],
        undefined,
        undefined,
        true,
        true,
      );

      expect(document.documentElement.getAttribute("data-appearance")).toBe("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("blue");
    });

    test('treats legacy theme="system" as appearance when appearance key is absent', () => {
      localStorage.setItem("theme", "system");
      setDeviceTheme("dark");

      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "system",
        "blue",
        undefined,
        undefined,
        ["blue", "green"],
        undefined,
        undefined,
        true,
        true,
      );

      expect(document.documentElement.getAttribute("data-appearance")).toBe("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("blue");
    });

    test("does not migrate when the appearance key is already present", () => {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("appearance", "light");

      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "system",
        "blue",
        undefined,
        undefined,
        ["blue", "green", "dark"],
        undefined,
        undefined,
        true,
        true,
      );

      expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });

    test("does not migrate non-legacy theme values", () => {
      localStorage.setItem("theme", "pink");

      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "system",
        "blue",
        undefined,
        undefined,
        ["pink", "blue"],
        undefined,
        undefined,
        true,
        true,
      );

      expect(document.documentElement.getAttribute("data-theme")).toBe("pink");
    });
  });

  describe("enableSystem=false normalization", () => {
    test('normalizes stored "system" appearance to "light" when enableSystem=false', () => {
      localStorage.setItem("appearance", "system");

      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "light",
        undefined,
        undefined,
        undefined,
        [],
        undefined,
        undefined,
        false,
        true,
      );

      expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
      expect(document.documentElement.style.colorScheme).toBe("light");
    });

    test('normalizes forcedAppearance="system" to "light" when enableSystem=false', () => {
      script(
        "data-appearance",
        "data-theme",
        "appearance",
        "theme",
        "light",
        undefined,
        "system",
        undefined,
        [],
        undefined,
        undefined,
        false,
        true,
      );

      expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
      expect(document.documentElement.style.colorScheme).toBe("light");
    });
  });
});
