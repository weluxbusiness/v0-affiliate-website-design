import { NextResponse } from 'next/server'

// This endpoint should be called by Vercel Cron Jobs
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/discover-deals", "schedule": "0 */6 * * *" }] }

export const maxDuration = 60

// Verify the request is from Vercel Cron
function isValidCronRequest(req: Request): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Allow if CRON_SECRET is set and matches, or if called from localhost for testing
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true
  }
  
  // Also check for Vercel's cron verification header
  const vercelCronHeader = req.headers.get('x-vercel-cron')
  if (vercelCronHeader) {
    return true
  }

  return false
}

export async function GET(req: Request) {
  // Verify the request is legitimate
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const discoveryApiKey = process.env.DEAL_DISCOVERY_API_KEY

  if (!discoveryApiKey) {
    return NextResponse.json({ error: 'DEAL_DISCOVERY_API_KEY not configured' }, { status: 500 })
  }

  const categories = ['Electronics', 'Fashion', 'Home & Kitchen']
  const results: Array<{ category: string; status: string; inserted?: number; error?: string }> = []

  // Discover deals for each category
  for (const category of categories) {
    try {
      const response = await fetch(`${baseUrl}/api/discover-deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${discoveryApiKey}`,
        },
        body: JSON.stringify({ category }),
      })

      if (!response.ok) {
        results.push({ 
          category, 
          status: 'error', 
          error: `HTTP ${response.status}` 
        })
        continue
      }

      const data = await response.json()
      results.push({ 
        category, 
        status: 'success', 
        inserted: data.inserted || 0 
      })
    } catch (error) {
      results.push({ 
        category, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  const totalInserted = results.reduce((sum, r) => sum + (r.inserted || 0), 0)
  
  return NextResponse.json({
    message: `Deal discovery complete. Inserted ${totalInserted} new deals.`,
    timestamp: new Date().toISOString(),
    results,
  })
}
