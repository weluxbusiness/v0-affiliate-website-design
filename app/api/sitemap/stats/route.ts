/**
 * Sitemap Statistics API
 * Returns information about all sitemaps and URL counts
 * Useful for monitoring and Google Search Console verification
 */

import { NextResponse } from 'next/server'
import { getDealSeoSitemapStats, generateAllDealSeoUrls } from '@/app/sitemap-deal-seo.xml/route'

const BASE_URL = 'https://savesmart.bio'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const dealSeoStats = getDealSeoSitemapStats()
  
  // Calculate approximate totals for other sitemaps
  // These would ideally come from actual sitemap generators
  const estimatedCounts = {
    pages: 10,           // Static pages
    categories: 50,      // Category pages
    brands: 200,         // Brand pages
    stores: 100,         // Store pages
    cities: 500,         // City pages
    price: 20,           // Price range pages
    guides: 30,          // Buying guides
    comparisons: 100,    // Comparison pages
    dealFinder: 50,      // Deal finder pages
    trending: 20,        // Trending pages
    programmatic: 2000,  // Other programmatic pages
  }
  
  const baseTotalUrls = Object.values(estimatedCounts).reduce((a, b) => a + b, 0)
  const totalUrls = baseTotalUrls + dealSeoStats.total
  
  return NextResponse.json({
    summary: {
      totalUrls,
      totalSitemaps: 12 + (dealSeoStats.sitemapCount > 1 ? dealSeoStats.sitemapCount : 0),
      lastUpdated: new Date().toISOString(),
    },
    sitemapIndex: `${BASE_URL}/sitemap.xml`,
    sitemaps: [
      { name: 'pages', url: `${BASE_URL}/sitemap-pages.xml`, estimatedUrls: estimatedCounts.pages },
      { name: 'categories', url: `${BASE_URL}/sitemap-categories.xml`, estimatedUrls: estimatedCounts.categories },
      { name: 'brands', url: `${BASE_URL}/sitemap-brands.xml`, estimatedUrls: estimatedCounts.brands },
      { name: 'stores', url: `${BASE_URL}/sitemap-stores.xml`, estimatedUrls: estimatedCounts.stores },
      { name: 'cities', url: `${BASE_URL}/sitemap-cities.xml`, estimatedUrls: estimatedCounts.cities },
      { name: 'price', url: `${BASE_URL}/sitemap-price.xml`, estimatedUrls: estimatedCounts.price },
      { name: 'guides', url: `${BASE_URL}/sitemap-guides.xml`, estimatedUrls: estimatedCounts.guides },
      { name: 'comparisons', url: `${BASE_URL}/sitemap-comparisons.xml`, estimatedUrls: estimatedCounts.comparisons },
      { name: 'deal-finder', url: `${BASE_URL}/sitemap-deal-finder.xml`, estimatedUrls: estimatedCounts.dealFinder },
      { name: 'trending', url: `${BASE_URL}/sitemap-trending.xml`, estimatedUrls: estimatedCounts.trending },
      { name: 'programmatic', url: `${BASE_URL}/sitemap-programmatic.xml`, estimatedUrls: estimatedCounts.programmatic },
      { 
        name: 'deal-seo', 
        url: `${BASE_URL}/sitemap-deal-seo.xml`, 
        urls: dealSeoStats.total,
        breakdown: {
          brandPages: dealSeoStats.brandPages,
          categoryPages: dealSeoStats.categoryPages,
          brands: dealSeoStats.brands,
          categories: dealSeoStats.categories,
          priceRanges: dealSeoStats.priceRanges,
        },
        subSitemaps: dealSeoStats.sitemapCount > 1 
          ? Array.from({ length: dealSeoStats.sitemapCount }, (_, i) => ({
              page: i + 1,
              url: `${BASE_URL}/sitemaps/deal-seo/${i + 1}`,
              maxUrls: dealSeoStats.maxPerSitemap,
            }))
          : null,
      },
    ],
    googleSearchConsole: {
      submitUrl: 'https://search.google.com/search-console/sitemaps',
      sitemapToSubmit: `${BASE_URL}/sitemap.xml`,
      verificationMethods: [
        'HTML file upload',
        'HTML tag',
        'Google Analytics',
        'Google Tag Manager',
        'Domain name provider',
      ],
    },
    bingWebmaster: {
      submitUrl: 'https://www.bing.com/webmasters/sitemaps',
      sitemapToSubmit: `${BASE_URL}/sitemap.xml`,
    },
    pingEndpoint: `${BASE_URL}/api/sitemap/ping`,
  })
}
