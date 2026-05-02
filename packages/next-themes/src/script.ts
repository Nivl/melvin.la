import type { ThemeProviderProps } from "./types";

type ThemeValueMap = NonNullable<ThemeProviderProps["value"]>;

export const script = (
  attribute: ThemeProviderProps["attribute"],
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string | undefined,
  themes: string[],
  value: ThemeValueMap | undefined,
  enableSystem: boolean,
  enableColorScheme: boolean,
) => {
  const el = document.documentElement;
  const systemThemes = new Set(["light", "dark"]);

  function updateDOM(theme: string) {
    const attributes = Array.isArray(attribute) ? attribute : [attribute ?? "data-theme"];

    attributes.forEach((attr) => {
      const isClass = attr === "class";
      const classes =
        isClass && value ? themes.map((themeName) => value[themeName] ?? themeName) : themes;
      if (isClass) {
        el.classList.remove(...classes);
        el.classList.add(value?.[theme] ?? theme);
      } else {
        el.setAttribute(attr, theme);
      }
    });

    setColorScheme(theme);
  }

  function setColorScheme(theme: string) {
    if (enableColorScheme && systemThemes.has(theme)) {
      el.style.colorScheme = theme;
    }
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (forcedTheme) {
    updateDOM(forcedTheme);
  } else {
    try {
      const themeName = localStorage.getItem(storageKey) ?? defaultTheme;
      const isSystem = enableSystem && themeName === "system";
      const theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
    } catch {
      //
    }
  }
};
