import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://savesmart.bio'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/sitemap-stores.xml`,
      `${baseUrl}/sitemap-categories.xml`,
      `${baseUrl}/sitemap-brands.xml`,
      `${baseUrl}/sitemap-blog.xml`,
      `${baseUrl}/sitemap-deals.xml`,
      `${baseUrl}/sitemap-gaming.xml`,
      `${baseUrl}/sitemap-best.xml`,
      `${baseUrl}/sitemap-promo.xml`,
    ],
    host: baseUrl,
  }
}
