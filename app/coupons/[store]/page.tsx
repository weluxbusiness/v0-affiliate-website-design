import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer } from "@/components/layout/page-container"
import { getDealsByStore } from "@/lib/deals"
import { getStoreInfo, formatStoreName } from "@/lib/deal-types"
import { 
  SeoContentBlock, 
  generateStoreSeoContent, 
  getStoreRelatedLinks,
  generateCouponSeoContent,
  getCouponRelatedLinks 
} from "@/components/seo-content-block"
import { InternalLinks, CrossLinkSection } from "@/components/internal-links"
import { 
  getStoreBySlug, 
  getCouponsByStore, 
  getStoreSlugs,
  getCategoriesForStore,
  type Coupon 
} from "@/lib/seo-data"
import { Ticket, Clock, CheckCircle, Copy, ExternalLink, Percent, Tag } from "lucide-react"

interface PageProps {
  params: Promise<{ store: string }>
}

// Fallback store list for SSG when DB is empty
const FALLBACK_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
  'home-depot', 'lowes', 'wayfair', 'ikea', 'sephora', 'ulta',
  'gap', 'old-navy', 'banana-republic', 'jcrew', 'anthropologie',
  'urban-outfitters', 'asos', 'zappos', 'footlocker', 'dicks-sporting-goods',
  'rei', 'patagonia', 'the-north-face', 'columbia', 'under-armour',
  'puma', 'new-balance', 'converse', 'vans', 'timberland',
  'samsung', 'dell', 'hp', 'lenovo', 'microsoft', 'sony',
  'bose', 'beats', 'jbl', 'lg', 'tcl', 'hisense', 'vizio'
]

// Dynamic params from database with fallback
export async function generateStaticParams() {
  const storeSlugs = await getStoreSlugs()
  const slugs = storeSlugs.length > 0 ? storeSlugs : FALLBACK_STORES
  return slugs.map(store => ({ store }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store } = await params
  const storeName = formatStoreName(store)
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  
  return {
    title: `${storeName} Coupons & Promo Codes - ${currentMonth} ${currentYear} | SaveSmart`,
    description: `Get ${storeName} coupon codes, promo codes & discounts for ${currentMonth} ${currentYear}. Save up to 70% with verified ${storeName} coupons. Updated daily.`,
    openGraph: {
      title: `${storeName} Coupons & Promo Codes - ${currentMonth} ${currentYear}`,
      description: `Get ${storeName} coupon codes and promo codes. Save up to 70% with verified ${storeName} coupons. Free shipping codes available.`,
      type: 'website',
      url: `https://savesmart.bio/coupons/${store}`,
    },
    alternates: {
      canonical: `/coupons/${store}`,
    },
    keywords: [
      `${storeName} coupon codes`,
      `${storeName} promo codes`,
      `${storeName} discount codes`,
      `${storeName} coupons ${currentMonth} ${currentYear}`,
      `${storeName} free shipping`,
      `${storeName} deals`,
    ],
  }
}

export const revalidate = 3600

export default async function StoreCouponsPage({ params }: PageProps) {
  const { store } = await params
  
  // Fetch store data from Supabase
  const storeData = await getStoreBySlug(store)
  const storeName = storeData?.name || formatStoreName(store)
  
  // Fetch coupons from coupons table
  const coupons = await getCouponsByStore(store, 50)
  
  // Also fetch deals from deals table for additional offers
  const deals = await getDealsByStore(store, 50)
  
  // Get categories available for this store
  const storeCategories = await getCategoriesForStore(store, 10)
  
  // If no coupons AND no deals, show 404
  if (coupons.length === 0 && deals.length === 0) {
    notFound()
  }

  const storeInfo = storeData ? {
    rating: storeData.rating,
    reviewCount: storeData.review_count,
    color: storeData.color || 'from-blue-600 to-blue-700',
  } : getStoreInfo(storeName)
  
  // Separate deals with coupon codes from regular deals
  const couponsWithCodes = deals.filter(d => d.coupon_code)
  const dealsWithoutCodes = deals.filter(d => !d.coupon_code)
  
  // Total coupon count (from coupons table + deals with codes)
  const totalCoupons = coupons.length + couponsWithCodes.length
  
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Structured data for SEO - Store with offers
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeName,
    url: `https://savesmart.bio/coupons/${store}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: storeInfo.rating,
      reviewCount: storeInfo.reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: deals.length,
      lowPrice: Math.min(...deals.map(d => d.deal_price)),
      highPrice: Math.max(...deals.map(d => d.deal_price)),
      priceCurrency: "USD",
    },
  }

  // FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I use a ${storeName} coupon code?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To use a ${storeName} coupon code: 1) Copy the code from SaveSmart, 2) Add items to your cart on ${storeName}'s website, 3) At checkout, paste the code in the promo code field, 4) Click "Apply" to see your discount. Some codes apply automatically when you click our links.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${storeName} offer free shipping?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, ${storeName} frequently offers free shipping promotions. We track and list all current free shipping codes and thresholds. Some codes provide free shipping on any order, while others require a minimum purchase.`,
        },
      },
      {
        "@type": "Question",
        name: `How often are ${storeName} coupons updated?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our ${storeName} coupons are updated multiple times daily. We verify all codes to ensure they work and remove expired offers promptly. Check back often for new deals!`,
        },
      },
      {
        "@type": "Question",
        name: `What is the best ${storeName} coupon right now?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best current ${storeName} discount is up to ${Math.max(...deals.map(d => d.discount_percentage))}% off. We rank coupons by savings so the best deals appear first.`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${storeInfo.color} text-white py-14 md:py-16 overflow-hidden`}>
          <PageContainer>
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href="/deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Coupons
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {storeName}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Ticket className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Coupons & Promo Codes</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              {storeName} Coupons & Promo Codes
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Save up to {Math.max(...deals.map(d => d.discount_percentage))}% with verified {storeName} coupon codes for {currentMonth} {currentYear}. Free shipping codes available.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                {couponsWithCodes.length} Coupon Codes
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-sm">
                {dealsWithoutCodes.length} Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Coupon Codes Section */}
        {couponsWithCodes.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                {storeName} Coupon Codes
              </h2>
              <div className="space-y-4">
                {couponsWithCodes.map((deal) => (
                  <Card key={deal.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Discount Badge */}
                        <div className={`${storeInfo.color} text-white p-6 flex flex-col items-center justify-center min-w-[140px]`}>
                          <span className="text-3xl font-bold">{deal.discount_percentage}%</span>
                          <span className="text-sm uppercase tracking-wide">OFF</span>
                        </div>
                        
                        {/* Deal Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                                <span className="text-xs text-muted-foreground">{deal.category}</span>
                              </div>
                              <h3 className="font-semibold text-foreground mb-2">
                                {deal.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {deal.description || `Save ${deal.discount_percentage}% on your purchase with this ${storeName} coupon code.`}
                              </p>
                            </div>
                            
                            {/* CTA */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border-2 border-dashed border-border">
                                <code className="font-mono font-bold text-foreground">{deal.coupon_code}</code>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button asChild className="gap-2">
                                <Link href={deal.affiliate_link} target="_blank" rel="noopener noreferrer">
                                  Get Deal
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* Deals Without Codes */}
        {dealsWithoutCodes.length > 0 && (
          <section className="bg-muted/30 py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Percent className="h-6 w-6 text-primary" />
                {storeName} Sales & Deals
              </h2>
              <p className="text-muted-foreground mb-6">
                These deals don't require a coupon code - the discount is applied automatically.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dealsWithoutCodes.slice(0, 12).map((deal) => (
                  <Card key={deal.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-secondary text-secondary-foreground">
                          {deal.discount_percentage}% OFF
                        </Badge>
                        <span className="text-xs text-muted-foreground">{deal.category}</span>
                      </div>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                        {deal.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-secondary">${deal.deal_price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">${deal.original_price.toFixed(2)}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={deal.affiliate_link} target="_blank" rel="noopener noreferrer">
                            Shop Now
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* Store Info Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">About {storeName} Coupons</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {storeName} is a popular retailer offering a wide range of products. SaveSmart tracks all available {storeName} coupon codes, promo codes, and discounts to help you save money on every purchase.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team verifies each coupon code to ensure it works before listing it. We update our {storeName} coupons page multiple times daily to bring you the freshest deals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Tips for Saving at {storeName}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Sign up for {storeName}'s newsletter for exclusive coupon codes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Check for student, military, or healthcare worker discounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Stack coupon codes with sale items for maximum savings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Use a cashback browser extension for extra savings</span>
                  </li>
                </ul>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`${storeName} Coupon Codes & Deals`}
          content={`Find the best ${storeName} coupon codes and promo codes for ${currentMonth} ${currentYear}. SaveSmart verifies all ${storeName} coupons daily to ensure they work. ${generateStoreSeoContent(storeName)}`}
          relatedLinks={[
            { label: `${storeName} Deals`, href: `/stores/${store}` },
            ...getStoreRelatedLinks(store, storeName),
          ]}
        />

        {/* Related Store Coupons */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              More Store Coupons
            </h2>
            <div className="flex flex-wrap gap-3">
              {KNOWN_STORES.filter(s => s !== store).slice(0, 12).map((otherStore) => (
                <Link
                  key={otherStore}
                  href={`/coupons/${otherStore}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  {formatStoreName(otherStore)} Coupons
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
