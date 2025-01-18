/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Image configuration
  images: {
    domains: process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS?.split(',') || ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 60,
  },

  // Server actions configuration
  experimental: {
    serverActions: {
      allowedOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || ['localhost:3000']
    }
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Enable React strict mode for better development
  reactStrictMode: true,

  // Disable type checking during build for now (should be enabled later)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  },

  // Disable ESLint during build for now (should be enabled later)
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
  },

  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      }
    ]
  },

  // Configure rewrites for API proxy
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
        }
      ]
    }
  }
}

module.exports = nextConfig
