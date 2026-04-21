/* eslint-disable import/no-default-export */

import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const nextConfig: NextConfig = {
  async headers() {
    return await Promise.resolve([
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
  transpilePackages: ["next-mdx-remote"],
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
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

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

export default withSentryConfig(withNextIntl(nextConfig), sentryOption);
