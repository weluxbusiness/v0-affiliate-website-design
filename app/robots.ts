import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // System paths
          '/api/',
          '/_next/',
          '/admin/',
          
          // Affiliate redirect pages (should never be indexed)
          '/go/',
          '/out/',
          '/redirect/',
          '/affiliate/',
          '/link/',
          
          // Pagination beyond page 5 (crawl budget optimization)
          '/*/page/6',
          '/*/page/7',
          '/*/page/8',
          '/*/page/9',
          '/*/page/1[0-9]',
          '/*/page/[2-9][0-9]',
          
          // Deprecated/redirecting paths
          '/deals-finder',
          '/deals-finder/',
          
          // Search and filter pages (thin content)
          '/search',
          '/*?*', // Query parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          // Explicitly allow high-value pages
          '/gaming/',
          '/deals/',
          '/stores/',
          '/guides/',
          '/brands/',
        ],
        disallow: [
          // Same as above for Googlebot
          '/api/',
          '/_next/',
          '/admin/',
          '/go/',
          '/out/',
          '/redirect/',
          '/affiliate/',
          '/link/',
          '/deals-finder',
        ],
      },
    ],
    sitemap: 'https://savesmart.bio/sitemap.xml',
    host: 'https://savesmart.bio',
  }
}
