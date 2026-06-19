/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'example.com',
        'www.example.com',
        'admin.example.com'
      ]
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig

