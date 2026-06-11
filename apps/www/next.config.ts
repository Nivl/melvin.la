/* eslint-disable import/no-default-export */

import withBundleAnalyzer from "@next/bundle-analyzer";
import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Relative import (instead of the usual # subpath): Next loads this config
// through its own transpiler, which can't resolve package.json imports.
import { localeRedirects, localeRewrites } from "./src/i18n/routing-rules";

const bundleAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const cspReportEndpoint = "/api/csp-report";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  {
    // Roll out in report-only mode first so we can observe legitimate violations
    // before switching to an enforcing CSP.
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://*.sentry.io https://*.vercel-scripts.com https://static.cloudflareinsights.com ${process.env.VERCEL_ENV === "preview" ? "https://vercel.live" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com https://static-cdn.jtvnw.net",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.googleapis.com https://*.sentry.io https://*.vercel-insights.com https://fortnite-api.com",
      `frame-src 'self' ${process.env.VERCEL_ENV === "preview" ? "https://vercel.live;" : ""}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      `report-uri ${cspReportEndpoint}`,
      "upgrade-insecure-requests",
    ].join("; "),
  },
] satisfies { key: string; value: string }[];

const nextConfig: NextConfig = {
  async headers() {
    return await Promise.resolve([
      {
        headers: securityHeaders,
        source: "/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/assets/games/beatmaker/samples/:version/:rest*",
      },
    ]);
  },
  images: {
    localPatterns: [
      {
        pathname: "/assets/blog/**",
      },
    ],
  },
  // Locale detection and default-locale serving happen here, at the routing
  // layer, instead of in a middleware: the rules compile into Vercel's edge
  // routing config, so static pages are served straight from the CDN cache
  // without invoking a function on every request.
  async redirects() {
    return await Promise.resolve(localeRedirects());
  },
  async rewrites() {
    return await Promise.resolve(localeRewrites());
  },
  transpilePackages: ["next-mdx-remote", "@melvinla/next-themes"],
};

// https://www.npmjs.com/package/@sentry/webpack-plugin#options
//
// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const sentryOption: SentryBuildOptions = {
  // Auth token for uploading source maps — set SENTRY_AUTH_TOKEN in CI secrets
  // or in a local .env.sentry-build-plugin file (gitignored).
  authToken: process.env.SENTRY_AUTH_TOKEN,

  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // Disabled: tunnelRoute adds a middleware match and cold-start overhead. Re-enable if
  // ad-blocker interference becomes a significant concern.
  // WARNING: before re-enabling, exclude the tunnel path from unprefixedSource in
  // src/i18n/routing-rules.ts — the locale redirects run before rewrites and would
  // 307 the tunnel POSTs to /<locale>/monitoring, silently dropping error envelopes.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
};

export default bundleAnalyzer(withSentryConfig(withNextIntl(nextConfig), sentryOption));
