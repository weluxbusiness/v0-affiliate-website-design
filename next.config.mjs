/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig
