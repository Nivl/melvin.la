import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

type ValueObject = Record<string, string>;
export type ResolvedAppearance = "light" | "dark";
export type Appearance = ResolvedAppearance | "system";

type DataAttribute = `data-${string}`;

type ScriptProps = Record<DataAttribute, unknown>;

export type UseThemeProps = {
  /** List of all available theme names */
  themes: string[];
  /** Forced appearance for the current page */
  forcedAppearance?: Appearance | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the appearance */
  setAppearance: Dispatch<SetStateAction<Appearance>>;
  /** Update the theme */
  setTheme: Dispatch<SetStateAction<string>>;
  /** Active appearance value (`light`, `dark`, or `system`) */
  appearance?: Appearance | undefined;
  /** Resolved appearance after resolving `system` to `light` or `dark` */
  resolvedAppearance?: ResolvedAppearance | undefined;
  /** Current OS appearance preference regardless of selected appearance */
  systemAppearance?: ResolvedAppearance | undefined;
  /** Active named theme family */
  theme?: string | undefined;
};

export type Attribute = DataAttribute | "class";

export type ThemeProviderProps = {
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Forced appearance for the current page */
  forcedAppearance?: Appearance | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Default appearance (`light`, `dark`, or `system`) */
  defaultAppearance?: Appearance | undefined;
  /** Default theme name */
  defaultTheme?: string | undefined;
  /** Key used to store the appearance in localStorage */
  appearanceStorageKey?: string | undefined;
  /** Key used to store the theme in localStorage */
  themeStorageKey?: string | undefined;
  /** HTML attribute(s) modified based on the active appearance */
  appearanceAttribute?: Attribute | Attribute[] | undefined;
  /** HTML attribute(s) modified based on the active theme */
  themeAttribute?: Attribute | Attribute[] | undefined;
  /** Mapping of appearance name to HTML attribute value */
  appearanceValue?: ValueObject | undefined;
  /** Mapping of theme name to HTML attribute value */
  themeValue?: ValueObject | undefined;
  /** Whether to switch between dark and light based on prefers-color-scheme */
  enableSystem?: boolean | undefined;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean | undefined;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean | undefined;
  /** Nonce string to pass to the inline script and style elements for CSP headers */
  nonce?: string;
  /** Props to pass the inline script */
  scriptProps?: ScriptProps;
} & PropsWithChildren;
