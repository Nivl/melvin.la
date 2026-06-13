export const locales = ["en", "fr", "es", "ko", "zh", "zh-tw", "ja"] as const;
export type Locales = (typeof locales)[number];

// Served without a URL prefix ('/' instead of '/en').
export const defaultLocale: Locales = "en";

// Contract between the language switcher (which writes the cookie) and the
// locale-detection routing rules (which read it).
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: string | undefined): value is Locales =>
  value !== undefined && locales.some((locale) => locale === value);
