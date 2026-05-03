"use client";

import * as React from "react";
import { script } from "./script";
import type { Attribute, Appearance, ThemeProviderProps, UseThemeProps } from "./types";

const colorSchemes = ["light", "dark"] as const;

const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";

const LEGACY_APPEARANCE_VALUES: string[] = ["light", "dark", "system"];

// Migration shim: old versions stored appearance ('light'|'dark'|'system') in the theme key.
// Returns the migrated values when applicable.
const checkLegacyMigration = (
  appearanceStorageKey: string,
  themeStorageKey: string,
): { migratedAppearance: Appearance | null; useFallbackTheme: boolean } => {
  if (isServer) return { migratedAppearance: null, useFallbackTheme: false };
  try {
    const storedAppearance = localStorage.getItem(appearanceStorageKey);
    if (!storedAppearance) {
      const storedTheme = localStorage.getItem(themeStorageKey);
      if (storedTheme && LEGACY_APPEARANCE_VALUES.includes(storedTheme)) {
        return { migratedAppearance: storedTheme as Appearance, useFallbackTheme: true };
      }
    }
  } catch {}
  return { migratedAppearance: null, useFallbackTheme: false };
};
const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = {
  setTheme: (_) => {},
  setAppearance: (_) => {},
  themes: [],
};

const saveToLS = (storageKey: string, value: string) => {
  try {
    localStorage.setItem(storageKey, value);
  } catch (e) {
    // Unsupported
  }
};

export const useTheme = () => React.useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps) => {
  const context = React.useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return <>{props.children}</>;
  return <Theme {...props} />;
};

const getValue = (key: string, fallback?: string): string | undefined => {
  if (isServer) return fallback;
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
};

const getSystemAppearance = (e?: MediaQueryList | MediaQueryListEvent): "light" | "dark" => {
  const media = e ?? (typeof window !== "undefined" ? window.matchMedia(MEDIA) : null);
  if (!media) return "light";
  return media.matches ? "dark" : "light";
};

const applyAttribute = (
  node: HTMLElement,
  attr: Attribute | Attribute[],
  values: string[],
  active: string | undefined,
  mapping?: Record<string, string>,
) => {
  const attributes = Array.isArray(attr) ? attr : [attr];

  attributes.forEach((current) => {
    const isClass = current === "class";
    // When a mapping is provided, use mapped value; if key missing from mapping, treat as absent
    const mappedActive = active ? (mapping ? mapping[active] || null : active) : null;

    if (isClass) {
      const toRemove = values.map((v) => (mapping && mapping[v]) || v);
      if (toRemove.length > 0) node.classList.remove(...toRemove);
      if (mappedActive) node.classList.add(mappedActive);
    } else {
      if (mappedActive) {
        node.setAttribute(current, mappedActive);
      } else {
        node.removeAttribute(current);
      }
    }
  });
};

const Theme = ({
  forcedAppearance,
  forcedTheme,
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
  appearanceStorageKey = "appearance",
  themeStorageKey = "theme",
  defaultAppearance = enableSystem ? "system" : "light",
  defaultTheme,
  themes = [],
  appearanceAttribute = "data-appearance",
  themeAttribute = "data-theme",
  appearanceValue,
  themeValue,
  children,
  nonce,
  scriptProps,
}: ThemeProviderProps) => {
  const [appearance, setAppearanceState] = React.useState<Appearance>(() => {
    const { migratedAppearance } = checkLegacyMigration(appearanceStorageKey, themeStorageKey);
    if (migratedAppearance !== null) return migratedAppearance;
    return (getValue(appearanceStorageKey, defaultAppearance) as Appearance) ?? "light";
  });
  const [theme, setThemeState] = React.useState<string | undefined>(() => {
    const { useFallbackTheme } = checkLegacyMigration(appearanceStorageKey, themeStorageKey);
    if (useFallbackTheme) return defaultTheme ?? themes[0];
    return getValue(themeStorageKey, defaultTheme ?? themes[0]);
  });
  const [resolvedAppearance, setResolvedAppearance] = React.useState<"light" | "dark">(() =>
    getSystemAppearance(),
  );

  const applyState = React.useCallback(
    (
      nextAppearance: Appearance,
      nextTheme: string | undefined,
      currentResolved: "light" | "dark",
    ) => {
      const effectiveAppearance = forcedAppearance ?? nextAppearance;
      const effectiveTheme = forcedTheme ?? nextTheme;

      const resolved: "light" | "dark" =
        effectiveAppearance === "system"
          ? enableSystem
            ? currentResolved
            : "light"
          : (effectiveAppearance as "light" | "dark");

      const d = document.documentElement;
      const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;

      applyAttribute(d, appearanceAttribute, ["light", "dark"], resolved, appearanceValue);
      applyAttribute(d, themeAttribute, themes, effectiveTheme, themeValue);

      if (enableColorScheme && colorSchemes.includes(resolved)) {
        d.style.colorScheme = resolved;
      }

      enable?.();
    },
    [
      appearanceAttribute,
      appearanceValue,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      forcedAppearance,
      forcedTheme,
      nonce,
      themeAttribute,
      themeValue,
      themes,
    ],
  );

  const appearanceRef = React.useRef(appearance);
  appearanceRef.current = appearance;
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  const setAppearance = React.useCallback(
    (value: React.SetStateAction<Appearance>) => {
      if (forcedAppearance) return;
      const current = appearanceRef.current;
      const next = typeof value === "function" ? value(current) : value;
      saveToLS(appearanceStorageKey, next);
      appearanceRef.current = next;
      setAppearanceState(next);
    },
    [appearanceStorageKey, forcedAppearance],
  );

  const setTheme = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (forcedTheme) return;
      const current = themeRef.current ?? defaultTheme ?? themes[0] ?? "";
      const next = typeof value === "function" ? value(current) : value;
      saveToLS(themeStorageKey, next);
      themeRef.current = next;
      setThemeState(next);
    },
    [defaultTheme, forcedTheme, themeStorageKey, themes],
  );

  const handleMediaQuery = React.useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setResolvedAppearance(getSystemAppearance(e));
  }, []);

  // Always listen to system appearance
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling — skip axes that are currently forced to avoid state drift
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === appearanceStorageKey && !forcedAppearance) {
        setAppearanceState(
          e.newValue ? (e.newValue as Appearance) : (defaultAppearance as Appearance),
        );
      } else if (e.key === themeStorageKey && !forcedTheme) {
        setThemeState(e.newValue || defaultTheme || themes[0]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [
    appearanceStorageKey,
    defaultAppearance,
    defaultTheme,
    forcedAppearance,
    forcedTheme,
    themeStorageKey,
    themes,
  ]);

  // Apply both axes to the DOM whenever any relevant state changes
  React.useEffect(() => {
    applyState(appearance, theme, resolvedAppearance);
  }, [applyState, appearance, theme, resolvedAppearance]);

  const providerValue = React.useMemo(
    () => ({
      appearance: forcedAppearance ?? appearance,
      resolvedAppearance:
        (forcedAppearance ?? appearance) === "system"
          ? enableSystem
            ? resolvedAppearance
            : "light"
          : ((forcedAppearance ?? appearance) as "light" | "dark"),
      systemAppearance: enableSystem ? resolvedAppearance : undefined,
      setAppearance,
      theme: forcedTheme ?? theme,
      setTheme,
      themes,
      forcedAppearance,
      forcedTheme,
    }),
    [
      appearance,
      enableSystem,
      forcedAppearance,
      forcedTheme,
      resolvedAppearance,
      setAppearance,
      setTheme,
      theme,
      themes,
    ],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          forcedAppearance,
          forcedTheme,
          appearanceStorageKey,
          themeStorageKey,
          appearanceAttribute,
          themeAttribute,
          defaultAppearance,
          defaultTheme,
          enableSystem,
          enableColorScheme,
          appearanceValue,
          themeValue,
          themes,
          nonce,
          scriptProps,
        }}
      />

      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeScript = React.memo(
  ({
    forcedAppearance,
    forcedTheme,
    appearanceStorageKey = "appearance",
    themeStorageKey,
    appearanceAttribute = "data-appearance",
    themeAttribute,
    defaultAppearance,
    defaultTheme,
    enableSystem,
    enableColorScheme,
    appearanceValue,
    themeValue,
    themes,
    nonce,
    scriptProps,
  }: Omit<ThemeProviderProps, "children"> & {
    defaultAppearance?: string;
    defaultTheme?: string;
  }) => {
    const scriptArgs = JSON.stringify([
      appearanceAttribute,
      themeAttribute,
      appearanceStorageKey,
      themeStorageKey,
      defaultAppearance,
      defaultTheme,
      forcedAppearance,
      forcedTheme,
      themes,
      appearanceValue,
      themeValue,
      enableSystem,
      enableColorScheme,
    ]).slice(1, -1);

    return (
      <script
        {...scriptProps}
        suppressHydrationWarning
        nonce={typeof window === "undefined" ? nonce : ""}
        dangerouslySetInnerHTML={{ __html: `(${script.toString()})(${scriptArgs})` }}
      />
    );
  },
);

// Helpers
const disableAnimation = (nonce?: string) => {
  const css = document.createElement("style");
  if (nonce) css.setAttribute("nonce", nonce);
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

export const isAppearance = (value: string | undefined): value is Appearance =>
  value === "light" || value === "dark" || value === "system";

// Re-export types
export type {
  Attribute,
  Appearance,
  ResolvedAppearance,
  ThemeProviderProps,
  UseThemeProps,
} from "./types";
