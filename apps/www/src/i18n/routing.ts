import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { locales } from "./locales.ts";

export const routing = defineRouting({
  // Used when no locale matches
  defaultLocale: "en",

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
