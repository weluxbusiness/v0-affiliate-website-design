import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 301 Redirects: Nested gaming URLs → Flat SEO URLs
  async redirects() {
    return [
      // Redirect nested gaming pages to flat SEO URLs
      // Pattern: /gaming/[game]/[page-type] → /[game]-[page-type]
      {
        source: '/gaming/:game/codes-today',
        destination: '/:game-codes-today',
        permanent: true,
      },
      {
        source: '/gaming/:game/working-codes',
        destination: '/:game-working-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/new-codes',
        destination: '/:game-new-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/free-rewards',
        destination: '/:game-free-rewards',
        permanent: true,
      },
      {
        source: '/gaming/:game/redeem-codes',
        destination: '/:game-redeem-codes',
        permanent: true,
      },
    ]
  },
  images: {
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize image sizing
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Unsplash
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Amazon product images
      {
        protocol: 'https',
        hostname: '*.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // Walmart
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
      // Best Buy
      {
        protocol: 'https',
        hostname: 'pisces.bbystatic.com',
      },
      // Target
      {
        protocol: 'https',
        hostname: 'target.scene7.com',
      },
      // Nike
      {
        protocol: 'https',
        hostname: 'static.nike.com',
      },
      // Apple
      {
        protocol: 'https',
        hostname: 'store.storeimages.cdn-apple.com',
      },
      // Generic CDNs
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.net',
      },
      // Placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

// Wrap with Sentry for error monitoring and source maps
export default withSentryConfig(nextConfig, {
  // Sentry organization and project
  org: process.env.SENTRY_ORG || "savesmart",
  project: process.env.SENTRY_PROJECT || "savesmart-web",

  // Auth token for source map uploads (set in CI/CD)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload source maps for better stack traces
  widenClientFileUpload: true,

  // Route Sentry events through Next.js to avoid ad blockers
  tunnelRoute: "/monitoring",

  // Hide source maps from browser devtools in production
  hideSourceMaps: true,

  // Webpack-specific options (not supported with Turbopack)
  webpack: {
    // Automatically annotate React components for better breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },
    // Remove debug logging to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
