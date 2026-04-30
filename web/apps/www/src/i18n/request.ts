/* eslint-disable import/no-default-export */

import { logger } from "@sentry/nextjs";
import { getRequestConfig } from "next-intl/server";

import defaultLocalMessages from "#messages/en.json";

import type { Locales } from "./locales";
import { isLocale } from "./locales";
import { routing } from "./routing";

export type MessagesType = { [key: string]: string | MessagesType };

const loadMessages = async (locale: Locales): Promise<MessagesType> => {
  if (locale === "en") {
    return defaultLocalMessages;
  }
  const mod: unknown = await import(`../../messages/${locale}.json`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return (mod as { default: MessagesType }).default;
};

export const buildGetMessageFallback =
  (locale: string) =>
  ({ namespace, key }: { key: string; namespace?: string }) => {
    const path = [namespace, key].filter((part) => part !== undefined).join(".");
    logger.error(logger.fmt`Missing translation for ${path} in ${locale}`);

    // We'll try to get that path from the default messages
    // It shouldn't fail unless we fucked up badly, since we have
    // type checking in place.
    const paths = path.split(".");
    let k: string | MessagesType = defaultLocalMessages;
    for (const p of paths) {
      if (typeof k === "object" && p in k) {
        k = k[p];
      } else {
        // weird case where a parent key is a string instead of an object
        logger.error(logger.fmt`Missing or invalid path in default local: ${path}`, {
          path,
          valueAtPath: k,
        });
        return paths.at(-1) ?? "???";
      }
    }

    if (typeof k === "string") {
      return k;
    }
    // weird case where the key has children instead of being a string
    logger.error(logger.fmt`Missing or invalid path in default local: ${path}`, {
      path,
      valueAtPath: k,
    });
    return paths.at(-1) ?? "???";
  };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const activeLocale: Locales = isLocale(locale) ? locale : routing.defaultLocale;
  const messages = await loadMessages(activeLocale);

  return {
    getMessageFallback: buildGetMessageFallback(activeLocale),
    locale: activeLocale,
    messages,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onError: () => {},
  };
});
