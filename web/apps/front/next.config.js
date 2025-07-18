/* eslint-disable import/no-default-export */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
