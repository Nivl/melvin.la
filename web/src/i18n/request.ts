/* eslint-disable import/no-default-export */

import { getRequestConfig } from 'next-intl/server';

import { type Locales, routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)) as {
    default: Record<string, string>;
  };

  return {
    locale,
    messages: messages.default,
  };
});
