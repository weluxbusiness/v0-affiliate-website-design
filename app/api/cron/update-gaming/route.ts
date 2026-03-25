import { NextRequest, NextResponse } from 'next/server'
import { getGames, logScrape } from '@/lib/gaming-db'

// Vercel Cron configuration
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes max

// Games to scrape in each run (rotate through them)
const GAMES_PER_RUN = 3
const SCRAPE_SOURCES = [
  'roblox',
  'genshin-impact', 
  'honkai-star-rail',
  'fortnite',
  'pokemon-go',
  'clash-of-clans',
  'pubg-mobile',
  'call-of-duty-mobile',
  'brawl-stars',
  'candy-crush',
]

// Get which games to scrape based on current hour
function getGamesToScrape(): string[] {
  const hour = new Date().getUTCHours()
  const startIndex = (hour % Math.ceil(SCRAPE_SOURCES.length / GAMES_PER_RUN)) * GAMES_PER_RUN
  return SCRAPE_SOURCES.slice(startIndex, startIndex + GAMES_PER_RUN)
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Allow Vercel cron requests (they come with the secret in headers)
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    // Also check for Vercel's internal cron header
    const vercelCron = request.headers.get('x-vercel-cron')
    if (vercelCron !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  const results: Record<string, {
    success: boolean
    codes_found?: number
    codes_added?: number
    error?: string
  }> = {}
  
  try {
    const gamesToScrape = getGamesToScrape()
    console.log(`[Cron] Starting gaming update for games: ${gamesToScrape.join(', ')}`)
    
    // Call the scraper API for each game
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    for (const gameSlug of gamesToScrape) {
      try {
        const response = await fetch(`${baseUrl}/api/scrape/gaming`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cronSecret}`,
          },
          body: JSON.stringify({ game: gameSlug }),
        })
        
        if (!response.ok) {
          throw new Error(`Scrape failed with status ${response.status}`)
        }
        
        const data = await response.json()
        const gameResult = data.results?.[gameSlug]
        
        results[gameSlug] = {
          success: true,
          codes_found: gameResult?.codes_found || 0,
          codes_added: gameResult?.codes_added || 0,
        }
        
      } catch (error) {
        results[gameSlug] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    }
    
    // Generate AI content for games that were scraped (limit to avoid timeout)
    const successfulGames = gamesToScrape.filter(g => results[g]?.success)
    
    if (successfulGames.length > 0 && process.env.OPENAI_API_KEY) {
      // Only regenerate content for the first game to avoid timeout
      const gameToUpdate = successfulGames[0]
      
      try {
        const contentResponse = await fetch(`${baseUrl}/api/ai/generate-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cronSecret}`,
          },
          body: JSON.stringify({ type: 'game', gameSlug: gameToUpdate }),
        })
        
        if (contentResponse.ok) {
          console.log(`[Cron] Generated content for ${gameToUpdate}`)
        }
      } catch (error) {
        console.error(`[Cron] Content generation failed for ${gameToUpdate}:`, error)
      }
    }
    
    // Log the cron run
    const totalCodesFound = Object.values(results).reduce((sum, r) => sum + (r.codes_found || 0), 0)
    const totalCodesAdded = Object.values(results).reduce((sum, r) => sum + (r.codes_added || 0), 0)
    
    await logScrape({
      source: 'cron_update',
      codes_found: totalCodesFound,
      codes_added: totalCodesAdded,
      status: Object.values(results).every(r => r.success) ? 'success' : 'partial',
      duration_ms: Date.now() - startTime,
    })
    
    return NextResponse.json({
      success: true,
      games_scraped: gamesToScrape,
      results,
      duration_ms: Date.now() - startTime,
    })
    
  } catch (error) {
    console.error('[Cron] Update failed:', error)
    
    await logScrape({
      source: 'cron_update',
      status: 'error',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: Date.now() - startTime,
    })
    
    return NextResponse.json(
      { error: 'Cron update failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
