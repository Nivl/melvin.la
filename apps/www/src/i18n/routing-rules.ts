import type { NextConfig } from "next";

import { defaultLocale, LOCALE_COOKIE, locales } from "./locales";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];
type Rewrite = Extract<
  Awaited<ReturnType<NonNullable<NextConfig["rewrites"]>>>,
  readonly unknown[]
>[number];

// Longest first so 'zh-tw' is evaluated before 'zh', both in the alternation
// and in the Accept-Language rule order (first matching redirect wins).
const byLengthDesc = (left: string, right: string) => right.length - left.length;

const orderedLocales = [...locales].toSorted(byLengthDesc);
const orderedNonDefaultLocales = orderedLocales.filter((locale) => locale !== defaultLocale);

// Any path that is not already locale-prefixed and is not an API, internal, or
// static-file request. Based on the matcher the next-intl middleware used.
const unprefixedSource = `/:path((?!(?:${orderedLocales.join("|")})(?:/|$))(?!api(?:/|$))(?!_next(?:/|$))(?!_vercel(?:/|$))(?!.*\\.).*)`;

// Matches Accept-Language headers whose first entry (the user's primary
// language) resolves to the given locale. The code must be followed by a
// subtag ('-'), a list separator (','), a q-value (';'), or the end of the
// header so longer codes don't collide (Konkani 'kok' is not 'ko'). BCP 47
// tags are case-insensitive but `has` values match case-sensitively, so the
// Chinese patterns use character classes: a lowercase 'zh-tw' falling
// through to the generic 'zh' rule would serve Simplified to a Traditional
// reader. Other locale codes are already canonically lowercase, and a
// non-canonical casing there just skips detection.
const acceptLanguagePattern = (locale: string): string => {
  if (locale === "zh-tw") {
    return "[zZ][hH]-(?:[tT][wW]|[hH][aA][nN][tT]|[hH][kK]|[mM][oO])(?:[-,;].*)?";
  }
  if (locale === "zh") {
    return "[zZ][hH](?:[-,;].*)?";
  }
  return `${locale}(?:[-,;].*)?`;
};

// Locale detection at the routing layer: these rules compile into Vercel's
// edge routing config, so static pages keep being served from the CDN cache
// without invoking any middleware function.
export const localeRedirects = (): Redirect[] => [
  // Canonical default-locale URLs have no prefix. Routing rules cannot set
  // cookies while stripping the prefix, so a non-English visitor following
  // an explicit /en/... link lands on the unprefixed URL and may then be
  // forwarded by the detection rules below. Accepted trade-off: the
  // canonical/hreflang URLs for 'en' are unprefixed (such links shouldn't
  // circulate), and the language switcher's cookie is the way to pin English.
  { destination: "/", permanent: false, source: `/${defaultLocale}` },
  { destination: "/:path*", permanent: false, source: `/${defaultLocale}/:path*` },

  // An explicit choice made in the language switcher (cookie) always wins.
  ...orderedNonDefaultLocales.flatMap((locale): Redirect[] => [
    {
      destination: `/${locale}`,
      has: [{ key: LOCALE_COOKIE, type: "cookie", value: locale }],
      permanent: false,
      source: "/",
    },
    {
      destination: `/${locale}/:path`,
      has: [{ key: LOCALE_COOKIE, type: "cookie", value: locale }],
      permanent: false,
      source: unprefixedSource,
    },
  ]),

  // Otherwise detect from the browser's primary language. Any cookie —
  // including 'en' — disables detection, since it records an explicit choice.
  // That also covers values outside the locale set (stale or foreign
  // cookies): per-rule `missing` can't express "not in the set", so such
  // visitors stay on the default locale until the switcher resets the cookie.
  ...orderedNonDefaultLocales.flatMap((locale): Redirect[] => [
    {
      destination: `/${locale}`,
      has: [{ key: "accept-language", type: "header", value: acceptLanguagePattern(locale) }],
      missing: [{ key: LOCALE_COOKIE, type: "cookie" }],
      permanent: false,
      source: "/",
    },
    {
      destination: `/${locale}/:path`,
      has: [{ key: "accept-language", type: "header", value: acceptLanguagePattern(locale) }],
      missing: [{ key: LOCALE_COOKIE, type: "cookie" }],
      permanent: false,
      source: unprefixedSource,
    },
  ]),
];

// Serve the default locale for whatever is left unprefixed after the
// detection redirects above ran.
export const localeRewrites = (): Rewrite[] => [
  { destination: `/${defaultLocale}`, source: "/" },
  { destination: `/${defaultLocale}/:path`, source: unprefixedSource },
];
