import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  // Used when no locale matches
  defaultLocale,

  // There is no next-intl middleware anymore: locale detection and
  // default-locale serving are handled by the redirects/rewrites defined in
  // routing-rules.ts, so they run in Vercel's routing layer instead of a
  // function. This config only drives the navigation APIs below.
  localeDetection: false,

  // Makes the default locale have no prefix.
  // so 'en' is served at '/' instead of '/en'
  localePrefix: "as-needed",

  // A list of all locales that are supported
  locales,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
