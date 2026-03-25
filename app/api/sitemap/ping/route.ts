/**
 * Sitemap Ping API - Notifies search engines of sitemap updates
 * 
 * Usage:
 * - POST /api/sitemap/ping - Ping all search engines
 * - POST /api/sitemap/ping?engine=google - Ping specific engine
 * 
 * Can be called:
 * - Via Vercel Deploy Hook (recommended)
 * - Manually after major content updates
 * - Via cron job for periodic updates
 */

import { NextResponse } from 'next/server'

// Force dynamic to avoid build-time request.url issues
export const dynamic = "force-dynamic"

const BASE_URL = 'https://savesmart.bio'
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`

// Search engine ping endpoints
const SEARCH_ENGINES = {
  google: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  bing: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  // IndexNow for Bing, Yandex, Seznam, Naver (requires API key)
  // indexnow: `https://api.indexnow.org/indexnow?url=${encodeURIComponent(BASE_URL)}&key=YOUR_KEY`
}

interface PingResult {
  engine: string
  success: boolean
  status?: number
  message?: string
}

async function pingSearchEngine(engine: string, url: string): Promise<PingResult> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    return {
      engine,
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Sitemap ping successful' : `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      engine,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function POST(request: Request) {
  try {
    // Optional: Verify authorization for production
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.SITEMAP_PING_API_KEY
    
    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check for specific engine parameter
    const { searchParams } = new URL(request.url)
    const specificEngine = searchParams.get('engine')
    
    const results: PingResult[] = []
    
    if (specificEngine) {
      // Ping specific engine
      const engineKey = specificEngine.toLowerCase() as keyof typeof SEARCH_ENGINES
      if (SEARCH_ENGINES[engineKey]) {
        const result = await pingSearchEngine(specificEngine, SEARCH_ENGINES[engineKey])
        results.push(result)
      } else {
        return NextResponse.json(
          { error: `Unknown search engine: ${specificEngine}` },
          { status: 400 }
        )
      }
    } else {
      // Ping all search engines in parallel
      const pingPromises = Object.entries(SEARCH_ENGINES).map(
        ([engine, url]) => pingSearchEngine(engine, url)
      )
      const pingResults = await Promise.all(pingPromises)
      results.push(...pingResults)
    }
    
    const allSuccess = results.every(r => r.success)
    
    return NextResponse.json({
      success: allSuccess,
      timestamp: new Date().toISOString(),
      sitemap: SITEMAP_URL,
      results,
    }, {
      status: allSuccess ? 200 : 207, // 207 Multi-Status for partial success
    })
    
  } catch (error) {
    console.error('[sitemap-ping] Error:', error)
    return NextResponse.json(
      { error: 'Failed to ping search engines' },
      { status: 500 }
    )
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    sitemap: SITEMAP_URL,
    engines: Object.keys(SEARCH_ENGINES),
    usage: 'POST /api/sitemap/ping to notify search engines',
  })
}
