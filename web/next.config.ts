/* eslint-disable import/no-default-export */

import { SentryBuildOptions, withSentryConfig } from "@sentry/nextjs";
import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    localPatterns: [
      {
        pathname: "/assets/blog/**",
      },
    ],
  },
  async headers() {
    return await Promise.resolve([
      {
        source: "/assets/games/beatmaker/samples/:version/:rest*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]);
  },
};

const sentryOption: SentryBuildOptions = {
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

  // Auth token for uploading source maps — set SENTRY_AUTH_TOKEN in CI secrets
  // or in a local .env.sentry-build-plugin file (gitignored).
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

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
};

export default withSentryConfig(withNextIntl(nextConfig), sentryOption);
