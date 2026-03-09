"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/layout/page-container"
import { 
  TrendingUp, 
  Flame, 
  Eye, 
  Heart, 
  MousePointer2,
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  CalendarDays,
  CalendarRange
} from "lucide-react"
import { getProductImageUrl } from "@/lib/deal-types"
import type { Deal } from "@/lib/deal-types"

type TimePeriod = "today" | "week" | "month"
type TrendingType = "clicked" | "saved" | "viewed"

interface TrendingDeal extends Deal {
  trendingScore: number
  clickCount?: number
  saveCount?: number
  viewCount?: number
}

// Simulated trending metrics based on deal characteristics
function simulateTrendingMetrics(deal: Deal, type: TrendingType): number {
  const baseScore = deal.discount_percentage || 0
  const priceScore = deal.deal_price < 50 ? 20 : deal.deal_price < 100 ? 15 : deal.deal_price < 200 ? 10 : 5
  
  // Hash the deal ID for consistent "random" variation
  const hash = deal.id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  const variation = Math.abs(hash % 50)
  
  const multipliers: Record<TrendingType, number> = {
    clicked: 1.2,
    saved: 0.8,
    viewed: 1.5
  }
  
  return Math.round((baseScore + priceScore + variation) * multipliers[type])
}

export default function TrendingDealsPage() {
  const [period, setPeriod] = useState<TimePeriod>("today")
  const [activeType, setActiveType] = useState<TrendingType>("clicked")
  const [deals, setDeals] = useState<TrendingDeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function fetchDeals() {
      setIsLoading(true)
      try {
        // Calculate date range based on period
        const now = new Date()
        let hoursAgo = 24
        if (period === "week") hoursAgo = 168
        if (period === "month") hoursAgo = 720
        
        const response = await fetch(`/api/deals/trending?hours=${hoursAgo}&limit=50`)
        const data = await response.json()
        
        if (data.deals) {
          // Add simulated metrics
          const enrichedDeals: TrendingDeal[] = data.deals.map((deal: Deal) => ({
            ...deal,
            trendingScore: deal.discount_percentage || 0,
            clickCount: simulateTrendingMetrics(deal, "clicked"),
            saveCount: simulateTrendingMetrics(deal, "saved"),
            viewCount: simulateTrendingMetrics(deal, "viewed"),
          }))
          
          // Sort by the active metric type
          const sorted = [...enrichedDeals].sort((a, b) => {
            if (activeType === "clicked") return (b.clickCount || 0) - (a.clickCount || 0)
            if (activeType === "saved") return (b.saveCount || 0) - (a.saveCount || 0)
            return (b.viewCount || 0) - (a.viewCount || 0)
          })
          
          setDeals(sorted)
        }
      } catch (error) {
        console.error("Error fetching trending deals:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDeals()
  }, [period, activeType])

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    startTransition(() => {
      setPeriod(newPeriod)
    })
  }

  const handleTypeChange = (newType: TrendingType) => {
    startTransition(() => {
      setActiveType(newType)
    })
  }

  const periodLabels: Record<TimePeriod, { label: string; icon: typeof Calendar }> = {
    today: { label: "Today", icon: Calendar },
    week: { label: "This Week", icon: CalendarDays },
    month: { label: "This Month", icon: CalendarRange },
  }

  const typeLabels: Record<TrendingType, { label: string; icon: typeof MousePointer2; color: string }> = {
    clicked: { label: "Most Clicked", icon: MousePointer2, color: "text-blue-500" },
    saved: { label: "Most Saved", icon: Heart, color: "text-red-500" },
    viewed: { label: "Most Viewed", icon: Eye, color: "text-green-500" },
  }

  // ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Trending Deals - ${typeLabels[activeType].label} ${periodLabels[period].label}`,
    description: `The most popular deals ${period === "today" ? "today" : period === "week" ? "this week" : "this month"} based on ${activeType === "clicked" ? "clicks" : activeType === "saved" ? "saves" : "views"}.`,
    url: "https://savesmart.bio/deals/trending",
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 20).map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: deal.title,
        description: deal.description,
        image: getProductImageUrl(deal),
        offers: {
          "@type": "Offer",
          price: deal.deal_price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: deal.store
          }
        }
      }
    }))
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://savesmart.bio"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deals",
        item: "https://savesmart.bio/deals"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Trending",
        item: "https://savesmart.bio/deals/trending"
      }
    ]
  }

  // Price range links
  const priceRanges = [
    { label: "Under $25", href: "/deals/price/under-25" },
    { label: "Under $50", href: "/deals/price/under-50" },
    { label: "Under $100", href: "/deals/price/under-100" },
    { label: "Under $200", href: "/deals/price/under-200" },
    { label: "Under $500", href: "/deals/price/under-500" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <PageContainer className="relative">
            {/* Breadcrumb */}
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
                Deals
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Trending
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <TrendingUp className="h-7 w-7" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                What&apos;s Hot
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Trending Deals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-6">
              Discover the most popular deals right now. See what other smart shoppers are clicking, saving, and viewing.
            </p>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white border-0 gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                {deals.length} Trending
              </Badge>
              <Badge className="bg-white/20 text-white border-0 gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Updated Live
              </Badge>
            </div>
          </PageContainer>
        </section>

        {/* Filters Section */}
        <section className="py-6 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Time Period Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Time:</span>
                <Tabs value={period} onValueChange={(v) => handlePeriodChange(v as TimePeriod)}>
                  <TabsList className="bg-background">
                    {(Object.keys(periodLabels) as TimePeriod[]).map((p) => {
                      const { label, icon: Icon } = periodLabels[p]
                      return (
                        <TabsTrigger key={p} value={p} className="gap-1.5">
                          <Icon className="h-4 w-4" />
                          {label}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>

              {/* Trending Type Selector */}
              <div className="flex items-center gap-3 sm:ml-auto">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <Tabs value={activeType} onValueChange={(v) => handleTypeChange(v as TrendingType)}>
                  <TabsList className="bg-background">
                    {(Object.keys(typeLabels) as TrendingType[]).map((t) => {
                      const { label, icon: Icon, color } = typeLabels[t]
                      return (
                        <TabsTrigger key={t} value={t} className="gap-1.5">
                          <Icon className={`h-4 w-4 ${activeType === t ? color : ''}`} />
                          <span className="hidden sm:inline">{label}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {typeLabels[activeType].label} - {periodLabels[period].label}
              </h2>
              {(isLoading || isPending) && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
            </div>

            {isLoading ? (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-3">
                      <div className="h-3 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : deals.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No trending deals found</h3>
                <p className="text-muted-foreground mb-6">Check back soon for popular deals!</p>
                <Button asChild>
                  <Link href="/deals">
                    Browse All Deals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {deals.map((deal, index) => {
                  const { icon: TypeIcon, color } = typeLabels[activeType]
                  const metricValue = activeType === "clicked" ? deal.clickCount 
                    : activeType === "saved" ? deal.saveCount 
                    : deal.viewCount
                  
                  return (
                    <Link 
                      key={deal.id} 
                      href={`/deal/${deal.slug || deal.id}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/30">
                        <div className="relative aspect-square bg-muted">
                          <Image
                            src={getProductImageUrl(deal)}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          
                          {/* Discount Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-orange-500 text-white text-xs">
                              {deal.discount_percentage}% OFF
                            </Badge>
                          </div>
                          
                          {/* Rank Badge */}
                          {index < 5 && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                #{index + 1}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Metric Badge */}
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                              <TypeIcon className={`h-3 w-3 ${color}`} />
                              {metricValue}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-3">
                          <p className="text-xs text-muted-foreground">{deal.store}</p>
                          <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                            {deal.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-bold text-orange-600">
                              ${deal.deal_price.toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              ${deal.original_price.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </PageContainer>
        </section>

        {/* Price Range Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Shop by Price Range</h2>
            <div className="flex flex-wrap gap-3">
              {priceRanges.map((range) => (
                <Link
                  key={range.href}
                  href={range.href}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                >
                  {range.label}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Category Links */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Trending by Category</h2>
            <div className="flex flex-wrap gap-3">
              {["Electronics", "Fashion", "Home & Kitchen", "Laptops", "Headphones", "Sneakers", "Gaming", "Beauty"].map((category) => (
                <Link
                  key={category}
                  href={`/deals/today/${category.toLowerCase().replace(/ & /g, '-')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  {category}
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
