import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  // Used when no locale matches
  defaultLocale,

  // There is no next-intl middleware. Locale detection and bare-URL routing
  // are handled by the redirects defined in routing-rules.ts, which run in
  // Vercel's routing layer instead of a function. This flag only matters to
  // the (absent) middleware, so it has no effect; detection lives in the
  // redirects. This config otherwise just drives the navigation APIs below.
  localeDetection: false,

  // Every locale is prefixed, including the default: 'en' is served at '/en',
  // never at '/'. Prefixed routes are real (no rewrite), so client navigation
  // and RSC prefetch work like any other route. Bare URLs redirect (see
  // routing-rules.ts) — they are never rewritten.
  localePrefix: "always",

  // A list of all locales that are supported
  locales,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
