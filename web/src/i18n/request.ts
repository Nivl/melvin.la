/* eslint-disable import/no-default-export */

import { getRequestConfig } from 'next-intl/server';

import defaultLocalMessages from '../../messages/en.json';
import { type Locales, routing } from './routing';

type MessagesType = { [key: string]: string | MessagesType };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)) as {
    default: MessagesType;
  };

  return {
    locale,
    messages: messages.default,
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(part => part != undefined).join('.');
      console.log(`Missing translation for ${path} in ${locale}`);

      // We'll try to get that path from the default messages
      // It shouldn't fail unless we fucked up badly, since we have
      // type checking in place.
      const paths = path.split('.');
      let k: string | MessagesType = defaultLocalMessages as MessagesType;
      for (const p of paths) {
        if (typeof k === 'object' && p in k) {
          k = k[p];
        } else {
          // weird case where a parent key is a string instead of an object
          console.log(`Not found in default local: ${path}`);
          return paths.at(-1) ?? '???';
        }
      }

      if (typeof k === 'string') {
        return k;
      } else {
        // weird case where the key has children instead of being a string
        console.log(`Not found in default local: ${path}`);
        return paths.at(-1) ?? '???';
      }
    },
  };
});
