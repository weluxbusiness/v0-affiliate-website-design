/**
 * API Route: Ping Google Sitemap
 * POST /api/ping-sitemap
 * 
 * Call this endpoint after deployment to notify Google of sitemap updates.
 * Can be integrated with Vercel deployment hooks.
 */

import { NextResponse } from 'next/server'
import { pingGoogleSitemap, pingAllSitemaps } from '@/lib/seo/google-ping'

export const runtime = 'edge'
export const revalidate = 0

export async function POST(request: Request) {
  try {
    // Check for optional API key protection
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.SITEMAP_PING_API_KEY
    
    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Ping Google for sitemap update
    const result = await pingGoogleSitemap()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[api/ping-sitemap] Error:', error)
    return NextResponse.json(
      { error: 'Failed to ping sitemap' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Ping all sitemaps
    const results = await pingAllSitemaps()
    
    return NextResponse.json({
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[api/ping-sitemap] Error:', error)
    return NextResponse.json(
      { error: 'Failed to ping sitemaps' },
      { status: 500 }
    )
  }
}
