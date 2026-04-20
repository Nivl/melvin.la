// This is a test file, we don't care too much about high react perf
//eslint-disable only-export-components

import { DecoratorHelpers } from "@storybook/addon-themes";
import type { ReactRenderer } from "@storybook/nextjs";
import { ThemeProvider, type ThemeProviderProps, useTheme } from "next-themes";
import { type PropsWithChildren, useEffect } from "react";
import type { DecoratorFunction } from "storybook/internal/types";

type ThemeSwitcherProps = PropsWithChildren<{
  theme: string;
}>;

const ThemeSwitcher = ({ theme, children }: ThemeSwitcherProps) => {
  const { setTheme, resolvedTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    if (
      (theme === "" && currentTheme === "system") ||
      theme === currentTheme ||
      theme === resolvedTheme
    ) {
      return;
    }

    setTheme(theme);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <div className="bg-background">{children}</div>;
};

type NextThemesDecorator = Omit<ThemeProviderProps, "defaultTheme" | "themes"> & {
  themes: Record<string, string>;
  defaultTheme: string;
};

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

function hasThemeOverride(value: unknown): value is {
  themes?: { themeOverride?: string };
} {
  return typeof value === "object" && value !== null;
}

export const withNextThemes = ({ themes, defaultTheme, ...props }: NextThemesDecorator) => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  const decorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const params = hasThemeOverride(context.parameters) ? context.parameters : {};

    const { themeOverride } = params.themes ?? {};
    const selected = themeOverride ?? selectedTheme;

    return (
      <ThemeProvider {...props}>
        <ThemeSwitcher theme={selected}>
          <Story />
        </ThemeSwitcher>
      </ThemeProvider>
    );
  };

  return decorator;
};
