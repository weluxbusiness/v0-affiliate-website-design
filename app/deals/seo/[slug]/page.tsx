import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealPageTemplate } from "@/components/seo/deal-page-template"
import { 
  parseDealSlug, 
  formatDisplayName,
  generateAllDealPageParams,
  getInternalLinks,
  priceRanges
} from "@/data/deal-pages"
import { getDealsUnderPrice, getDealsByBrand } from "@/lib/deals"

// Revalidate every hour for fresh deals
export const revalidate = 3600

// Generate static params for all brand × price and category × price combinations
export async function generateStaticParams() {
  // For build performance, generate a subset of pages statically
  // The rest will be generated on-demand with ISR
  const allParams = generateAllDealPageParams()
  
  // Prioritize popular combinations for static generation
  const priorityParams = allParams.filter(({ slug }) => {
    // Prioritize popular brands
    const popularBrands = ['amazon', 'walmart', 'target', 'best-buy', 'nike', 'apple', 'samsung']
    const popularCategories = ['laptops', 'headphones', 'sneakers', 'tvs', 'smartphones']
    const popularPrices = [50, 100, 200, 500]
    
    for (const brand of popularBrands) {
      for (const price of popularPrices) {
        if (slug === `${brand}-under-${price}`) return true
      }
    }
    for (const category of popularCategories) {
      for (const price of popularPrices) {
        if (slug === `${category}-under-${price}`) return true
      }
    }
    return false
  })
  
  return priorityParams
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseDealSlug(slug)
  
  if (!parsed) {
    return {
      title: "Deals | SaveSmart",
      description: "Find the best deals and save money on your favorite products."
    }
  }
  
  const { type, displayName, price, entity } = parsed
  const currentYear = new Date().getFullYear()
  
  const title = type === 'brand'
    ? `Best ${displayName} Deals Under $${price} (${currentYear}) | SaveSmart`
    : `Best ${displayName} Deals Under $${price} - Compare Prices | SaveSmart`
  
  const description = type === 'brand'
    ? `Find the best ${displayName} deals under $${price}. Save money with verified discounts, coupons, and offers from top retailers. Updated daily.`
    : `Compare ${displayName.toLowerCase()} deals under $${price} from Amazon, Best Buy, Target & more. Find the lowest prices and save big today.`
  
  return {
    title,
    description,
    keywords: [
      `${displayName.toLowerCase()} deals`,
      `${displayName.toLowerCase()} under $${price}`,
      `best ${displayName.toLowerCase()} deals`,
      `cheap ${displayName.toLowerCase()}`,
      `${displayName.toLowerCase()} sale`,
      `${displayName.toLowerCase()} discounts`,
      `${displayName.toLowerCase()} coupons`,
    ],
    openGraph: {
      title: `${displayName} Deals Under $${price} | SaveSmart`,
      description: `Find the best ${displayName.toLowerCase()} deals under $${price}. Compare prices and save money.`,
      url: `https://savesmart.bio/deals/seo/${slug}`,
      type: "website",
      siteName: "SaveSmart",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} Deals Under $${price}`,
      description: `Save on ${displayName.toLowerCase()} - deals under $${price} from top retailers.`,
    },
    alternates: {
      canonical: `/deals/seo/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function DealSeoPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseDealSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const { type, entity, price, displayName } = parsed
  
  // Fetch deals based on type
  let deals
  if (type === 'brand') {
    // For brands, search by brand name with price filter
    const brandDeals = await getDealsByBrand(entity.replace(/-/g, ' '), 100)
    deals = brandDeals.filter(d => d.deal_price && d.deal_price <= price)
  } else {
    // For categories, use the dedicated function
    deals = await getDealsUnderPrice(price, entity.replace(/-/g, ' '), undefined, 50)
  }
  
  // Get comprehensive internal links
  const internalLinks = getInternalLinks(type, entity, price)
  
  // Generate price filter links (including current price for active state)
  const relatedPriceLinks = [
    { href: `/deals/seo/${entity}-under-${price}`, label: `Under $${price}` },
    ...internalLinks.nearbyPrices.map(p => ({
      href: `/deals/seo/${p.slug}`,
      label: p.label
    }))
  ].sort((a, b) => {
    const priceA = parseInt(a.label.replace(/[^0-9]/g, ''))
    const priceB = parseInt(b.label.replace(/[^0-9]/g, ''))
    return priceA - priceB
  })
  
  // Same-type related links (brands for brands, categories for categories)
  const relatedEntityLinks = type === 'brand'
    ? internalLinks.relatedBrands.map(b => ({
        href: `/deals/seo/${b.slug}`,
        label: b.label
      }))
    : internalLinks.relatedCategories.map(c => ({
        href: `/deals/seo/${c.slug}`,
        label: c.label
      }))
  
  // Cross-type links (categories for brands, brands for categories)
  const crossLinks = internalLinks.crossLinks.map(c => ({
    href: `/deals/seo/${c.slug}`,
    label: c.label
  }))
  
  // Store links
  const storeLinks = [
    { href: '/deals/store/amazon', label: 'Amazon' },
    { href: '/deals/store/walmart', label: 'Walmart' },
    { href: '/deals/store/target', label: 'Target' },
    { href: '/deals/store/best-buy', label: 'Best Buy' },
  ]
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <DealPageTemplate
        parsed={parsed}
        deals={deals}
        relatedPriceLinks={relatedPriceLinks}
        relatedEntityLinks={relatedEntityLinks}
        crossLinks={crossLinks}
        storeLinks={storeLinks}
      />
      
      <Footer />
    </div>
  )
}
