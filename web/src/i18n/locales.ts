export const locales = ["en", "fr", "es", "ko", "zh", "zh-tw", "ja"] as const;
export type Locales = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locales {
  return value !== undefined && locales.some((locale) => locale === value);
}
