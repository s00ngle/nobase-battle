/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nobasebattle-s3.s3.ap-northeast-2.amazonaws.com',
        pathname: '/character-images/**',
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
