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
    // HTML Sitemap - All Games Directory
    {
      url: `${BASE_URL}/gaming/all-games`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
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
  
  // ============================================
  // GUIDE PAGES - TOP 5 GAMES ONLY (SEO Authority)
  // Priority 0.8 - Supporting content for top games
  // ============================================
  const guideGameSlugs = [
    'raid-shadow-legends',
    'monopoly-go',
    'brawl-stars',
    'afk-arena',
    'roblox',
  ]
  
  const guidePages: MetadataRoute.Sitemap = guideGameSlugs.flatMap((slug) => [
    {
      url: `${BASE_URL}/gaming/${slug}-guide`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/${slug}-tips`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gaming/${slug}-leveling`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ])
  
  // ============================================
  // MONTHLY CODES PAGES - TOP 5 GAMES (Legacy April 2026)
  // Priority 0.9 - Original seasonal SEO pages
  // ============================================
  const monthlyCodesPages: MetadataRoute.Sitemap = guideGameSlugs.map((slug) => ({
    url: `${BASE_URL}/gaming/${slug}-codes-april-2026`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))
  
  // ============================================
  // SCALABLE MONTHLY PAGES - ALL GAMES x ALL MONTHS
  // Creates 500+ indexed pages for long-tail SEO
  // April 2026 through March 2027 = 12 months x 50+ games
  // ============================================
  const monthlyPages = [
    'april-2026',
    'may-2026',
    'june-2026', 
    'july-2026',
    'august-2026',
    'september-2026',
    'october-2026',
    'november-2026',
    'december-2026',
    'january-2027',
    'february-2027',
    'march-2027',
  ]
  
  const allMonthlyPages: MetadataRoute.Sitemap = gamesData.flatMap((game) => {
    const isTopGame = TOP_GAME_SLUGS.includes(game.slug)
    
    return monthlyPages.map((monthYear) => ({
      url: `${BASE_URL}/gaming/${game.slug}/codes-${monthYear}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: isTopGame ? 0.9 : 0.7,
    }))
  })
  
  // ============================================
  // CODES-TODAY PAGES - ALL GAMES
  // Daily updated pages for each game
  // ============================================
  const codesTodayPages: MetadataRoute.Sitemap = gamesData.map((game) => {
    const isTopGame = TOP_GAME_SLUGS.includes(game.slug)
    return {
      url: `${BASE_URL}/gaming/${game.slug}/codes-today`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: isTopGame ? 0.8 : 0.6,
    }
  })
  
  return [
    ...mainPages, 
    ...hubPages, 
    ...gamePages, 
    ...guidePages, 
    ...monthlyCodesPages,
    ...allMonthlyPages,
    ...codesTodayPages,
  ]
}
