export const locales = ['en', 'fr', 'es', 'ko', 'zh'] as const;
export type Locales = (typeof locales)[number];
