export const locales = ['en', 'fr', 'es', 'ko', 'zh', 'zh-tw'] as const;
export type Locales = (typeof locales)[number];
