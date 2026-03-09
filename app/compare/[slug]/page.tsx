import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { searchDeals } from "@/lib/deals"
import { Check, X, ArrowRight, Scale, Sparkles } from "lucide-react"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

// Parse comparison slug: "macbook-air-vs-dell-xps" → { productA: "macbook-air", productB: "dell-xps" }
function parseComparisonSlug(slug: string): { productA: string; productB: string } | null {
  const parts = slug.split("-vs-")
  if (parts.length !== 2) return null
  return { productA: parts[0], productB: parts[1] }
}

function formatProductName(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Generate product specs based on search results
function generateProductSpecs(productName: string, deals: Awaited<ReturnType<typeof searchDeals>>) {
  const avgPrice = deals.length > 0 
    ? Math.round(deals.reduce((sum, d) => sum + (d.price || 0), 0) / deals.length)
    : 0
  const avgDiscount = deals.length > 0
    ? Math.round(deals.reduce((sum, d) => sum + (d.discount_percentage || 0), 0) / deals.length)
    : 0
  const stores = [...new Set(deals.map(d => d.store).filter(Boolean))].slice(0, 5)
  
  return {
    name: productName,
    avgPrice,
    avgDiscount,
    dealCount: deals.length,
    stores,
    lowestPrice: deals.length > 0 ? Math.min(...deals.map(d => d.price || Infinity)) : 0,
    highestDiscount: deals.length > 0 ? Math.max(...deals.map(d => d.discount_percentage || 0)) : 0,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  
  if (!parsed) {
    return { title: "Product Comparison | SaveSmart" }
  }
  
  const productA = formatProductName(parsed.productA)
  const productB = formatProductName(parsed.productB)
  
  return {
    title: `${productA} vs ${productB} – Full Comparison | SaveSmart`,
    description: `Compare ${productA} vs ${productB}: specs, prices, pros, cons and the best deals available now. Find the best option for your needs.`,
    openGraph: {
      title: `${productA} vs ${productB} – Which One Should You Buy?`,
      description: `Detailed comparison of ${productA} and ${productB}. Compare prices, features, and find the best deals.`,
      type: "website",
      url: `https://savesmart.bio/compare/${slug}`,
    },
    alternates: {
      canonical: `/compare/${slug}`,
    },
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const productAName = formatProductName(parsed.productA)
  const productBName = formatProductName(parsed.productB)
  
  // Fetch deals for both products
  const [dealsA, dealsB] = await Promise.all([
    searchDeals(parsed.productA.replace(/-/g, " "), 20),
    searchDeals(parsed.productB.replace(/-/g, " "), 20),
  ])
  
  const specsA = generateProductSpecs(productAName, dealsA)
  const specsB = generateProductSpecs(productBName, dealsB)
  
  // Structured data - Product comparison schema
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${productAName} vs ${productBName} Comparison`,
    "description": `Compare ${productAName} and ${productBName} - prices, features, and best deals`,
    "numberOfItems": 2,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": productAName,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": specsA.lowestPrice,
            "offerCount": specsA.dealCount,
            "priceCurrency": "USD",
          },
        },
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": productBName,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": specsB.lowestPrice,
            "offerCount": specsB.dealCount,
            "priceCurrency": "USD",
          },
        },
      },
    ],
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Which is better: ${productAName} or ${productBName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Both ${productAName} and ${productBName} are excellent choices. ${productAName} is available at ${specsA.dealCount} retailers with prices starting at $${specsA.lowestPrice}, while ${productBName} is available at ${specsB.dealCount} retailers starting at $${specsB.lowestPrice}. The best choice depends on your specific needs and budget.`,
        },
      },
      {
        "@type": "Question",
        "name": `Where can I find the best deals on ${productAName} and ${productBName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `SaveSmart tracks deals from major retailers including ${[...specsA.stores, ...specsB.stores].slice(0, 5).join(", ")}. Check our comparison above for the latest prices and discounts.`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Hero */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Scale className="h-3 w-3 mr-1" />
              Product Comparison
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {productAName} vs {productBName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare prices, features, and find the best deals on {productAName} and {productBName} from top retailers.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Product A */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center bg-muted/30">
                <CardTitle className="text-xl">{productAName}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline">{specsA.dealCount} deals</Badge>
                  {specsA.highestDiscount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      Up to {specsA.highestDiscount}% off
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lowest Price</span>
                    <span className="text-2xl font-bold text-primary">
                      ${specsA.lowestPrice || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Discount</span>
                    <span className="font-semibold">{specsA.avgDiscount}% off</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available at</span>
                    <span className="font-semibold">{specsA.stores.length} stores</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Top Retailers:</p>
                    <div className="flex flex-wrap gap-2">
                      {specsA.stores.map((store) => (
                        <Badge key={store} variant="secondary">{store}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product B */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center bg-muted/30">
                <CardTitle className="text-xl">{productBName}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline">{specsB.dealCount} deals</Badge>
                  {specsB.highestDiscount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      Up to {specsB.highestDiscount}% off
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lowest Price</span>
                    <span className="text-2xl font-bold text-primary">
                      ${specsB.lowestPrice || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Discount</span>
                    <span className="font-semibold">{specsB.avgDiscount}% off</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available at</span>
                    <span className="font-semibold">{specsB.stores.length} stores</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Top Retailers:</p>
                    <div className="flex flex-wrap gap-2">
                      {specsB.stores.map((store) => (
                        <Badge key={store} variant="secondary">{store}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Verdict */}
          <Card className="mb-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Quick Verdict</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Choose {productAName} if:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>You want more retailer options ({specsA.stores.length} stores)</span>
                    </li>
                    {specsA.lowestPrice < specsB.lowestPrice && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>You're looking for the lowest price point</span>
                      </li>
                    )}
                    {specsA.highestDiscount > specsB.highestDiscount && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>You want the biggest discounts (up to {specsA.highestDiscount}% off)</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Choose {productBName} if:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>You want more deal options ({specsB.dealCount} active deals)</span>
                    </li>
                    {specsB.lowestPrice < specsA.lowestPrice && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>You're looking for the lowest price point</span>
                      </li>
                    )}
                    {specsB.highestDiscount > specsA.highestDiscount && (
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>You want the biggest discounts (up to {specsB.highestDiscount}% off)</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CapitalOne Promo */}
          <div className="mb-12">
            <CapitalOnePromo />
          </div>

          {/* Deals Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product A Deals */}
            <div>
              <SectionHeading 
                title={`Best ${productAName} Deals`} 
                subtitle={`${dealsA.length} deals found`}
              />
              <div className="grid gap-4">
                {dealsA.slice(0, 4).map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="compact" />
                ))}
              </div>
              {dealsA.length > 4 && (
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/search?q=${encodeURIComponent(parsed.productA.replace(/-/g, " "))}`}>
                    View All {productAName} Deals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Product B Deals */}
            <div>
              <SectionHeading 
                title={`Best ${productBName} Deals`} 
                subtitle={`${dealsB.length} deals found`}
              />
              <div className="grid gap-4">
                {dealsB.slice(0, 4).map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="compact" />
                ))}
              </div>
              {dealsB.length > 4 && (
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/search?q=${encodeURIComponent(parsed.productB.replace(/-/g, " "))}`}>
                    View All {productBName} Deals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-12">
            <SectionHeading 
              title="Frequently Asked Questions" 
              subtitle="Common questions about this comparison"
            />
            <div className="space-y-4">
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">
                    Which is better: {productAName} or {productBName}?
                  </h3>
                  <p className="text-muted-foreground">
                    Both {productAName} and {productBName} are excellent choices. {productAName} is 
                    available at {specsA.dealCount} retailers with prices starting at ${specsA.lowestPrice}, 
                    while {productBName} is available at {specsB.dealCount} retailers starting 
                    at ${specsB.lowestPrice}. The best choice depends on your specific needs and budget.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">
                    Where can I find the best deals?
                  </h3>
                  <p className="text-muted-foreground">
                    SaveSmart tracks deals from major retailers 
                    including {[...specsA.stores, ...specsB.stores].slice(0, 5).join(", ")}. 
                    Check the comparison above for the latest prices and discounts on both products.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Related Comparisons */}
          <section>
            <SectionHeading 
              title="Related Comparisons" 
              subtitle="Explore more product comparisons"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { a: "macbook-pro", b: "dell-xps" },
                { a: "iphone-15", b: "samsung-galaxy" },
                { a: "airpods-pro", b: "sony-wh1000xm5" },
                { a: "nintendo-switch", b: "steam-deck" },
              ].map(({ a, b }) => (
                <Link
                  key={`${a}-vs-${b}`}
                  href={`/compare/${a}-vs-${b}`}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors text-center"
                >
                  <span className="text-sm font-medium">
                    {formatProductName(a)} vs {formatProductName(b)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
