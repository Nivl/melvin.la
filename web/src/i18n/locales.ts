export const locales = ['en', 'fr'] as const;
export type Locales = (typeof locales)[number];
