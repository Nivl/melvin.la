# Performance Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut melvin.la's TTFB from ~5s to <1s and FCP/LCP from ~7s to <3s on first visit, by removing Sentry cold-start overhead, stripping moment-timezone from the shared client bundle, deferring Google Maps/heavy HeroUI widgets, and trimming the font + i18n payload on every request.

**Architecture:** Two independent swim lanes. Tier 1 (tasks 2–7) targets the server path: Sentry config, i18n middleware behavior, and the shared client provider that currently drags `moment-timezone` into every page. Tier 2 (tasks 8–11) targets the critical render path: defer Google Maps, split fonts per locale, and lazy-load heavy HeroUI widgets (Drawer, Modal) that currently ship with the initial bundle. Tier 3 is optional polish.

**Tech Stack:** Next.js 16 (App Router, turbopack), React 19, TypeScript, Tailwind 4, HeroUI v3 beta, next-intl, @sentry/nextjs, tRPC, Vitest + Playwright.

**Ordering rule:** Do tasks in order. Commit per task. After Tier 1 completes, re-measure — the remaining priorities may shift.

---

## Pre-flight Setup

### Task 1: Create working branch + capture baseline

**Files:** none modified; measurement artifacts only.

- [ ] **Step 1: Capture baseline Lighthouse metrics for the production URL**

Open Chrome DevTools → Lighthouse → Mobile → Performance → analyze `https://melvin.la/`.
Record the following into a scratch file `web/perf-baseline.md` (gitignored):

```
Date: 2026-04-22
URL: https://melvin.la/
Device: Mobile simulated
Cold TTFB: X ms
FCP: X ms
LCP: X ms
TBT: X ms
Total JS transferred: X KB
Total transferred: X KB
```

- [ ] **Step 2: Also capture baseline for `/blog` and `/tools/timezones`**

Same procedure. Append to `perf-baseline.md`.

- [ ] **Step 3: Install the bundle analyzer as a devDependency**

From `web/`:

```bash
pnpm add -D @next/bundle-analyzer
```

- [ ] **Step 4: Wire up bundle analyzer in `web/next.config.ts`**

Modify `web/next.config.ts` — add the import and wrap the final export:

```ts
/* eslint-disable import/no-default-export */

import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// ... (unchanged middle of file) ...

export default bundleAnalyzer(withSentryConfig(withNextIntl(nextConfig), sentryOption));
```

- [ ] **Step 5: Run the analyzer to capture baseline**

```bash
cd web && ANALYZE=true pnpm run build
```

Screenshots of `.next/analyze/client.html` + `.next/analyze/nodejs.html` → save to `web/perf-baseline.md` (or note key chunk sizes).

- [ ] **Step 6: Verify build succeeds and commit**

```bash
pnpm run validate-code
git add web/next.config.ts web/package.json web/pnpm-lock.yaml
git commit -m "chore(web): add @next/bundle-analyzer for perf measurement"
```

---

## Tier 1 — TTFB / Server Path

### Task 2: Remove `includeLocalVariables: true` from Sentry server config

**Why:** That flag attaches the Node `inspector` to the runtime and records local variable frames on every exception. Documented by Sentry as a perf hazard in production. Biggest single TTFB win.

**Files:**
- Modify: `web/sentry.server.config.ts`

- [ ] **Step 1: Delete the `includeLocalVariables` line**

Replace the file body with:

```ts
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { defaultConfig } from "./sentry.default.config";

Sentry.init({
  ...defaultConfig,
});
```

- [ ] **Step 2: Verify server build still works**

```bash
cd web && pnpm run validate-code
```

Expected: PASS (types + lint).

- [ ] **Step 3: Run unit tests**

```bash
cd web && pnpm run test:unit
```

Expected: all pass (this change doesn't touch tested code paths).

- [ ] **Step 4: Smoke-test server start**

```bash
cd web && pnpm run build && pnpm run start
```

Expected: server boots on port 3000, home page renders.

- [ ] **Step 5: Commit**

```bash
git add web/sentry.server.config.ts
git commit -m "perf(sentry): drop includeLocalVariables to reduce server cold-start overhead"
```

---

### Task 3: Remove Sentry `tunnelRoute`

**Why:** Proxying every Sentry beacon (errors, breadcrumbs, traces, replays) through the Vercel function costs CPU, inflates function-invocation minutes, and blocks other requests on cold-start workers. Ad-blocker circumvention isn't needed on a portfolio site.

**Files:**
- Modify: `web/next.config.ts` (delete `tunnelRoute`)
- Modify: `web/src/proxy.ts` (drop `monitoring` from matcher)

- [ ] **Step 1: Delete `tunnelRoute` from `web/next.config.ts`**

In `sentryOption`, delete these lines:

```ts
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",
```

- [ ] **Step 2: Update the proxy matcher in `web/src/proxy.ts`**

Replace the file content with:

```ts
/* eslint-disable import/no-default-export */
import createMiddleware from "next-intl/middleware";

import { routing } from "#i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
```

- [ ] **Step 3: Verify validate-code passes**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 4: Run unit tests**

```bash
cd web && pnpm run test:unit
```

- [ ] **Step 5: Run e2e smoke test against one page**

```bash
cd web && pnpm exec playwright test e2e/home.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add web/next.config.ts web/src/proxy.ts
git commit -m "perf(sentry): remove tunnelRoute to cut function load"
```

---

### Task 4: Lower Sentry `tracesSampleRate` in production

**Why:** 10% tracing adds per-request overhead that compounds with cold starts. 1% is plenty for a portfolio site.

**Files:**
- Modify: `web/sentry.default.config.ts`

- [ ] **Step 1: Drop the production sample rate**

In `web/sentry.default.config.ts`, change:

```ts
  // Sample 100% of traces in dev, 10% in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
```

to:

```ts
  // Sample 100% of traces in dev, 1% in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.01 : 1,
```

- [ ] **Step 2: Verify validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 3: Commit**

```bash
git add web/sentry.default.config.ts
git commit -m "perf(sentry): reduce production tracesSampleRate from 10% to 1%"
```

---

### Task 5: Remove `moment-timezone` from the shared `Providers`

**Why:** `web/src/shared/components/Providers.tsx:4` imports `moment-timezone` at the top of a `"use client"` component that wraps every page. That pulls ~70 KB code + ~250 KB tz data into the shared client chunk AND into the server render of every route, even pages that never use moment (home, blog, all tools except Timezones). Only `Timezones.tsx` actually uses moment.

**Approach:** Move `moment.locale()` from the global Provider to inside the Timezones feature, so moment is only loaded on that route.

**Files:**
- Modify: `web/src/shared/components/Providers.tsx` (remove import + locale call)
- Modify: `web/src/features/timezones/components/Timezones.tsx` (add locale setup)

- [ ] **Step 1: Strip `moment-timezone` out of `Providers.tsx`**

Replace the file content with:

```tsx
"use client";

import { I18nProvider, Toast } from "@heroui/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { buildGetMessageFallback, MessagesType } from "#i18n/request";
import { TRPCReactProvider } from "#trpc/client";

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: MessagesType;
}) => {
  return (
    <TRPCReactProvider>
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        getMessageFallback={buildGetMessageFallback(locale)}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onError={() => {}}
      >
        <I18nProvider locale={locale}>
          <NextThemesProvider attribute="class">
            <Toast.Provider placement="bottom end" />
            {children}
          </NextThemesProvider>
        </I18nProvider>
      </NextIntlClientProvider>
    </TRPCReactProvider>
  );
};
```

- [ ] **Step 2: Move the locale setup into `Timezones.tsx`**

At the top of `web/src/features/timezones/components/Timezones.tsx`, add a `useLocale` hook + a `useEffect` that sets `moment.locale`. Replace lines 1–9 of the current file:

```tsx
"use client";

import { Calendar, DateField, DatePicker, Label, TimeField } from "@heroui/react";
import { DateValue, getLocalTimeZone, now } from "@internationalized/date";
import moment from "moment-timezone";
import { AnimatePresence } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Color, colors, LargePill } from "#shared/components/layout/LargePill.tsx";
import { Section } from "#shared/components/layout/Section";

import { CityAutoComplete } from "./CityAutoComplete.tsx";
import { City, CityData, CityDataWithExtras, sortedCities } from "./data.tsx";
```

Then, immediately after `export const Timezones = () => {` (currently line 21), add:

```tsx
  const locale = useLocale();

  useEffect(() => {
    const momentLocale = locale === "zh" ? "zh-cn" : locale;
    moment.locale(momentLocale);
  }, [locale]);
```

- [ ] **Step 3: Check for any other module that relied on the global moment locale**

```bash
cd web && grep -rn "moment()" src --include="*.ts" --include="*.tsx"
cd web && grep -rn "moment\." src --include="*.ts" --include="*.tsx"
```

Expected: the only files printing moment use are under `src/features/timezones/` (Timezones.tsx and `data.tsx`). If anything shows up elsewhere, stop and investigate before continuing — that user also needs the locale set.

- [ ] **Step 4: Verify validate-code**

```bash
cd web && pnpm run validate-code
```

Fix any unused-import warnings (there shouldn't be any if Step 1 was done correctly).

- [ ] **Step 5: Run unit tests**

```bash
cd web && pnpm run test:unit
```

Expected: PASS. The `Providers.test` (if present) shouldn't be affected; Timezones itself has no unit test today.

- [ ] **Step 6: Run the timezones e2e test**

```bash
cd web && pnpm exec playwright test e2e/timezones.spec.ts
```

Expected: PASS. If it fails because dates render in the wrong locale format, the `useEffect` in Step 2 didn't run before a read — convert it to a synchronous call by calling `moment.locale(...)` at the top of the component body (outside any effect) instead, gated on a ref to avoid repeated writes:

```tsx
const locale = useLocale();
const momentLocale = locale === "zh" ? "zh-cn" : locale;
if (moment.locale() !== momentLocale) {
  moment.locale(momentLocale);
}
```

Re-run the e2e test. If green, keep this version.

- [ ] **Step 7: Run the home + blog e2e tests to confirm no regression**

```bash
cd web && pnpm exec playwright test e2e/home.spec.ts e2e/blog.spec.ts
```

- [ ] **Step 8: Verify bundle impact**

```bash
cd web && ANALYZE=true pnpm run build
```

Open `.next/analyze/client.html` — confirm `moment-timezone` now appears only in the Timezones route chunk, not in the shared/framework chunks.

- [ ] **Step 9: Commit**

```bash
git add web/src/shared/components/Providers.tsx web/src/features/timezones/components/Timezones.tsx
git commit -m "perf(web): scope moment-timezone to the timezones feature

Remove moment-timezone from the shared Providers component so it no longer
ships in the global client chunk. Set the moment locale inside Timezones
itself, which is the only consumer."
```

---

### Task 6: Disable `localeDetection` in next-intl routing

**Why:** Accept-Language parsing + redirect in the middleware on every non-static request. Users who want a different locale can switch via the UI; auto-detection is rarely worth the TTFB cost.

**Files:**
- Modify: `web/src/i18n/routing.ts`

- [ ] **Step 1: Flip `localeDetection` to false**

Replace the routing config with:

```ts
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { locales } from "./locales.ts";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",

  // Makes the default locale have no prefix.
  // so 'en' is served at '/' instead of '/en'
  localePrefix: "as-needed",

  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

- [ ] **Step 2: Verify validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 3: Run full e2e suite** (locale-related regressions could surface anywhere)

```bash
cd web && pnpm run test:e2e
```

Expected: PASS. If the blog tests rely on auto-detected locale, they may need an explicit `page.goto('/fr/blog')` instead of `page.goto('/blog')` — fix by being explicit in the test.

- [ ] **Step 4: Commit**

```bash
git add web/src/i18n/routing.ts
git commit -m "perf(i18n): disable Accept-Language detection to drop middleware overhead"
```

---

### Task 7: Dynamically load locale messages

**Why:** `web/src/i18n/request.ts` imports all 7 message JSON files at module scope. Every server render loads all 7 into memory even though only one is used per request. Dynamic import lets Next.js code-split them.

**Files:**
- Modify: `web/src/i18n/request.ts`

- [ ] **Step 1: Replace the top-level imports with lazy loading**

Replace the file content with:

```ts
/* eslint-disable import/no-default-export */

import * as Sentry from "@sentry/nextjs";
import { getRequestConfig } from "next-intl/server";

import defaultLocalMessages from "../../messages/en.json";
import { isLocale, type Locales } from "./locales";
import { routing } from "./routing";

export type MessagesType = { [key: string]: string | MessagesType };

const loadMessages = async (locale: Locales): Promise<MessagesType> => {
  if (locale === "en") return defaultLocalMessages;
  const mod = (await import(`../../messages/${locale}.json`)) as { default: MessagesType };
  return mod.default;
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
  const messages = await loadMessages(activeLocale);

  return {
    locale: activeLocale,
    messages,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onError: () => {},
    getMessageFallback: buildGetMessageFallback(locale),
  };
});
```

- [ ] **Step 2: Verify validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 3: Run unit tests**

```bash
cd web && pnpm run test:unit
```

- [ ] **Step 4: Run e2e across every locale that has a test**

```bash
cd web && pnpm run test:e2e
```

- [ ] **Step 5: Commit**

```bash
git add web/src/i18n/request.ts
git commit -m "perf(i18n): dynamically import locale messages per request"
```

---

### Post-Tier-1 checkpoint

- [ ] **Re-measure production (deploy a preview) and capture metrics into `web/perf-baseline.md` under a "Post Tier 1" header.**

Stop here and compare against baseline. Expect TTFB to drop noticeably (realistic target: 1–2s warm, 2–3s cold). If Tier 1 alone gets you under 2s TTFB + <4s LCP, Tier 2 becomes optional polish — re-prioritize.

---

## Tier 2 — FCP / LCP / Bundle

### Task 8: Defer Google Maps on the home page

**Why:** `web/src/features/home/components/Contact.tsx:94` mounts `<Map>` which pulls `@vis.gl/react-google-maps` and triggers a ~500 KB Google Maps JS download + external API call. The Map is at the very bottom of the home page (below the Contact section, below Footer). It should not block paint.

**Approach:** Wrap the Map import with `next/dynamic({ ssr: false })`, and trigger it only after the user scrolls close to the Contact section with an `IntersectionObserver`. Fall back to a styled placeholder div so layout doesn't shift.

**Files:**
- Modify: `web/src/features/home/components/Contact.tsx` (swap eager import for dynamic + intersection trigger)
- Test: `web/src/features/home/components/Contact.test.tsx` (new)

- [ ] **Step 1: Write the failing test**

Create `web/src/features/home/components/Contact.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { testWrapper } from "#shared/utils/tests";

import { Contact } from "./Contact";

// Mock the Map module so the test doesn't try to load Google Maps.
vi.mock("./Map", () => ({
  Map: () => <div data-testid="map-loaded" />,
}));

describe("Contact", () => {
  it("renders a placeholder when the map is not yet in view", () => {
    render(<Contact />, { wrapper: testWrapper });
    expect(screen.getByTestId("map-placeholder")).toBeInTheDocument();
    expect(screen.queryByTestId("map-loaded")).not.toBeInTheDocument();
  });

  it("still exposes the Email / LinkedIn / GitHub contact links", () => {
    render(<Contact />, { wrapper: testWrapper });
    expect(screen.getByText("jobs@melvin.la")).toBeInTheDocument();
    expect(screen.getByText("in/melvinlaplanche")).toBeInTheDocument();
    expect(screen.getByText("@Nivl")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to see it fail**

```bash
cd web && pnpm run test:unit -- Contact.test
```

Expected: FAIL — `map-placeholder` doesn't exist yet.

- [ ] **Step 3: Refactor `Contact.tsx` to defer the Map**

Replace the top imports (lines 1–13) of `web/src/features/home/components/Contact.tsx`:

```tsx
"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { Mail } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LuGithub as Github, LuLinkedin as Linkedin } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import { Heading } from "#shared/components/layout/Heading";
import { usePrefersReducedMotion } from "#shared/hooks/usePrefersReducedMotion.ts";

const Map = dynamic(
  async () => {
    const mod = await import("./Map");
    return mod.Map;
  },
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="map-placeholder"
        className="h-200 w-full bg-surface-secondary"
        aria-hidden="true"
      />
    ),
  },
);
```

Then, inside the `Contact` component, replace the unconditional `<Map ... />` at the bottom (currently line 94) with an intersection-observer-gated render:

```tsx
  const mapSentinelRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const el = mapSentinelRef.current;
    if (!el || shouldLoadMap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [shouldLoadMap]);
```

And replace the closing JSX where `<Map />` was previously rendered:

```tsx
      </div>
      <div ref={mapSentinelRef}>
        {shouldLoadMap ? (
          <Map className="h-200 w-full" initialCenter={{ lat: 34.021_859_3, lng: -118.498_265 }} />
        ) : (
          <div
            data-testid="map-placeholder"
            className="h-200 w-full bg-surface-secondary"
            aria-hidden="true"
          />
        )}
      </div>
```

- [ ] **Step 4: Run the test, confirm it passes**

```bash
cd web && pnpm run test:unit -- Contact.test
```

Expected: PASS.

- [ ] **Step 5: Run validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 6: Smoke-test the home page e2e**

```bash
cd web && pnpm exec playwright test e2e/home.spec.ts
```

Expected: PASS. If a test explicitly asserts the map is present on initial load, update the test to scroll to the Contact section first (e.g. `await page.locator('[data-testid="map-placeholder"]').scrollIntoViewIfNeeded()` and then `expect(page.locator('.gm-style')).toBeVisible()`).

- [ ] **Step 7: Re-run bundle analyzer**

```bash
cd web && ANALYZE=true pnpm run build
```

Confirm that `@vis.gl/react-google-maps` now sits in a separate async chunk and no longer inflates the main `[locale]/page` chunk.

- [ ] **Step 8: Commit**

```bash
git add web/src/features/home/components/Contact.tsx web/src/features/home/components/Contact.test.tsx
git commit -m "perf(home): lazy-load Google Maps until the contact section scrolls into view"
```

---

### Task 9: Split fonts per locale + drop `preload` for secondary fonts

**Why:** `web/src/app/[locale]/layout.tsx:26-53` declares 8 font families, all with default `preload: true`. The root `<html>` attaches every variable class, so the CSS font stack references 5 Noto variants on every page. Result: 8 preload-link fetches in `<head>`, even on `/en/` where the CJK fonts will never be used.

**Approach:**
1. Keep the latin core (`Noto_Sans`, `Fira_Code`, `baikal`, `burbank`) with `preload: true`.
2. Mark all CJK Noto variants as `preload: false`.
3. Only attach the CJK font variable class (and its font-stack entry) when the current locale actually needs it.

**Files:**
- Modify: `web/src/app/[locale]/layout.tsx`

- [ ] **Step 1: Refactor the layout file**

Replace the font declarations + helper in `web/src/app/[locale]/layout.tsx`. Full replacement for lines 26–116:

```tsx
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-noto-sans-tc",
  display: "swap",
  preload: false,
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const baikal = localFont({
  src: "../../bundled_static/fonts/baikal_trial_ultra_condensed.woff2",
  variable: "--font-baikal",
  display: "swap",
});

const burbank = localFont({
  src: "../../bundled_static/fonts/burbank_big_condensed_bold.woff2",
  variable: "--font-burbank",
  display: "swap",
});

// Core fonts are used by every locale. CJK fonts attach only for their
// matching locale so the browser doesn't see unused @font-face rules.
const coreFonts = [notoSans, firaCode, baikal, burbank];

const localeFontMap = {
  ja: notoSansJP,
  ko: notoSansKR,
  zh: notoSansSC,
  "zh-tw": notoSansTC,
} as const;

const localePrimarySans = {
  ja: "var(--font-noto-sans-jp)",
  ko: "var(--font-noto-sans-kr)",
  zh: "var(--font-noto-sans-sc)",
  "zh-tw": "var(--font-noto-sans-tc)",
} as const;

const systemFonts =
  "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

function getFontsForLocale(locale: string) {
  const extra = localeFontMap[locale as keyof typeof localeFontMap];
  const fonts = extra ? [...coreFonts, extra] : coreFonts;

  const primarySans =
    localePrimarySans[locale as keyof typeof localePrimarySans] ?? "var(--font-noto-sans)";
  // Baikal (Condensed) and Burbank (Fortnite) are western-only fonts.
  // For CJK locales, fall back to the locale's primary font so glyphs render.
  const condensed = extra ? primarySans : "var(--font-baikal)";
  const fortnite = extra ? primarySans : "var(--font-burbank)";

  return {
    fonts,
    sans: `${primarySans}, ${systemFonts}`,
    condensed,
    fortnite,
  };
}
```

Replace the `RootLayout` body (currently lines 131–173) with:

```tsx
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!isLocale(locale)) {
    return notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const msg = await getMessages();
  const { fonts, sans, condensed, fortnite } = getFontsForLocale(locale);
  const style: RootStyle = {
    "--font-sans": sans,
    "--font-condensed": condensed,
    "--font-fortnite": fortnite,
  };

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`bg-background text-foreground transition-colors duration-300 ${fonts.map((font) => font.variable).join(" ")}`}
      style={style}
    >
      <body className="h-full font-sans text-base leading-relaxed font-light lining-nums antialiased transition-colors xl:text-xl xl:leading-relaxed">
        <Providers locale={locale} messages={msg}>
          <Navbar />
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update `globals.css` font stack to match**

In `web/src/app/globals.css`, replace the `--font-sans` definition at lines 102–106:

```css
  /* Font Family */
  --font-sans:
    var(--font-noto-sans), "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  --font-condensed: var(--font-baikal);
  --font-fortnite: var(--font-burbank);
  --font-monospace: var(--font-fira-code), "monospace";
```

> The per-locale layout now writes `--font-sans` inline on `<html style="...">`, so the CSS default here only matters for locales we haven't matched. Keep the system-font fallback; drop the CJK Noto variants from the default stack.

- [ ] **Step 3: Run validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 4: Run unit tests**

```bash
cd web && pnpm run test:unit
```

- [ ] **Step 5: Run e2e across locales**

```bash
cd web && pnpm run test:e2e
```

- [ ] **Step 6: Manual visual check (Storybook)**

```bash
cd web && pnpm run storybook
```

Verify in each locale (en, ja, ko, zh, zh-tw) that text renders correctly with no missing-character boxes. Chromatic CI will catch any regressions at PR time.

- [ ] **Step 7: Verify headroom: check the browser network panel in a prod build**

```bash
cd web && pnpm run build && pnpm run start
```

Open `http://localhost:3000/` in an incognito window, DevTools → Network → filter "Font". You should see 4 font fetches (Noto Sans latin subset, Fira Code, baikal, burbank) rather than 8.

Then visit `http://localhost:3000/ja` and confirm Noto_Sans_JP loads.

- [ ] **Step 8: Commit**

```bash
git add web/src/app/[locale]/layout.tsx web/src/app/globals.css
git commit -m "perf(web): scope CJK fonts to CJK locales, disable preload

Only declare the Noto CJK font variable class on the <html> element for
locales that need it. Disable preload on all non-core fonts so latin
pages stop fetching four unused font files."
```

---

### Task 10: Lazy-load the Navbar mobile drawer

**Why:** `web/src/shared/components/layout/NavBar/Navbar.tsx` is a shared client component on every page. It imports `Drawer` from `@heroui/react` — a heavy React-Aria overlay — solely for the mobile menu. Desktop visitors pay the bundle cost of a widget they'll never see.

**Approach:** Move the drawer's content into its own component and `dynamic`-import it. Keep the menu-trigger button in the main navbar so the click hit-target renders immediately; when the button is clicked, load the drawer chunk.

**Files:**
- Create: `web/src/shared/components/layout/NavBar/MobileDrawer.tsx`
- Modify: `web/src/shared/components/layout/NavBar/Navbar.tsx`

- [ ] **Step 1: Extract drawer markup into its own file**

Create `web/src/shared/components/layout/NavBar/MobileDrawer.tsx`:

```tsx
"use client";

import { Button, Drawer } from "@heroui/react";
import { LuMenu as MenuIcon } from "react-icons/lu";

import { Link as NextLink } from "#i18n/routing";

import type { NavSection } from "./nav-sections";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  sections: NavSection[];
  t: (key: string) => string;
};

export default function MobileDrawer({ isOpen, onOpenChange, onClose, sections, t }: Props) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button className="p-0 md:hidden" variant="ghost" aria-label={t("openMenu")}>
        <MenuIcon className="h-5 w-5" />
      </Button>

      <Drawer.Backdrop variant="blur">
        <Drawer.Content placement="left">
          <Drawer.Dialog className="">
            <Drawer.CloseTrigger aria-label={t("closeMenu")} />
            <Drawer.Header>
              <Drawer.Heading>{t("menu")}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1" data-testid="navbar-mobile-menu">
                {sections.map((section) => {
                  const label = t(section.labelKey);

                  if (section.type === "link") {
                    return (
                      <NextLink
                        key={section.key}
                        href={section.href}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                      >
                        {section.logo}
                        {label}
                      </NextLink>
                    );
                  }

                  return (
                    <div key={section.key}>
                      <div className="mt-5 mb-2 font-semibold uppercase">{label}</div>

                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => (
                          <NextLink
                            key={item.key}
                            onClick={onClose}
                            href={`${section.pathPrefix}/${item.key}`}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                          >
                            {item.logo}
                            {t(item.labelKey)}
                          </NextLink>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
```

- [ ] **Step 2: Extract the shared `NavSection` types**

Create `web/src/shared/components/layout/NavBar/nav-sections.tsx`:

```tsx
import { ReactNode } from "react";

export type NavLink = {
  type: "link";
  key: string;
  labelKey: string;
  href: string;
  logo: ReactNode;
};

export type NavGroup = {
  type: "group";
  key: string;
  labelKey: string;
  pathPrefix: string;
  items: {
    key: string;
    labelKey: string;
    logo: ReactNode;
  }[];
};

export type NavSection = NavLink | NavGroup;
```

- [ ] **Step 3: Update `Navbar.tsx` to dynamically import the drawer and to pull types from the new file**

Replace the imports block at the top of `web/src/shared/components/layout/NavBar/Navbar.tsx` (lines 1–24):

```tsx
"use client";

import { Button, Dropdown, Label } from "@heroui/react";
import { motion, MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { FaChevronDown as DownIcon } from "react-icons/fa";
import { FaRegCalendar as TimestampIcon } from "react-icons/fa6";
import {
  GiConwayLifeGlider as ConwayIcon,
  GiPerspectiveDiceSixFacesRandom as UuidIcon,
} from "react-icons/gi";
import { LuBookText as BlogIcon, LuHouse as HomeIcon, LuMenu as MenuIcon } from "react-icons/lu";
import { MdOutlineTextFields as StringLengthIcon } from "react-icons/md";
import { PiPathBold as PathfindingIcon } from "react-icons/pi";
import { RiTimeZoneLine as TimezoneIcon } from "react-icons/ri";
import { TbBrandFortnite as FortniteIcon } from "react-icons/tb";
import { TfiLayoutGrid4Alt as BeatmakerIcon } from "react-icons/tfi";

import { Link as NextLink, usePathname, useRouter } from "#i18n/routing";

import { Section } from "../Section";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { NavSection } from "./nav-sections";
import { ThemeSwitcher } from "./ThemeSwitcher";

const MobileDrawer = dynamic(() => import("./MobileDrawer"), {
  ssr: false,
  loading: () => (
    <Button className="p-0 md:hidden" variant="ghost" aria-label="menu">
      <MenuIcon className="h-5 w-5" />
    </Button>
  ),
});
```

Delete the in-file `NavLink` / `NavGroup` / `NavSection` type declarations (previously lines 26–46).

Delete the entire `<Drawer>...</Drawer>` JSX block currently in the navbar (lines 245–301) and replace it with:

```tsx
            <MobileDrawer
              isOpen={isMobileDrawerOpen}
              onOpenChange={setIsMobileDrawerOpen}
              onClose={closeMobileDrawer}
              sections={navSections}
              t={t}
            />
```

- [ ] **Step 4: Run validate-code**

```bash
cd web && pnpm run validate-code
```

Fix any unused-import warnings.

- [ ] **Step 5: Run the existing Navbar unit test**

```bash
cd web && pnpm run test:unit -- Navbar.test
```

Expected: PASS. If the test asserts on the drawer's DOM before click, update it to `await userEvent.click(screen.getByLabelText('openMenu'))` and then `await screen.findByTestId('navbar-mobile-menu')` — the drawer will resolve async.

- [ ] **Step 6: Run e2e smoke**

```bash
cd web && pnpm exec playwright test e2e/home.spec.ts
```

- [ ] **Step 7: Verify bundle impact**

```bash
cd web && ANALYZE=true pnpm run build
```

Confirm `MobileDrawer` sits in its own async chunk and no longer inflates the shared navbar chunk.

- [ ] **Step 8: Commit**

```bash
git add web/src/shared/components/layout/NavBar/Navbar.tsx web/src/shared/components/layout/NavBar/MobileDrawer.tsx web/src/shared/components/layout/NavBar/nav-sections.tsx
git commit -m "perf(navbar): lazy-load HeroUI Drawer for mobile menu"
```

---

### Task 11: Lazy-load the Contact `Modal`

**Why:** The LinkedIn-click modal on the home page imports `@heroui/react`'s `Modal` + `useOverlayState`. Only a small fraction of visitors click the LinkedIn link. Defer the Modal until needed.

**Files:**
- Modify: `web/src/features/home/components/Contact.tsx`
- Create: `web/src/features/home/components/LinkedInModal.tsx`

- [ ] **Step 1: Extract the modal into its own component**

Create `web/src/features/home/components/LinkedInModal.tsx`:

```tsx
"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";

type Props = {
  state: ReturnType<typeof useOverlayState>;
  title: string;
  content: string;
  closeLabel: string;
};

export default function LinkedInModal({ state, title, content, closeLabel }: Props) {
  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable isKeyboardDismissDisabled>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">{title}</Modal.Header>
            <Modal.Body>
              <p>{content}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onPress={() => {
                  state.close();
                }}
              >
                {closeLabel}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
```

- [ ] **Step 2: Swap the eager modal import in `Contact.tsx`**

At the top of `web/src/features/home/components/Contact.tsx`, keep only the `useOverlayState` from `@heroui/react` — drop `Button` and `Modal` from that import line. Replace the HeroUI import:

```tsx
import { useOverlayState } from "@heroui/react";
```

Add the dynamic import:

```tsx
const LinkedInModal = dynamic(() => import("./LinkedInModal"), { ssr: false });
```

Replace the `<Modal>...</Modal>` JSX block (currently lines 71–92) with:

```tsx
        {overlayState.isOpen && (
          <LinkedInModal
            state={overlayState}
            title={modalTitle}
            content={modalContent}
            closeLabel={t("linkedinModalClose")}
          />
        )}
```

> `overlayState.isOpen` gates the dynamic import so it only runs after the user clicks. The Modal itself handles its own render once mounted.

- [ ] **Step 3: Update the Contact unit test to cover the modal behavior**

Extend `web/src/features/home/components/Contact.test.tsx`:

```tsx
import userEvent from "@testing-library/user-event";

// ... existing mocks + imports ...

it("lazy-loads the LinkedIn modal only after click", async () => {
  const user = userEvent.setup();
  render(<Contact />, { wrapper: testWrapper });

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  await user.click(screen.getByText("in/melvinlaplanche"));

  // The modal is dynamic + async — findByRole awaits it.
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the test**

```bash
cd web && pnpm run test:unit -- Contact.test
```

Expected: PASS.

- [ ] **Step 5: Run validate-code**

```bash
cd web && pnpm run validate-code
```

- [ ] **Step 6: Run e2e**

```bash
cd web && pnpm exec playwright test e2e/home.spec.ts
```

- [ ] **Step 7: Commit**

```bash
git add web/src/features/home/components/Contact.tsx web/src/features/home/components/LinkedInModal.tsx web/src/features/home/components/Contact.test.tsx
git commit -m "perf(home): lazy-load LinkedIn modal until it is opened"
```

---

## Tier 3 — Optional Polish

### Task 12: Consolidate `react-icons` → `lucide-react` where 1:1 equivalents exist

**Why:** `Navbar.tsx` imports 10 different `react-icons/*` sub-packages. Tree-shaking is fine per-package, but each sub-package adds resolution overhead and each icon family's own barrel structure prevents sharing chunks. Since `lucide-react` is already in `dependencies`, use it for icons that have clean equivalents.

**Mapping (Navbar.tsx):**
| Current (`react-icons/*`) | Replacement (`lucide-react`) |
|---|---|
| `FaChevronDown` (fa) | `ChevronDown` |
| `FaRegCalendar` (fa6) | `Calendar` |
| `GiPerspectiveDiceSixFacesRandom` (gi) | `Dices` |
| `LuBookText` (lu) | `BookText` |
| `LuHouse` (lu) | `House` |
| `LuMenu` (lu) | `Menu` |
| `MdOutlineTextFields` (md) | `Type` |
| `PiPathBold` (pi) | `Route` |
| `RiTimeZoneLine` (ri) | `Globe` |
| `GiConwayLifeGlider` (gi) | no clean equivalent — keep |
| `TbBrandFortnite` (tb) | no equivalent — keep |
| `TfiLayoutGrid4Alt` (tfi) | `LayoutGrid` (close enough for beatmaker icon) |

The Contact component's `LuGithub` / `LuLinkedin` also have lucide equivalents (`Github`, `Linkedin`).

**Files:**
- Modify: `web/src/shared/components/layout/NavBar/Navbar.tsx`
- Modify: `web/src/shared/components/layout/NavBar/MobileDrawer.tsx`
- Modify: `web/src/features/home/components/Contact.tsx`

- [ ] **Step 1: Replace Navbar imports**

In `Navbar.tsx` (both top of file and inside `MobileDrawer.tsx` for the menu icon), replace the react-icons import block with:

```tsx
import {
  BookText as BlogIcon,
  Calendar as TimestampIcon,
  ChevronDown as DownIcon,
  Dices as UuidIcon,
  House as HomeIcon,
  LayoutGrid as BeatmakerIcon,
  Menu as MenuIcon,
  Route as PathfindingIcon,
  Type as StringLengthIcon,
  Globe as TimezoneIcon,
} from "lucide-react";
import { GiConwayLifeGlider as ConwayIcon } from "react-icons/gi";
import { TbBrandFortnite as FortniteIcon } from "react-icons/tb";
```

Do the same replacement in `MobileDrawer.tsx` for `LuMenu`.

- [ ] **Step 2: Replace Contact icons**

In `Contact.tsx`, replace:

```tsx
import { LuGithub as Github, LuLinkedin as Linkedin } from "react-icons/lu";
```

with:

```tsx
import { Github, Linkedin } from "lucide-react";
```

(`Mail` was already from `lucide-react`.)

- [ ] **Step 3: Validate + test**

```bash
cd web && pnpm run validate-code
cd web && pnpm run test:unit
cd web && pnpm run test:e2e
```

- [ ] **Step 4: Visual check in Storybook**

```bash
cd web && pnpm run storybook
```

Confirm the icons render and their sizes still match the old ones (lucide defaults to a 24px stroke-1.5 look; the existing `className="h-5 w-5"` keeps sizing consistent).

- [ ] **Step 5: Drop unused react-icons sub-paths from `pnpm run knip`**

```bash
cd web && pnpm run knip
```

If knip flags `react-icons/fa`, `react-icons/fa6`, `react-icons/lu`, `react-icons/md`, `react-icons/pi`, `react-icons/ri`, `react-icons/tfi` as unused (the package remains used via `gi` and `tb`), no action — `react-icons` is a single NPM package regardless of subpath.

- [ ] **Step 6: Commit**

```bash
git add -u
git commit -m "perf(icons): move common navbar icons to lucide-react

Reduces the number of react-icons subpackage barrels the bundler has to
resolve on the critical path. Keeps react-icons only for the specialty
brand/illustration icons (Conway glider, Fortnite)."
```

---

## Verification

### Task 13: Final measurement + PR

**Files:** none modified; measurement + docs only.

- [ ] **Step 1: Build + start the production server locally**

```bash
cd web && pnpm run build && pnpm run start
```

- [ ] **Step 2: Capture post-fix Lighthouse metrics**

Record to `web/perf-baseline.md` under a new "Post Tier 2" heading:
- TTFB (cold + warm)
- FCP
- LCP
- TBT
- Total JS transferred (home, blog, timezones)

Compare against pre-fix numbers.

- [ ] **Step 3: Push the branch and open a draft PR**

```bash
git push -u origin perf/page-load-cleanup
gh pr create --draft --title "perf(web): cut page load from ~7s to target <3s" --body "$(cat <<'EOF'
## Summary
- Tier 1 (server/cold-start): remove Sentry `includeLocalVariables`, `tunnelRoute`, drop tracesSampleRate to 1%, disable next-intl localeDetection, lazy-load locale messages, strip moment-timezone from the shared Providers.
- Tier 2 (bundle/LCP): defer Google Maps until scroll, lazy-load HeroUI Drawer + Modal, split CJK fonts per locale and disable preload for secondaries.
- Tier 3 (polish): move common navbar icons from react-icons/* to lucide-react.

## Measurements
See `web/perf-baseline.md` (gitignored). Expected: TTFB ~5s → ~1s, LCP ~7s → ~2.5s.

## Test plan
- [ ] `pnpm run validate-code`
- [ ] `pnpm run test:unit`
- [ ] `pnpm run test:e2e`
- [ ] Visual regression via Chromatic
- [ ] Deploy preview → Lighthouse on `/`, `/blog`, `/tools/timezones`, `/ja`
- [ ] Verify mobile drawer still opens after click
- [ ] Verify Google Maps still loads when scrolling to contact section
- [ ] Verify LinkedIn modal still opens on click

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Deploy the Vercel preview and re-measure**

After Vercel builds the preview:
- Run Lighthouse against the preview URL (`/`, `/blog`, `/tools/timezones`).
- Paste the numbers into the PR description.
- If TTFB is still >2s on cold start, escalate to the "Cold-start note" in the original analysis: evaluate Vercel Fluid Compute and/or making `[locale]/page.tsx` routes `export const dynamic = "force-static"` to force ISR-style caching.

- [ ] **Step 5: Mark the PR ready for review and merge once CI is green.**

---

## Scope considerations (not in this plan; potential follow-ups)

- **Partial Prerendering (PPR)** — Next 16 supports it; worth evaluating for the home page in a follow-up once stable.
- **Replace `moment-timezone` with `Intl.DateTimeFormat`** inside the Timezones tool so moment disappears from the bundle entirely. Non-trivial refactor; own PR.
- **`react-syntax-highlighter`** in `CodeBlock.tsx` — already per-language imports, but re-verify after dependency updates that it's not pulling the full languages barrel.
- **Edge runtime for middleware** — `next-intl` middleware runs at the edge by default on Vercel, so this should already be optimal; only investigate if flamegraphs show middleware time.
- **Preload hints for the map chunk on desktop** — after Task 8, consider a `<link rel="prefetch">` for the maps chunk when viewport height > mobile. Not worth it until Tier 1 is measured.
