/**
 * Google Sitemap Ping Utility
 * 
 * Notifies Google that the sitemap has been updated.
 * Should be called when:
 * - A new deal is inserted
 * - A deal is updated
 * - Any significant content change occurs
 * 
 * Note: Google has deprecated the ping endpoint but it may still work.
 * The primary indexing method should be through Google Search Console API
 * or the Indexing API for eligible content types.
 */

const SITEMAP_URL = "https://savesmart.bio/sitemap.xml"

export async function pingGoogleSitemap(): Promise<{ success: boolean; message: string }> {
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    
    const response = await fetch(pingUrl, {
      method: "GET",
      headers: {
        "User-Agent": "SaveSmart/1.0 (+https://savesmart.bio)",
      },
    })

    if (response.ok) {
      console.log("[SEO] Google sitemap ping successful")
      return { success: true, message: "Google sitemap ping successful" }
    } else {
      console.warn(`[SEO] Google sitemap ping returned status: ${response.status}`)
      return { success: false, message: `Ping returned status ${response.status}` }
    }
  } catch (error) {
    console.error("[SEO] Error pinging Google sitemap:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}

/**
 * Ping multiple search engines about sitemap updates
 */
export async function pingSearchEngines(): Promise<{ 
  google: { success: boolean; message: string }
  bing: { success: boolean; message: string }
}> {
  const results = await Promise.all([
    pingGoogleSitemap(),
    pingBingSitemap(),
  ])

  return {
    google: results[0],
    bing: results[1],
  }
}

/**
 * Ping Bing/IndexNow about sitemap updates
 */
async function pingBingSitemap(): Promise<{ success: boolean; message: string }> {
  try {
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    
    const response = await fetch(pingUrl, {
      method: "GET",
      headers: {
        "User-Agent": "SaveSmart/1.0 (+https://savesmart.bio)",
      },
    })

    if (response.ok) {
      console.log("[SEO] Bing sitemap ping successful")
      return { success: true, message: "Bing sitemap ping successful" }
    } else {
      console.warn(`[SEO] Bing sitemap ping returned status: ${response.status}`)
      return { success: false, message: `Ping returned status ${response.status}` }
    }
  } catch (error) {
    console.error("[SEO] Error pinging Bing sitemap:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}
