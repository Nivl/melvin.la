/* eslint-disable import/no-default-export */

import withBundleAnalyzer from "@next/bundle-analyzer";
import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
      "script-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://*.sentry.io https://*.vercel-scripts.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com https://static-cdn.jtvnw.net",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.googleapis.com https://*.sentry.io https://*.vercel-insights.com https://fortnite-api.com",
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
