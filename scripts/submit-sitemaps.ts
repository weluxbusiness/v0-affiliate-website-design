/**
 * Sitemap Submission Script
 * 
 * Run after deployment to notify search engines of sitemap updates.
 * Can be executed via:
 * - npx ts-node scripts/submit-sitemaps.ts
 * - Vercel Deploy Hook
 * - GitHub Actions
 * 
 * Usage:
 *   SITE_URL=https://savesmart.bio npx ts-node scripts/submit-sitemaps.ts
 */

const SITE_URL = process.env.SITE_URL || 'https://savesmart.bio'
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

interface SearchEngine {
  name: string
  pingUrl: string
  method: 'GET' | 'POST'
}

const SEARCH_ENGINES: SearchEngine[] = [
  {
    name: 'Google',
    pingUrl: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET',
  },
  {
    name: 'Bing',
    pingUrl: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET',
  },
]

async function pingSearchEngine(engine: SearchEngine): Promise<{
  engine: string
  success: boolean
  status?: number
  error?: string
}> {
  try {
    const response = await fetch(engine.pingUrl, {
      method: engine.method,
    })
    
    return {
      engine: engine.name,
      success: response.ok,
      status: response.status,
    }
  } catch (error) {
    return {
      engine: engine.name,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function main() {
  console.log('========================================')
  console.log('Sitemap Submission Script')
  console.log('========================================')
  console.log(`Sitemap URL: ${SITEMAP_URL}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log('')
  
  const results = await Promise.all(
    SEARCH_ENGINES.map(engine => pingSearchEngine(engine))
  )
  
  console.log('Results:')
  console.log('--------')
  
  let allSuccess = true
  for (const result of results) {
    const status = result.success ? 'SUCCESS' : 'FAILED'
    const details = result.error || `HTTP ${result.status}`
    console.log(`${result.engine}: ${status} (${details})`)
    
    if (!result.success) {
      allSuccess = false
    }
  }
  
  console.log('')
  console.log('========================================')
  
  if (allSuccess) {
    console.log('All search engines notified successfully!')
    process.exit(0)
  } else {
    console.log('Some notifications failed. Check logs above.')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
