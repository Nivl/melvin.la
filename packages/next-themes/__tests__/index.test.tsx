// @vitest-environment jsdom

import * as React from "react";
import { act, render, renderHook } from "@testing-library/react";
import { vi, beforeAll, beforeEach, afterEach, afterAll, describe, test, it, expect } from "vitest";
import { cleanup } from "@testing-library/react";

import { ThemeProvider, useTheme } from "../src/index";
import { ThemeProviderProps } from "../src/types";

let originalLocalStorage: Storage;
const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string): string => store[key] ?? null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn((): void => {
      store = {};
    }),
    key: vi.fn((index: number): string | null => ""),
    length: Object.keys(store).length,
  };
})();

const HelperComponent = ({
  forceSetAppearance,
  forceSetTheme,
}: {
  forceSetAppearance?: "light" | "dark" | "system";
  forceSetTheme?: string;
}) => {
  const { setAppearance, setTheme, appearance, theme } = useTheme();

  React.useEffect(() => {
    if (forceSetAppearance) setAppearance(forceSetAppearance);
    if (forceSetTheme) setTheme(forceSetTheme);
  }, [forceSetAppearance, forceSetTheme, setAppearance, setTheme]);

  return (
    <>
      <p data-testid="appearance">{appearance}</p>
      <p data-testid="theme">{theme}</p>
    </>
  );
};

function setDeviceTheme(theme: "light" | "dark") {
  // Create a mock of the window.matchMedia function
  // Based on: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: theme === "dark" ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeAll(() => {
  // Create mocks of localStorage getItem and setItem functions
  originalLocalStorage = window.localStorage;
  window.localStorage = localStorageMock;
});

beforeEach(() => {
  // Reset window side-effects
  setDeviceTheme("light");
  document.documentElement.style.colorScheme = "";
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-appearance");
  document.documentElement.removeAttribute("class");

  // Clear the localStorage-mock
  localStorageMock.clear();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  window.localStorage = originalLocalStorage;
});

function makeWrapper(props: ThemeProviderProps) {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider {...props}>{children}</ThemeProvider>
  );
}

describe("defaultTheme", () => {
  test("should return system appearance when no defaults are set", () => {
    setDeviceTheme("light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });
    expect(result.current.appearance).toBe("system");
    expect(result.current.theme).toBeUndefined();
    expect(result.current.systemAppearance).toBe("light");
    expect(result.current.resolvedAppearance).toBe("light");
  });

  test("should return light appearance when no default-theme is set and enableSystem=false", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ enableSystem: false }),
    });

    expect(result.current.appearance).toBe("light");
    expect(result.current.theme).toBeUndefined();
    expect(result.current.resolvedAppearance).toBe("light");
  });

  test("should return light theme-family when light is set as default-theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "light" }),
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.appearance).toBe("system");
  });

  test("should return dark theme-family when dark is set as default-theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "dark" }),
    });
    expect(result.current.theme).toBe("dark");
  });
});

describe("provider", () => {
  it("ignores nested ThemeProviders", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="dark">
          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        </ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("dark");
  });
});

describe("storage", () => {
  test("should not set localStorage with default value", () => {
    renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "dark" }),
    });

    expect(window.localStorage.setItem).toBeCalledTimes(0);
    expect(window.localStorage.getItem("theme")).toBeNull();
  });

  test("should set localStorage when switching themes", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });
    result.current.setTheme("dark");

    expect(window.localStorage.setItem).toBeCalledTimes(1);
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });
});

describe("custom storageKey", () => {
  test("should save to localStorage with 'theme' key when using default settings", () => {
    act(() => {
      render(
        <ThemeProvider>
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(window.localStorage.getItem).toHaveBeenCalledWith("theme");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  test("should save to localStorage with 'custom' when setting prop 'themeStorageKey' to 'customKey'", () => {
    act(() => {
      render(
        <ThemeProvider themeStorageKey="customKey">
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(window.localStorage.getItem).toHaveBeenCalledWith("customKey");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("customKey", "light");
  });
});

describe("custom attribute", () => {
  test("should use data-theme attribute when using default", () => {
    act(() => {
      render(
        <ThemeProvider>
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  test('should use class attribute (CSS-class) when themeAttribute="class"', () => {
    act(() => {
      render(
        <ThemeProvider themeAttribute="class">
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.classList.contains("light")).toBeTruthy();
  });

  test('should use "data-example"-attribute when themeAttribute="data-example"', () => {
    act(() => {
      render(
        <ThemeProvider themeAttribute="data-example">
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-example")).toBe("light");
  });

  test("supports multiple attributes", () => {
    act(() => {
      render(
        <ThemeProvider themeAttribute={["data-example", "data-theme-test"]}>
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-example")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme-test")).toBe("light");
  });
});

describe("custom value-mapping", () => {
  test('should use custom value mapping when using themeValue={{pink:"my-pink-theme"}}', () => {
    localStorageMock.setItem("theme", "pink");

    act(() => {
      render(
        <ThemeProvider themes={["pink", "light", "dark"]} themeValue={{ pink: "my-pink-theme" }}>
          <HelperComponent forceSetTheme="pink" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("my-pink-theme");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "pink");
  });

  test("should allow missing values (attribute)", () => {
    act(() => {
      render(
        <ThemeProvider themeValue={{ dark: "dark-mode" }}>
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.hasAttribute("data-theme")).toBeFalsy();
  });

  test("should allow missing values (class)", () => {
    act(() => {
      render(
        <ThemeProvider themeAttribute="class" themeValue={{ dark: "dark-mode" }}>
          <HelperComponent forceSetTheme="light" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.classList.contains("light")).toBeFalsy();
  });

  test("supports multiple attributes", () => {
    act(() => {
      render(
        <ThemeProvider
          themeAttribute={["data-example", "data-theme-test"]}
          themes={["pink", "light", "dark"]}
          themeValue={{ pink: "my-pink-theme" }}
        >
          <HelperComponent forceSetTheme="pink" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-example")).toBe("my-pink-theme");
    expect(document.documentElement.getAttribute("data-theme-test")).toBe("my-pink-theme");
  });
});

describe("forcedTheme", () => {
  test("should render saved theme when no forcedTheme is set", () => {
    // Use a non-appearance theme name so the migration shim does not trigger
    localStorageMock.setItem("theme", "ocean");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });

    expect(result.current.theme).toBe("ocean");
    expect(result.current.forcedTheme).toBeUndefined();
  });

  test("should render forced theme when forcedTheme is set to light", () => {
    localStorageMock.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({
        forcedTheme: "light",
      }),
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.forcedTheme).toBe("light");
  });
});

describe("system theme", () => {
  test("resolved appearance should be set", () => {
    setDeviceTheme("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({}),
    });

    expect(result.current.appearance).toBe("system");
    expect(result.current.systemAppearance).toBe("dark");
    expect(result.current.resolvedAppearance).toBe("dark");
    expect(result.current.forcedTheme).toBeUndefined();
  });

  test("system appearance should be tracked even when appearance is not system", () => {
    setDeviceTheme("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultAppearance: "light" }),
    });

    expect(result.current.appearance).toBe("light");
    expect(result.current.resolvedAppearance).toBe("light");
    expect(result.current.systemAppearance).toBe("dark");
  });

  test("system appearance should not be set if enableSystem is false", () => {
    setDeviceTheme("dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ enableSystem: false, defaultTheme: "light" }),
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.systemAppearance).toBeUndefined();
    expect(result.current.resolvedAppearance).toBe("light");
    expect(result.current.forcedTheme).toBeUndefined();
  });
});

describe("color-scheme", () => {
  test("does not set color-scheme when disabled", () => {
    act(() => {
      render(
        <ThemeProvider enableColorScheme={false}>
          <HelperComponent />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.style.colorScheme).toBe("");
  });

  test("should set color-scheme light when light appearance is active", () => {
    act(() => {
      render(
        <ThemeProvider>
          <HelperComponent />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  test("should set color-scheme dark when dark appearance is active", () => {
    act(() => {
      render(
        <ThemeProvider defaultAppearance="dark">
          <HelperComponent forceSetAppearance="dark" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-appearance")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});

describe("setTheme", () => {
  test("setTheme(<literal>)", () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider defaultTheme="light">{children}</ThemeProvider>,
    });
    expect(result.current?.setTheme).toBeDefined();
    expect(result.current.theme).toBe("light");
    result.current.setTheme("dark");
    rerender();
    expect(result.current.theme).toBe("dark");
  });

  test("setTheme(<function>)", () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider defaultTheme="light">{children}</ThemeProvider>,
    });
    expect(result.current?.setTheme).toBeDefined();
    expect(result.current.theme).toBe("light");

    const toggleTheme = vi.fn((theme: string) => (theme === "light" ? "dark" : "light"));

    result.current.setTheme(toggleTheme);
    expect(toggleTheme).toBeCalledTimes(1);
    rerender();

    expect(result.current.theme).toBe("dark");

    result.current.setTheme(toggleTheme);
    expect(toggleTheme).toBeCalledTimes(2);
    rerender();

    expect(result.current.theme).toBe("light");
  });

  test("setTheme(<function>) gets relevant state value", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider defaultTheme="light">{children}</ThemeProvider>,
    });

    act(() => {
      result.current.setTheme((theme) => {
        console.log("1", theme);
        return theme === "dark" ? "light" : "dark";
      });
      result.current.setTheme((theme) => {
        console.log("2", theme);
        return theme === "light" ? "dark" : "light";
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith("1", "light");
    expect(consoleSpy).toHaveBeenCalledWith("2", "dark");
    expect(result.current.theme).toBe("light");

    consoleSpy.mockRestore();
  });
});

describe("inline script", () => {
  test("should pass props to script", () => {
    act(() => {
      render(
        <ThemeProvider defaultTheme="light" scriptProps={{ "data-test": "1234" }}>
          <HelperComponent />
        </ThemeProvider>,
      );
    });

    expect(document.querySelector('script[data-test="1234"]')).toBeTruthy();
  });
});

describe("appearance defaults", () => {
  test("returns system appearance by default and keeps the default theme family", () => {
    setDeviceTheme("light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "pink", themes: ["pink", "blue"] }),
    });

    expect(result.current.appearance).toBe("system");
    expect(result.current.systemAppearance).toBe("light");
    expect(result.current.resolvedAppearance).toBe("light");
    expect(result.current.theme).toBe("pink");
    expect(result.current.themes).toEqual(["pink", "blue"]);
  });
});

describe("split storage persistence", () => {
  test("persists appearance and theme independently", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "pink", themes: ["pink", "blue"] }),
    });

    act(() => {
      result.current.setAppearance("dark");
      result.current.setTheme("blue");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith("appearance", "dark");
    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "blue");
  });
});

describe("attributes", () => {
  test("applies both theme and appearance data attributes", () => {
    act(() => {
      render(
        <ThemeProvider
          defaultTheme="pink"
          themes={["pink", "blue"]}
          themeAttribute="data-theme"
          appearanceAttribute="data-appearance"
        >
          <HelperComponent forceSetAppearance="dark" forceSetTheme="pink" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("pink");
    expect(document.documentElement.getAttribute("data-appearance")).toBe("dark");
  });
});

describe("class attributes", () => {
  test("applies both theme and resolved appearance classes", () => {
    act(() => {
      render(
        <ThemeProvider
          themes={["pink", "blue"]}
          defaultTheme="pink"
          themeAttribute="class"
          appearanceAttribute="class"
        >
          <HelperComponent forceSetAppearance="dark" forceSetTheme="pink" />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.classList.contains("pink")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("forced values", () => {
  test("blocks appearance changes when forcedAppearance is set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({
        forcedAppearance: "light",
        defaultTheme: "pink",
        themes: ["pink", "blue"],
      }),
    });

    act(() => result.current.setAppearance("dark"));

    expect(result.current.appearance).toBe("light");
    expect(result.current.resolvedAppearance).toBe("light");
  });

  test("blocks theme changes when forcedTheme is set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({
        forcedTheme: "pink",
        defaultTheme: "blue",
        themes: ["pink", "blue"],
      }),
    });

    act(() => result.current.setTheme("blue"));

    expect(result.current.theme).toBe("pink");
  });
});

describe("storage events", () => {
  test("storage event updates appearance when not forced", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultAppearance: "light" }),
    });

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "appearance", newValue: "dark" }));
    });

    expect(result.current.appearance).toBe("dark");
  });

  test("storage event does not update appearance when forcedAppearance is set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ forcedAppearance: "light" }),
    });

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "appearance", newValue: "dark" }));
    });

    expect(result.current.appearance).toBe("light");
  });

  test("storage event updates theme when not forced", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "pink", themes: ["pink", "blue"] }),
    });

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "blue" }));
    });

    expect(result.current.theme).toBe("blue");
  });

  test("storage event does not update theme when forcedTheme is set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ forcedTheme: "pink", defaultTheme: "pink", themes: ["pink", "blue"] }),
    });

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "blue" }));
    });

    expect(result.current.theme).toBe("pink");
  });
});

describe("legacy localStorage migration (v1→v2)", () => {
  test('treats legacy theme="dark" as appearance when appearance key is absent', () => {
    // Old next-themes stored appearance in localStorage.theme; new code uses localStorage.appearance
    localStorageMock.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "blue", themes: ["blue", "green"] }),
    });

    expect(result.current.appearance).toBe("dark");
    expect(result.current.theme).toBe("blue");
  });

  test('treats legacy theme="light" as appearance when appearance key is absent', () => {
    localStorageMock.setItem("theme", "light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "blue", themes: ["blue", "green"] }),
    });

    expect(result.current.appearance).toBe("light");
    expect(result.current.theme).toBe("blue");
  });

  test('treats legacy theme="system" as appearance when appearance key is absent', () => {
    localStorageMock.setItem("theme", "system");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "blue", themes: ["blue", "green"] }),
    });

    expect(result.current.appearance).toBe("system");
    expect(result.current.theme).toBe("blue");
  });

  test("does not migrate when the stored theme is not a legacy appearance value", () => {
    localStorageMock.setItem("theme", "pink");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "blue", themes: ["pink", "blue"] }),
    });

    // 'pink' is not a legacy appearance value — it stays as theme-family
    expect(result.current.theme).toBe("pink");
    expect(result.current.appearance).toBe("system");
  });

  test("does not migrate when the appearance key is already present", () => {
    localStorageMock.setItem("theme", "dark");
    localStorageMock.setItem("appearance", "light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ defaultTheme: "blue", themes: ["blue", "green", "dark"] }),
    });

    expect(result.current.appearance).toBe("light");
    // theme-family from the theme key (not migrated)
    expect(result.current.theme).toBe("dark");
  });
});

describe('enableSystem=false with "system" appearance', () => {
  test('resolves stored "system" appearance to "light" when enableSystem=false', () => {
    localStorageMock.setItem("appearance", "system");

    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper({ enableSystem: false }),
    });

    expect(result.current.resolvedAppearance).toBe("light");
  });

  test('does not write "system" to data-appearance when enableSystem=false and stored appearance is "system"', () => {
    localStorageMock.setItem("appearance", "system");

    act(() => {
      render(
        <ThemeProvider enableSystem={false}>
          <HelperComponent />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  test('does not write "system" to data-appearance when forcedAppearance="system" and enableSystem=false', () => {
    act(() => {
      render(
        <ThemeProvider enableSystem={false} forcedAppearance={"system" as any}>
          <HelperComponent />
        </ThemeProvider>,
      );
    });

    expect(document.documentElement.getAttribute("data-appearance")).toBe("light");
  });
});
