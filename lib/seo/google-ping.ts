/**
 * Google Sitemap Ping Automation
 * Notifies Google when sitemap is updated
 */

const GOOGLE_PING_URL = 'https://www.google.com/ping'
const SITEMAP_URL = 'https://savesmart.bio/sitemap-quality.xml'

/**
 * Ping Google to notify of sitemap update
 * Call this after deployment or sitemap regeneration
 */
export async function pingGoogleSitemap(): Promise<{ success: boolean; message: string }> {
  try {
    const pingUrl = `${GOOGLE_PING_URL}?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'SaveSmart-Sitemap-Ping/1.0',
      },
    })
    
    if (response.ok) {
      console.log(`[google-ping] Successfully pinged Google: ${SITEMAP_URL}`)
      return { 
        success: true, 
        message: `Sitemap ping successful: ${SITEMAP_URL}` 
      }
    } else {
      console.error(`[google-ping] Failed to ping Google: ${response.status}`)
      return { 
        success: false, 
        message: `Ping failed with status: ${response.status}` 
      }
    }
  } catch (error) {
    console.error('[google-ping] Error pinging Google:', error)
    return { 
      success: false, 
      message: `Ping error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}

/**
 * Get all sitemaps to ping
 */
export function getSitemapUrls(): string[] {
  return [
    'https://savesmart.bio/sitemap-quality.xml',
    'https://savesmart.bio/sitemap-gaming.xml',
    'https://savesmart.bio/sitemap.xml',
  ]
}

/**
 * Ping Google for all sitemaps
 */
export async function pingAllSitemaps(): Promise<{ url: string; success: boolean }[]> {
  const sitemaps = getSitemapUrls()
  const results: { url: string; success: boolean }[] = []
  
  for (const sitemap of sitemaps) {
    try {
      const pingUrl = `${GOOGLE_PING_URL}?sitemap=${encodeURIComponent(sitemap)}`
      const response = await fetch(pingUrl, { method: 'GET' })
      results.push({ url: sitemap, success: response.ok })
      console.log(`[google-ping] ${sitemap}: ${response.ok ? 'OK' : 'FAILED'}`)
    } catch {
      results.push({ url: sitemap, success: false })
    }
  }
  
  return results
}
