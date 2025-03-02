/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/drrzzmmic/image/upload/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/conway',
        destination: '/games/conway',
        permanent: true,
      },
      {
        source: '/timezones',
        destination: '/tools/timezones',
        permanent: true,
      },
      {
        source: '/fortnite',
        destination: '/tools/fortnite',
        permanent: true,
      },
    ]
  },
}


module.exports = nextConfig
