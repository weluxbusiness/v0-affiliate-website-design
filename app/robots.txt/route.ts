/**
 * Dynamic robots.txt route
 * Serves environment-aware robots.txt for search engine crawlers
 * 
 * Benefits over static file:
 * - Environment-specific rules (block crawling on preview/dev)
 * - Dynamic sitemap references
 * - Centralized configuration
 */

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate daily

// Base URL - use environment variable or fallback
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://savesmart.bio'

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production' && 
  !process.env.VERCEL_ENV?.includes('preview')

export async function GET() {
  const robotsTxt = generateRobotsTxt()
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}

function generateRobotsTxt(): string {
  // Block all crawling on non-production environments
  if (!isProduction) {
    return `# Robots.txt - Non-production environment
# Blocking all crawlers to prevent indexing of preview/dev content

User-agent: *
Disallow: /
`
  }

  // Production robots.txt
  return `# SaveSmart Robots.txt
# Dynamic robots.txt for programmatic SEO at scale
# Generated: ${new Date().toISOString().split('T')[0]}

# ===========================================
# DEFAULT RULES (All Crawlers)
# ===========================================
User-agent: *
Allow: /

# Block API routes and internal paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /account/
Disallow: /dashboard/
Disallow: /alerts/
Disallow: /settings/

# Block query parameters (prevent duplicate content)
Disallow: /*?*
Disallow: /*&*

# Block error pages
Disallow: /404
Disallow: /500

# ===========================================
# SITEMAP LOCATION
# ===========================================
Sitemap: ${BASE_URL}/sitemap.xml

# ===========================================
# CRAWLER-SPECIFIC RULES
# ===========================================

# Googlebot - Full access, no delay
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bingbot - Full access with slight delay
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Google Image Bot
User-agent: Googlebot-Image
Allow: /

# GPTBot (OpenAI) - Allow for AI search
User-agent: GPTBot
Allow: /

# ClaudeBot (Anthropic) - Allow for AI search
User-agent: ClaudeBot
Allow: /

# ChatGPT-User (OpenAI browsing)
User-agent: ChatGPT-User
Allow: /

# PerplexityBot - Allow for AI search
User-agent: PerplexityBot
Allow: /

# ===========================================
# RATE-LIMITED BOTS (SEO Tools)
# ===========================================
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: DotBot
Crawl-delay: 10

# ===========================================
# BLOCKED BOTS (Aggressive/Unwanted)
# ===========================================
User-agent: MJ12bot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: Bytespider
Disallow: /
`
}
