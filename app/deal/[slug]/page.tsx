import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PopularCategories } from "@/components/popular-categories"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { createAnonClient } from "@/lib/supabase/anon"
import { getStoreInfo, formatRating, formatReviewCount, getProductImageUrl, storeToSlug, categoryToSlug } from "@/lib/deal-types"
import type { Deal } from "@/lib/deal-types"
import { 
  ExternalLink, 
  Star, 
  ShoppingBag, 
  Copy, 
  Check, 
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  BadgeCheck
} from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const deal = await getDealBySlug(slug)
  
  if (!deal) {
    return {
      title: "Deal Not Found | SaveSmart",
    }
  }

  const savings = deal.original_price - deal.deal_price
  const description = deal.ai_description || 
    `Save $${savings.toFixed(2)} (${deal.discount_percentage}% off) on ${deal.title} at ${deal.store}. ${deal.coupon_code ? `Use code ${deal.coupon_code}.` : ''} Limited time offer!`

  return {
    title: `${deal.title} - ${deal.discount_percentage}% Off | SaveSmart`,
    description,
    keywords: [deal.title, deal.store, deal.category, 'deal', 'discount', 'coupon', 'savings'].join(', '),
    openGraph: {
      title: `${deal.title} - ${deal.discount_percentage}% Off`,
      description,
      images: [{ url: getProductImageUrl(deal), width: 600, height: 400, alt: deal.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${deal.title} - ${deal.discount_percentage}% Off`,
      description,
      images: [getProductImageUrl(deal)],
    },
  }
}

// Revalidate deal pages every hour for fresh data while still benefiting from caching
export const revalidate = 3600

async function getDealBySlug(slug: string): Promise<Deal | null> {
  const supabase = createAnonClient()
  
  // First try to find by slug
  let { data: deal, error } = await supabase
    .from('deals')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  // If not found by slug, try by ID (for backward compatibility)
  if (!deal) {
    const { data: dealById } = await supabase
      .from('deals')
      .select('*')
      .eq('id', slug)
      .eq('is_active', true)
      .single()
    deal = dealById
  }

  return deal
}

async function getRelatedDeals(deal: Deal): Promise<Deal[]> {
  const supabase = createAnonClient()
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .eq('category', deal.category)
    .neq('id', deal.id)
    .order('discount_percentage', { ascending: false })
    .limit(6)

  return deals || []
}

async function getStoreDeals(store: string, excludeId: string): Promise<Deal[]> {
  const supabase = createAnonClient()
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .ilike('store', store)
    .neq('id', excludeId)
    .order('discount_percentage', { ascending: false })
    .limit(6)

  return deals || []
}

// Client component for copy functionality
function CouponCopyButton({ code }: { code: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => navigator.clipboard.writeText(code)}
    >
      <Copy className="h-4 w-4" />
      Copy Code
    </Button>
  )
}

export default async function DealPage({ params }: PageProps) {
  const { slug } = await params
  const deal = await getDealBySlug(slug)

  if (!deal) {
    notFound()
  }

  const storeInfo = getStoreInfo(deal.store)
  const savings = deal.original_price - deal.deal_price
  const [relatedDeals, storeDeals] = await Promise.all([
    getRelatedDeals(deal),
    getStoreDeals(deal.store, deal.id)
  ])
  const imageUrl = getProductImageUrl(deal)

  // Structured data for SEO - Full Product schema for Google rich results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.ai_description || deal.description,
    image: [imageUrl],
    sku: deal.id,
    brand: {
      "@type": "Brand",
      name: deal.store,
    },
    category: deal.category,
    offers: {
      "@type": "Offer",
      url: `https://savesmart.bio/deal/${deal.slug || deal.id}`,
      price: deal.deal_price,
      priceCurrency: "USD",
      priceValidUntil: deal.expires_at?.split('T')[0],
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: deal.store,
      },
      ...(deal.coupon_code && { 
        priceSpecification: {
          "@type": "PriceSpecification",
          price: deal.deal_price,
          priceCurrency: "USD",
          valueAddedTaxIncluded: false,
        }
      }),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: storeInfo.rating.toFixed(1),
      reviewCount: storeInfo.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  }

  // Breadcrumb structured data for SEO - Full hierarchy for Google
  const categorySlug = categoryToSlug(deal.category)
  const storeSlug = storeToSlug(deal.store)
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://savesmart.bio/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${deal.category} Deals`,
        item: `https://savesmart.bio/deals/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${deal.store} ${deal.category}`,
        item: `https://savesmart.bio/stores/${storeSlug}/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: deal.title,
        item: `https://savesmart.bio/deal/${deal.slug || deal.id}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Structured Data - Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <main className="pt-16">
        <PageContainer className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/deals" className="hover:text-foreground transition-colors">Deals</Link>
          <span>/</span>
          <Link href={`/deals/${deal.category.toLowerCase().replace(' & ', '-')}`} className="hover:text-foreground transition-colors">
            {deal.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{deal.title}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" size="sm" className="gap-2 mb-6" asChild>
          <Link href="/deals">
            <ArrowLeft className="h-4 w-4" />
            Back to Deals
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={imageUrl}
                alt={deal.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Discount Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-secondary-foreground text-lg px-3 py-1">
                  {deal.discount_percentage}% OFF
                </Badge>
              </div>
              {/* Verified Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-600 text-white gap-1">
                  <BadgeCheck className="h-4 w-4" />
                  Verified Deal
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Store & Category */}
            <div className="flex items-center gap-3">
              <div className={`${storeInfo.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold`}>
                {deal.store.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{deal.store}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {formatRating(storeInfo.rating)} ({formatReviewCount(storeInfo.reviewCount)} reviews)
                </div>
              </div>
              <Badge variant="outline" className="ml-auto">{deal.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {deal.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {deal.ai_description || deal.description}
            </p>

            {/* Price Section */}
            <Card className="border-secondary/30 bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground line-through">
                      Original: ${deal.original_price.toFixed(2)}
                    </p>
                    <p className="text-4xl font-bold text-secondary">
                      ${deal.deal_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                      Save ${savings.toFixed(2)}
                    </Badge>
                  </div>
                </div>

                {/* Coupon Code */}
                {deal.coupon_code && (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-amber-600" />
                      <span className="font-mono font-bold text-lg text-foreground">{deal.coupon_code}</span>
                    </div>
                    <CouponCopyButton code={deal.coupon_code} />
                  </div>
                )}

                {/* Expiration */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Deal expires:</span>
                  <CountdownTimer expiresAt={deal.expires_at} />
                </div>

                {/* CTA Button */}
                <Button size="lg" className="w-full gap-2 text-lg" asChild>
                  <a href={deal.affiliate_link} target="_blank" rel="noopener sponsored">
                    <ShoppingBag className="h-5 w-5" />
                    Get This Deal
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-muted-foreground">Verified Deal</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-muted-foreground">Fast Shipping</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Capital One Shopping Promotion */}
        <section className="mt-12">
          <CapitalOnePromo variant="inline" />
        </section>

        {/* Related Deals - Same Category */}
        {relatedDeals.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Related Deals You May Like</h2>
              <Link href={`/deals/${deal.category.toLowerCase().replace(' & ', '-')}`} className="text-sm font-medium text-primary hover:underline">
                View All {deal.category} Deals
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {relatedDeals.map((relatedDeal) => (
                <Link 
                  key={relatedDeal.id} 
                  href={`/deal/${relatedDeal.slug || relatedDeal.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={getProductImageUrl(relatedDeal)}
                        alt={relatedDeal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          {relatedDeal.discount_percentage}% OFF
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{relatedDeal.store}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedDeal.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-secondary">
                          ${relatedDeal.deal_price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${relatedDeal.original_price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More Deals from Same Store */}
        {storeDeals.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">More Deals from {deal.store}</h2>
              <Link href={`/deals/${deal.store.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-primary hover:underline">
                View All {deal.store} Deals
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {storeDeals.map((storeDeal) => (
                <Link 
                  key={storeDeal.id} 
                  href={`/deal/${storeDeal.slug || storeDeal.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={getProductImageUrl(storeDeal)}
                        alt={storeDeal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          {storeDeal.discount_percentage}% OFF
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{storeDeal.category}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {storeDeal.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-secondary">
                          ${storeDeal.deal_price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${storeDeal.original_price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO Internal Links */}
        <section className="mt-16 pt-8 border-t border-border">
          <div className="grid gap-8 md:grid-cols-3">
            {/* More from Store */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                More {deal.store} Deals
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/stores/${storeToSlug(deal.store)}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  All {deal.store} Deals
                </Link>
                <Link
                  href={`/stores/${storeToSlug(deal.store)}/${categoryToSlug(deal.category)}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  {deal.store} {deal.category}
                </Link>
              </div>
            </div>

            {/* More from Category */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                More {deal.category} Deals
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/deals/${categoryToSlug(deal.category)}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  All {deal.category} Deals
                </Link>
              </div>
            </div>

            {/* Popular Stores */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Popular Stores
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Amazon', 'Nike', 'Best Buy', 'Target', 'Walmart'].filter(s => s !== deal.store).slice(0, 4).map((store) => (
                  <Link
                    key={store}
                    href={`/stores/${storeToSlug(store)}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    {store}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <PopularCategories />
</PageContainer>
</main>

      <Footer />
    </div>
  )
}
