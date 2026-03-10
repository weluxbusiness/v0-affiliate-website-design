import "server-only"

import { createAnonClient } from "@/lib/supabase/anon"
import { getCategorySlugs, getStoreSlugs, getBrandSlugs } from "@/lib/seo-data"

// Pagination sitemap generator
// Exposes all paginated deal pages to search engines (page 2+)
// Supports scaling to 100k+ pages

const baseUrl = 'https://savesmart.bio'
const DEALS_PER_PAGE = 24
const MAX_URLS_PER_SITEMAP = 50000

interface PaginationUrl {
  loc: string
  lastmod: string
}

// Get deal count for a category
async function getCategoryDealCount(category: string): Promise<number> {
  const supabase = createAnonClient()
  
  const { count, error } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .ilike("category", `%${category}%`)
  
  if (error) {
    console.error(`Error counting ${category} deals:`, error)
    return 0
  }
  
  return count || 0
}

// Get deal count for a store
async function getStoreDealCount(store: string): Promise<number> {
  const supabase = createAnonClient()
  
  // Convert slug to search term
  const searchTerm = store.replace(/-/g, ' ')
  
  const { count, error } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .ilike("store", `%${searchTerm}%`)
  
  if (error) {
    console.error(`Error counting ${store} deals:`, error)
    return 0
  }
  
  return count || 0
}

// Get deal count for a brand
async function getBrandDealCount(brand: string): Promise<number> {
  const supabase = createAnonClient()
  
  const { count, error } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .or(`store.ilike.%${brand}%,title.ilike.%${brand}%,description.ilike.%${brand}%`)
  
  if (error) {
    console.error(`Error counting ${brand} deals:`, error)
    return 0
  }
  
  return count || 0
}

// Generate pagination URLs for a given base path and total deal count
function generatePaginationUrls(basePath: string, totalDeals: number, lastmod: string): PaginationUrl[] {
  const totalPages = Math.ceil(totalDeals / DEALS_PER_PAGE)
  
  // Only generate pages 2+ (page 1 is the base URL)
  if (totalPages <= 1) return []
  
  return Array.from({ length: totalPages - 1 }).map((_, i) => ({
    loc: `${baseUrl}${basePath}/page/${i + 2}`,
    lastmod,
  }))
}

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  const allUrls: PaginationUrl[] = []
  
  // Get all slugs
  const [categories, stores, brands] = await Promise.all([
    getCategorySlugs(),
    getStoreSlugs(),
    getBrandSlugs(),
  ])
  
  // Generate category pagination URLs
  for (const category of categories) {
    const dealCount = await getCategoryDealCount(category)
    const urls = generatePaginationUrls(`/deals/${category}`, dealCount, now)
    allUrls.push(...urls)
  }
  
  // Generate store pagination URLs
  for (const store of stores) {
    const dealCount = await getStoreDealCount(store)
    const urls = generatePaginationUrls(`/stores/${store}`, dealCount, now)
    allUrls.push(...urls)
  }
  
  // Generate brand pagination URLs
  for (const brand of brands) {
    const dealCount = await getBrandDealCount(brand)
    const urls = generatePaginationUrls(`/brands/${brand}`, dealCount, now)
    allUrls.push(...urls)
  }
  
  // Enforce sitemap limit (should split if > 50k URLs)
  const limitedUrls = allUrls.slice(0, MAX_URLS_PER_SITEMAP)
  
  // Return valid empty sitemap if no pagination URLs exist
  // This prevents 404 errors in logs while keeping sitemap system clean
  if (limitedUrls.length === 0) {
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
  
  // Generate valid XML with proper formatting
  const urlEntries = limitedUrls.map(({ loc, lastmod }) => 
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.6</priority>\n  </url>`
  ).join('\n')
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600
