/* eslint-disable import/no-default-export */

import { type NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
};

export default withNextIntl(nextConfig);
