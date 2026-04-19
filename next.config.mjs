import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Trailing slash consistency - prevents redirect issues
  // All URLs will NOT have trailing slashes (e.g., /gaming not /gaming/)
  // This prevents Google "Page with redirect" errors
  trailingSlash: false,
  
  // 301 Redirects: Consolidate all routes to high-value pages only
  // Goal: Reduce index bloat by redirecting low-value pages to main codes page
  async redirects() {
    return [
      // ==== REDIRECT LOW-VALUE PAGES TO MAIN CODES PAGE ====
      // These caused "Discovered - not indexed" and "Soft 404" issues
      {
        source: '/:game-codes-today',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-working-codes',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-new-codes',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-free-rewards',
        destination: '/:game-codes',
        permanent: true,
      },
      // ==== REDIRECT NESTED GAMING URLS TO FLAT URLS ====
      {
        source: '/gaming/:game/codes-today',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/working-codes',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/new-codes',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/free-rewards',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/redeem-codes',
        destination: '/:game-redeem-codes',
        permanent: true,
      },
      {
        source: '/gaming/:game/codes',
        destination: '/:game-codes',
        permanent: true,
      },
      // ==== REDIRECT BLOG PAGES TO MAIN CODES PAGE ====
      // Blog pages created thin/duplicate content
      {
        source: '/:game-how-to-get-free-rewards',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-tips-and-tricks',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-beginner-guide',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-how-to-level-up-fast',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/:game-best-strategies',
        destination: '/:game-codes',
        permanent: true,
      },
      {
        source: '/gaming-guides/:slug',
        destination: '/',
        permanent: true,
      },
      // ==== REDIRECT DUPLICATE DEAL FINDER ROUTES ====
      // Consolidate deals-finder to deal-finder (canonical)
      {
        source: '/deals-finder',
        destination: '/deal-finder',
        permanent: true,
      },
      {
        source: '/deals-finder/:slug',
        destination: '/deal-finder/:slug',
        permanent: true,
      },
      // ==== PAGINATION PAGE 1 REDIRECTS ====
      // Page 1 should always use the canonical URL (no /page/1)
      {
        source: '/deals/:category/page/1',
        destination: '/deals/:category',
        permanent: true,
      },
      {
        source: '/stores/:store/page/1',
        destination: '/stores/:store',
        permanent: true,
      },
      {
        source: '/brands/:brand/page/1',
        destination: '/brands/:brand',
        permanent: true,
      },
      {
        source: '/deals/:category/:brand/page/1',
        destination: '/deals/:category/:brand',
        permanent: true,
      },
      {
        source: '/deals/:category/:brand/:store/page/1',
        destination: '/deals/:category/:brand/:store',
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
