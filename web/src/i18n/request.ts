/* eslint-disable import/no-default-export */

import * as Sentry from "@sentry/nextjs";
import { getRequestConfig } from "next-intl/server";

import defaultLocalMessages from "#messages/en.json";
import esMessages from "#messages/es.json";
import frMessages from "#messages/fr.json";
import jaMessages from "#messages/ja.json";
import koMessages from "#messages/ko.json";
import zhMessages from "#messages/zh.json";
import zhTwMessages from "#messages/zh-tw.json";

import { isLocale, type Locales } from "./locales";
import { routing } from "./routing";

export type MessagesType = { [key: string]: string | MessagesType };

const allMessages: Record<Locales, MessagesType> = {
  en: defaultLocalMessages,
  es: esMessages,
  fr: frMessages,
  ja: jaMessages,
  ko: koMessages,
  zh: zhMessages,
  "zh-tw": zhTwMessages,
};

export const buildGetMessageFallback = (locale: string) => {
  return ({ namespace, key }: { key: string; namespace?: string }) => {
    const path = [namespace, key].filter((part) => part != undefined).join(".");
    Sentry.logger.error(Sentry.logger.fmt`Missing translation for ${path} in ${locale}`);

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
        Sentry.logger.error(Sentry.logger.fmt`Missing or invalid path in default local: ${path}`, {
          path,
          valueAtPath: k,
        });
        return paths.at(-1) ?? "???";
      }
    }

    if (typeof k === "string") {
      return k;
    } else {
      // weird case where the key has children instead of being a string
      Sentry.logger.error(Sentry.logger.fmt`Missing or invalid path in default local: ${path}`, {
        path,
        valueAtPath: k,
      });
      return paths.at(-1) ?? "???";
    }
  };
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const activeLocale: Locales = isLocale(locale) ? locale : routing.defaultLocale;
  const messages = allMessages[activeLocale];

  return {
    locale: activeLocale,
    messages,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onError: () => {},
    getMessageFallback: buildGetMessageFallback(locale),
  };
});
