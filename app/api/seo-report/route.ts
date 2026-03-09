/**
 * SEO Report API
 * Generates a comprehensive SEO health report for the site
 * Usage: GET /api/seo-report
 */

import { NextResponse } from 'next/server'
import { generateSEOReport, calculateMaxPageCount } from '@/lib/seo/path-generator'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const [report, maxPages] = await Promise.all([
      generateSEOReport(),
      calculateMaxPageCount(),
    ])
    
    return NextResponse.json({
      success: true,
      report,
      theoreticalMax: maxPages,
      summary: {
        totalGeneratedPaths: report.totalPages,
        theoreticalMaximum: maxPages.total,
        sitemapCoverage: `${report.sitemapCoverage.percentage.toFixed(1)}%`,
        crawlDepth: report.crawlDepthAnalysis,
        recommendations: report.recommendations,
      },
    })
  } catch (error) {
    console.error('[v0] SEO Report generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate SEO report' },
      { status: 500 }
    )
  }
}
