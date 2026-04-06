import type { MetadataRoute } from 'next'
import { gamesData, getGameSlugsForSitemap, getAllGameSlugs } from '@/lib/gaming-data'

const BASE_URL = 'https://savesmart.bio'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Gaming hub pages
    {
      url: `${BASE_URL}/gaming`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gaming/promo-codes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/gaming/free-rewards`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/gaming/new-player-deals`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/today`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gaming/best-codes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/gaming/top-games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/all-codes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
  ]
  
  // Dynamic game pages - high priority for main game pages
  const gamePages: MetadataRoute.Sitemap = gamesData.flatMap((game) => {
    const gameLastModified = game.lastUpdated || currentDate
    
    return [
      // Main game page (highest priority)
      {
        url: `${BASE_URL}/gaming/${game.slug}`,
        lastModified: gameLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      // Codes page
      {
        url: `${BASE_URL}/gaming/${game.slug}/codes`,
        lastModified: gameLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.85,
      },
      // Redeem codes guide
      {
        url: `${BASE_URL}/gaming/${game.slug}/redeem-codes`,
        lastModified: gameLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      // Free rewards
      {
        url: `${BASE_URL}/gaming/${game.slug}/free-rewards`,
        lastModified: gameLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.75,
      },
      // Rewards page
      {
        url: `${BASE_URL}/gaming/${game.slug}/rewards`,
        lastModified: gameLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.75,
      },
    ]
  })
  
  return [...staticPages, ...gamePages]
}
