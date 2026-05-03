// This is a test file, we don't care too much about high react perf
//eslint-disable only-export-components

import { isAppearance, ThemeProvider, ThemeProviderProps, useTheme } from "@melvinla/next-themes";
import { DecoratorHelpers } from "@storybook/addon-themes";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import type { DecoratorFunction } from "storybook/internal/types";

type ThemeSwitcherProps = PropsWithChildren<{
  appearance: string;
}>;

const ThemeSwitcher = ({ appearance, children }: ThemeSwitcherProps) => {
  const { setAppearance, resolvedAppearance, appearance: currentAppearance } = useTheme();

  useEffect(() => {
    if (
      (appearance === "" && currentAppearance === "system") ||
      appearance === currentAppearance ||
      appearance === resolvedAppearance ||
      !isAppearance(appearance)
    ) {
      return;
    }

    setAppearance(appearance);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearance]);

  return <div className="bg-background">{children}</div>;
};

type NextThemesDecorator = Omit<ThemeProviderProps, "defaultTheme" | "themes"> & {
  themes: Record<string, string>;
  defaultTheme: string;
};

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

const hasThemeOverride = (
  value: unknown,
): value is {
  themes?: { themeOverride?: string };
} => typeof value === "object" && value !== null;

export const withNextThemes = ({ themes, defaultTheme, ...props }: NextThemesDecorator) => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  const decorator: DecoratorFunction = (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const params = hasThemeOverride(context.parameters) ? context.parameters : {};

    const { themeOverride } = params.themes ?? {};
    const selected = themeOverride ?? selectedTheme;

    return (
      // Those props are the default ones from the ThemeProvider,
      // so the spread is safe.
      // eslint-disable-next-line react/jsx-props-no-spreading
      <ThemeProvider {...props}>
        <ThemeSwitcher appearance={selected}>
          <Story />
        </ThemeSwitcher>
      </ThemeProvider>
    );
  };

  return decorator;
};
