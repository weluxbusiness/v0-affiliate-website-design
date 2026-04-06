import type { MetadataRoute } from 'next'
import { gamesData } from '@/lib/gaming-data'

const BASE_URL = 'https://savesmart.bio'

// Top games get priority 1.0 (high revenue/traffic potential)
const TOP_GAME_SLUGS = [
  'raid-shadow-legends',
  'monopoly-go', 
  'brawl-stars',
  'afk-arena',
  'genshin-impact',
  'honkai-star-rail',
  'fortnite',
  'roblox',
  'clash-of-clans',
  'call-of-duty-mobile',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  // ============================================
  // MAIN PAGES (Priority 1.0)
  // ============================================
  const mainPages: MetadataRoute.Sitemap = [
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
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/gaming`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]
  
  // ============================================
  // GAMING HUB PAGES (Priority 0.8)
  // ============================================
  const hubPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/gaming/promo-codes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/best-codes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/top-games`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]
  
  // ============================================
  // GAME PAGES - ONLY MAIN PAGES (NO VARIANTS)
  // Top games: priority 1.0, others: priority 0.7
  // ============================================
  const gamePages: MetadataRoute.Sitemap = gamesData.map((game) => {
    const isTopGame = TOP_GAME_SLUGS.includes(game.slug)
    
    return {
      url: `${BASE_URL}/gaming/${game.slug}`,
      lastModified: game.lastUpdated || currentDate,
      changeFrequency: 'daily' as const,
      priority: isTopGame ? 1.0 : 0.7,
    }
  })
  
  return [...mainPages, ...hubPages, ...gamePages]
}
