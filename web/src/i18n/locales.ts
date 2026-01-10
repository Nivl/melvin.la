export const locales = ['en', 'fr', 'es', 'ko'] as const;
export type Locales = (typeof locales)[number];
