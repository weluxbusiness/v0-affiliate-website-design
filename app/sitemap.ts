import type { MetadataRoute } from 'next'
import { SITEMAP_CONFIG } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  
  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/deals/today`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending-deals`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/latest-deals`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deal-finder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // Gaming hub pages - high priority for SEO
    {
      url: `${baseUrl}/gaming`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gaming/promo-codes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gaming/today`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help-center`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = SITEMAP_CONFIG.categories.slice(0, 30).map(category => ({
    url: `${baseUrl}/deals/${category}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Best category pages
  const bestPages: MetadataRoute.Sitemap = SITEMAP_CONFIG.bestCategories.slice(0, 20).map(category => ({
    url: `${baseUrl}/best/${category}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...categoryPages, ...bestPages]
}
