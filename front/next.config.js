/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
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
