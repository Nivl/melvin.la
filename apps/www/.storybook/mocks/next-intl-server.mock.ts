// Storybook stub for `next-intl/server`. The real module's render-time
// APIs (e.g. setRequestLocale) throw outside an RSC context; Storybook
// has no request, and preview.tsx already pins locale via
// NextIntlClientProvider, so a no-op is correct here.

export const setRequestLocale = (_locale: string): void => {
  // no-op: see header
};
