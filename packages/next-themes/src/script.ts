import type { Appearance, Attribute, ResolvedAppearance } from "./types";

export const script = (
  appearanceAttribute: Attribute | Attribute[],
  themeAttribute: Attribute | Attribute[],
  appearanceStorageKey: string,
  themeStorageKey: string,
  defaultAppearance: Appearance,
  defaultTheme: string | undefined,
  forcedAppearance: Appearance | undefined,
  forcedTheme: string | undefined,
  themes: string[],
  appearanceValue: Record<string, string> | undefined,
  themeValue: Record<string, string> | undefined,
  enableSystem: boolean,
  enableColorScheme: boolean,
) => {
  const el = document.documentElement;

  function getSystemAppearance(): ResolvedAppearance {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyAttribute(
    attr: Attribute | Attribute[],
    values: string[],
    active: string | null | undefined,
    mapping?: Record<string, string>,
  ) {
    const attributes = Array.isArray(attr) ? attr : [attr];

    attributes.forEach((current) => {
      const isClass = current === "class";
      const domValues = isClass
        ? values.map((value) => (mapping && mapping[value]) || value)
        : values;
      // When a mapping exists but the active key is absent, treat as no active value (parity with runtime)
      const mappedActive = active ? (mapping ? mapping[active] || null : active) : null;

      if (isClass) {
        el.classList.remove(...domValues);
        if (mappedActive) el.classList.add(mappedActive);
      } else if (mappedActive) {
        el.setAttribute(current, mappedActive);
      } else {
        el.removeAttribute(current);
      }
    });
  }

  try {
    const storedAppearance = localStorage.getItem(appearanceStorageKey);
    const storedTheme = localStorage.getItem(themeStorageKey);

    // Migration shim: old versions stored appearance ('light'|'dark'|'system') in the theme key.
    // If the appearance key is absent but the theme key holds a legacy appearance value,
    // treat it as the appearance axis and fall back to defaultTheme for theme-family.
    const legacyAppearanceValues = ["light", "dark", "system"];
    const isLegacyMigration =
      !storedAppearance && storedTheme !== null && legacyAppearanceValues.includes(storedTheme);

    const appearance = (forcedAppearance ||
      (isLegacyMigration ? storedTheme : storedAppearance) ||
      defaultAppearance) as Appearance;
    const theme = forcedTheme || (isLegacyMigration ? null : storedTheme) || defaultTheme;

    const resolvedAppearance: ResolvedAppearance =
      appearance === "system" ? (enableSystem ? getSystemAppearance() : "light") : appearance;

    applyAttribute(appearanceAttribute, ["light", "dark"], resolvedAppearance, appearanceValue);
    applyAttribute(themeAttribute, themes, theme, themeValue);

    if (enableColorScheme && (resolvedAppearance === "light" || resolvedAppearance === "dark")) {
      el.style.colorScheme = resolvedAppearance;
    }
  } catch (e) {
    //
  }
};
