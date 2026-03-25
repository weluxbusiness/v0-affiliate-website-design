import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, incrementCodeUses } from '@/lib/gaming-db'
import { createHash } from 'crypto'

// Force dynamic to avoid build-time request.url issues
export const dynamic = "force-dynamic"

// Helper to hash IP for privacy
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + process.env.IP_HASH_SALT || 'welux-salt').digest('hex').slice(0, 16)
}

// Detect country from headers (Vercel provides this)
function getCountry(request: NextRequest): string | undefined {
  return request.headers.get('x-vercel-ip-country') || undefined
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      event_type, 
      game_id, 
      promo_code_id, 
      code, 
      page_slug 
    } = body as {
      event_type: 'code_copy' | 'code_click' | 'page_view' | 'affiliate_click'
      game_id?: string
      promo_code_id?: string
      code?: string
      page_slug?: string
    }
    
    // Validate event type
    const validEvents = ['code_copy', 'code_click', 'page_view', 'affiliate_click']
    if (!validEvents.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }
    
    // Get user info for analytics (privacy-preserving)
    const userAgent = request.headers.get('user-agent') || undefined
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIP || 'unknown'
    const ipHash = hashIP(ip)
    const country = getCountry(request)
    
    // Track the event
    await trackEvent({
      event_type,
      game_id,
      promo_code_id,
      code,
      page_slug,
      user_agent: userAgent?.slice(0, 255), // Limit length
      ip_hash: ipHash,
      country,
    })
    
    // If this is a code copy event, increment the uses count
    if (event_type === 'code_copy' && promo_code_id) {
      await incrementCodeUses(promo_code_id)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Analytics error:', error)
    // Don't fail the request - analytics should be non-blocking
    return NextResponse.json({ success: false })
  }
}

// GET endpoint for fetching analytics (admin only)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.ADMIN_API_KEY || process.env.CRON_SECRET
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '7')
    const gameSlug = url.searchParams.get('game')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Get event counts
    let query = supabase
      .from('gaming_analytics')
      .select('event_type, created_at')
      .gte('created_at', startDate.toISOString())
    
    if (gameSlug) {
      // Join with games to filter by slug
      const { data: game } = await supabase
        .from('games')
        .select('id')
        .eq('slug', gameSlug)
        .single()
      
      if (game) {
        query = query.eq('game_id', game.id)
      }
    }
    
    const { data: events, error } = await query
    
    if (error) throw error
    
    // Aggregate by event type
    const summary = {
      total_events: events?.length || 0,
      code_copies: events?.filter(e => e.event_type === 'code_copy').length || 0,
      code_clicks: events?.filter(e => e.event_type === 'code_click').length || 0,
      page_views: events?.filter(e => e.event_type === 'page_view').length || 0,
      affiliate_clicks: events?.filter(e => e.event_type === 'affiliate_click').length || 0,
      period_days: days,
    }
    
    // Get top codes by copies
    const { data: topCodes } = await supabase
      .from('promo_codes')
      .select(`
        code,
        uses_count,
        games(name, slug)
      `)
      .order('uses_count', { ascending: false })
      .limit(10)
    
    return NextResponse.json({
      summary,
      top_codes: topCodes || [],
    })
    
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
