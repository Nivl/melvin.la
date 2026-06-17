import type { NextConfig } from "next";

import { defaultLocale, LOCALE_COOKIE, locales } from "./locales";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

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

// Locale routing at the routing layer instead of a middleware: these rules
// compile into Vercel's edge routing config, so the prefixed locale pages
// (every locale is prefixed under localePrefix "always") keep being served
// from the CDN cache without invoking a function. Bare, unprefixed URLs have
// no page of their own; they redirect to a prefixed route — by the explicit
// cookie choice, else the detected browser language, else the default locale.
export const localeRedirects = (): Redirect[] => [
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
  // visitors fall through to the default locale below.
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

  // No signal: serve the default locale's prefixed route. Unconditional, so it
  // must stay last — the detection rules above would otherwise be shadowed.
  // Temporary (not permanent) so a browser that later sets a cookie isn't
  // pinned to a cached redirect; the canonical/hreflang tags handle SEO.
  { destination: `/${defaultLocale}`, permanent: false, source: "/" },
  { destination: `/${defaultLocale}/:path`, permanent: false, source: unprefixedSource },
];
