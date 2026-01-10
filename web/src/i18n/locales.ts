export const locales = ['en', 'fr', 'es'] as const;
export type Locales = (typeof locales)[number];
