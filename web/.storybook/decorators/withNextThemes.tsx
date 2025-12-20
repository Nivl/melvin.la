// .storybook/decorators/with-next-themes.tsx

import { DecoratorHelpers } from '@storybook/addon-themes';
import type { ReactRenderer } from '@storybook/nextjs';
import { ThemeProvider, type ThemeProviderProps, useTheme } from 'next-themes';
import { type PropsWithChildren, useEffect } from 'react';
import type { DecoratorFunction } from 'storybook/internal/types';

type ThemeSwitcherProps = PropsWithChildren<{
  theme: string;
}>;

const ThemeSwitcher = ({ theme, children }: ThemeSwitcherProps) => {
  const { setTheme, resolvedTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    if (
      (theme === '' && currentTheme === 'system') ||
      theme === currentTheme ||
      theme === resolvedTheme
    ) {
      return;
    }

    // console.log(`Switched theme to: ${theme}`, {
    //   newTheme: theme,
    //   previousTheme: currentTheme,
    //   resolvedTheme,
    // });
    setTheme(theme);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <div className="bg-background">{children}</div>;
};

type NextThemesDecorator = Omit<
  ThemeProviderProps,
  'defaultTheme' | 'themes'
> & {
  themes: Record<string, string>;
  defaultTheme: string;
};

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

export const withNextThemes = ({
  themes,
  defaultTheme,
  ...props
}: NextThemesDecorator) => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  const decorator: DecoratorFunction<ReactRenderer> = (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const params = context.parameters as {
      themes?: { themeOverride?: string };
    };

    const { themeOverride } = params.themes ?? {};
    const selected = themeOverride ?? selectedTheme ?? defaultTheme;

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
