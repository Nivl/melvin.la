/* eslint-disable import/no-default-export */

import { SentryBuildOptions, withSentryConfig } from '@sentry/nextjs';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import { type NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { locales } from "./src/i18n/locales.ts";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
}); 

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
  webpack: (config) => {
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: [...locales],
      })
    );
    return config;
  }
};

const sentryOption: SentryBuildOptions = {
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

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
  tunnelRoute: '/monitoring',

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
};

export default withSentryConfig(withNextIntl(nextConfig), sentryOption);
