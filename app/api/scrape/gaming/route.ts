import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logScrape, upsertGame, bulkUpsertPromoCodes, getGameBySlug } from '@/lib/gaming-db'

export const dynamic = 'force-dynamic'

// Scraper configuration for different games
const SCRAPE_SOURCES: Record<string, {
  name: string
  urls: string[]
  codePattern: RegExp
  rewardPattern?: RegExp
}> = {
  'roblox': {
    name: 'Roblox',
    urls: [
      'https://www.pockettactics.com/roblox/codes',
      'https://progameguides.com/roblox/roblox-promo-codes-list/',
    ],
    codePattern: /\b([A-Z0-9]{8,20})\b/gi,
  },
  'genshin-impact': {
    name: 'Genshin Impact',
    urls: [
      'https://www.pockettactics.com/genshin-impact/codes',
      'https://game8.co/games/Genshin-Impact/archives/304759',
    ],
    codePattern: /\b([A-Z0-9]{12,16})\b/gi,
  },
  'honkai-star-rail': {
    name: 'Honkai Star Rail',
    urls: [
      'https://www.pockettactics.com/honkai-star-rail/codes',
    ],
    codePattern: /\b([A-Z0-9]{12,16})\b/gi,
  },
  'fortnite': {
    name: 'Fortnite',
    urls: [
      'https://progameguides.com/fortnite/fortnite-codes/',
    ],
    codePattern: /\b([A-Z0-9]{5,20}[-]?[A-Z0-9]*)\b/gi,
  },
  'pokemon-go': {
    name: 'Pokemon GO',
    urls: [
      'https://www.eurogamer.net/pokemon-go-promo-codes-list-pokemon-go-promo-codes-9026',
    ],
    codePattern: /\b([A-Z0-9]{8,16})\b/gi,
  },
  'clash-of-clans': {
    name: 'Clash of Clans',
    urls: [
      'https://progameguides.com/clash-of-clans/clash-of-clans-codes/',
    ],
    codePattern: /\b([A-Z0-9]{8,20})\b/gi,
  },
  'pubg-mobile': {
    name: 'PUBG Mobile',
    urls: [
      'https://www.pockettactics.com/pubg-mobile/codes',
    ],
    codePattern: /\b([A-Z0-9]{8,20})\b/gi,
  },
  'call-of-duty-mobile': {
    name: 'Call of Duty Mobile',
    urls: [
      'https://www.pockettactics.com/call-of-duty-mobile/codes',
    ],
    codePattern: /\b([A-Z0-9]{10,20})\b/gi,
  },
  'brawl-stars': {
    name: 'Brawl Stars',
    urls: [
      'https://progameguides.com/brawl-stars/brawl-stars-codes/',
    ],
    codePattern: /\b([A-Z0-9]{8,20})\b/gi,
  },
  'candy-crush': {
    name: 'Candy Crush Saga',
    urls: [
      'https://progameguides.com/candy-crush-saga/candy-crush-saga-codes/',
    ],
    codePattern: /\b([A-Z0-9]{6,16})\b/gi,
  },
}

// Common words to filter out (not codes)
const FILTER_WORDS = new Set([
  'ROBLOX', 'FORTNITE', 'GENSHIN', 'IMPACT', 'POKEMON', 'MOBILE',
  'PROMO', 'CODE', 'CODES', 'FREE', 'ITEM', 'ITEMS', 'REWARD',
  'REWARDS', 'REDEEM', 'ACTIVE', 'EXPIRED', 'NEW', 'UPDATE',
  'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER',
  'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY',
  '2024', '2025', '2026', 'GAME', 'PLAY', 'STORE', 'SHOP',
])

interface ExtractedCode {
  code: string
  reward: string
  reward_type: string
  is_verified: boolean
  source: string
  source_url: string
}

// Extract codes from HTML content
function extractCodesFromContent(
  html: string, 
  pattern: RegExp,
  sourceUrl: string
): ExtractedCode[] {
  const codes: ExtractedCode[] = []
  const seen = new Set<string>()
  
  // Remove HTML tags but keep structure for context
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
  
  // Find potential codes
  const matches = textContent.match(pattern) || []
  
  for (const match of matches) {
    const code = match.toUpperCase().trim()
    
    // Filter out common words and too short codes
    if (code.length < 6) continue
    if (FILTER_WORDS.has(code)) continue
    if (seen.has(code)) continue
    
    // Check if it looks like a valid code (mixed alphanumeric)
    const hasLetter = /[A-Z]/.test(code)
    const hasNumber = /[0-9]/.test(code)
    if (!hasLetter || !hasNumber) continue
    
    seen.add(code)
    
    // Try to extract reward context
    const codeIndex = textContent.indexOf(match)
    const context = textContent.slice(Math.max(0, codeIndex - 100), codeIndex + 150)
    
    // Detect reward type from context
    let rewardType = 'Other'
    let reward = 'Free Rewards'
    
    const rewardPatterns = [
      { pattern: /(\d+)\s*(primogem|gem|coin|gold|credit)/i, type: 'Currency' },
      { pattern: /(free|bonus)\s*(skin|outfit|character|hero)/i, type: 'Cosmetic' },
      { pattern: /(experience|xp|exp)\s*boost/i, type: 'Experience' },
      { pattern: /(free|bonus)\s*(item|weapon|gear)/i, type: 'Items' },
      { pattern: /(\d+)\s*(v-?buck|robux)/i, type: 'Currency' },
    ]
    
    for (const { pattern: rewardPattern, type } of rewardPatterns) {
      const rewardMatch = context.match(rewardPattern)
      if (rewardMatch) {
        rewardType = type
        reward = rewardMatch[0].trim()
        break
      }
    }
    
    // Check if marked as verified/working
    const isVerified = /working|verified|active|valid|confirmed/i.test(context)
    
    codes.push({
      code,
      reward,
      reward_type: rewardType,
      is_verified: isVerified,
      source: new URL(sourceUrl).hostname,
      source_url: sourceUrl,
    })
  }
  
  return codes
}

// Scrape a single game
async function scrapeGame(gameSlug: string): Promise<{
  codes: ExtractedCode[]
  errors: string[]
}> {
  const config = SCRAPE_SOURCES[gameSlug]
  if (!config) {
    return { codes: [], errors: [`No scrape config for game: ${gameSlug}`] }
  }
  
  const allCodes: ExtractedCode[] = []
  const errors: string[] = []
  const seenCodes = new Set<string>()
  
  for (const url of config.urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WeLuxBot/1.0; +https://welux.deals)',
        },
        next: { revalidate: 0 }, // Don't cache
      })
      
      if (!response.ok) {
        errors.push(`Failed to fetch ${url}: ${response.status}`)
        continue
      }
      
      const html = await response.text()
      const codes = extractCodesFromContent(html, config.codePattern, url)
      
      for (const code of codes) {
        if (!seenCodes.has(code.code)) {
          seenCodes.add(code.code)
          allCodes.push(code)
        }
      }
    } catch (error) {
      errors.push(`Error scraping ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  return { codes: allCodes, errors }
}

// API route handler
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  // Verify authorization (simple API key check)
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.SCRAPE_API_KEY || process.env.CRON_SECRET
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { game, games } = body as { game?: string; games?: string[] }
    
    const gamesToScrape = games || (game ? [game] : Object.keys(SCRAPE_SOURCES))
    
    const results: Record<string, {
      codes_found: number
      codes_added: number
      errors: string[]
    }> = {}
    
    for (const gameSlug of gamesToScrape) {
      const config = SCRAPE_SOURCES[gameSlug]
      if (!config) {
        results[gameSlug] = { codes_found: 0, codes_added: 0, errors: [`Unknown game: ${gameSlug}`] }
        continue
      }
      
      // Ensure game exists in database
      let dbGame = await getGameBySlug(gameSlug)
      if (!dbGame) {
        dbGame = await upsertGame({
          slug: gameSlug,
          name: config.name,
          is_active: true,
        })
      }
      
      // Scrape codes
      const { codes, errors } = await scrapeGame(gameSlug)
      
      // Upsert codes to database
      let codesAdded = 0
      if (codes.length > 0) {
        const codesToUpsert = codes.map(c => ({
          game_id: dbGame!.id,
          code: c.code,
          reward: c.reward,
          reward_type: c.reward_type,
          is_verified: c.is_verified,
          source: c.source,
          source_url: c.source_url,
          is_active: true,
        }))
        
        const upserted = await bulkUpsertPromoCodes(codesToUpsert)
        codesAdded = upserted.length
      }
      
      // Log the scrape
      await logScrape({
        source: 'api_scrape',
        game_slug: gameSlug,
        codes_found: codes.length,
        codes_added: codesAdded,
        status: errors.length > 0 ? 'partial' : 'success',
        error_message: errors.length > 0 ? errors.join('; ') : undefined,
        duration_ms: Date.now() - startTime,
      })
      
      results[gameSlug] = {
        codes_found: codes.length,
        codes_added: codesAdded,
        errors,
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      duration_ms: Date.now() - startTime,
    })
    
  } catch (error) {
    console.error('Scrape error:', error)
    
    await logScrape({
      source: 'api_scrape',
      status: 'error',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: Date.now() - startTime,
    })
    
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET handler to check status and available games
export async function GET() {
  return NextResponse.json({
    available_games: Object.keys(SCRAPE_SOURCES),
    games: Object.entries(SCRAPE_SOURCES).map(([slug, config]) => ({
      slug,
      name: config.name,
      sources: config.urls.length,
    })),
  })
}
