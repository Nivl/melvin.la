/* eslint-disable import/no-default-export */

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  experimental: {
    testProxy: true,
  },
};

export default nextConfig;
