export const locales = ['en', 'fr', 'es', 'ko', 'zh', 'zh-tw', 'ja'] as const;
export type Locales = (typeof locales)[number];
