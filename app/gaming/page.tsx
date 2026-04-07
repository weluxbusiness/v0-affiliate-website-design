import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { FAQSection } from "@/components/seo"
import { gamingDealsFAQs } from "@/lib/seo/faq-data"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { GameCardCompact, GamingCategoryFilter } from "@/components/gaming/gaming-internal-links"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Gamepad2, 
  Gift, 
  Tag, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  ExternalLink,
  Calendar,
  TrendingUp,
  DollarSign,
  BookOpen,
  ChevronRight,
  Flame,
  Play
} from "lucide-react"
import { 
  gamesData, 
  getPopularGames,
  getTrendingCodes,
  getActivePromoCodes,
  getAllCategories,
  getTotalActiveCodesCount,
  getGameLogoUrl,
  getGameCtaInfo
} from "@/lib/gaming-data"
import { getAllGames, getFeaturedGames, getRecentCodes, getStats } from "@/lib/gaming-server"

// Use ISR for better SEO - static generation with revalidation
// This ensures Googlebot sees fully rendered content
export const revalidate = 300 // Revalidate every 5 minutes

// Dynamic metadata with current month/year
const currentDate = new Date()
const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
const currentYear = currentDate.getFullYear()

export const metadata: Metadata = {
  title: `Gaming Codes (${currentMonth} ${currentYear}) – 500+ Free Rewards Today`,
  description: "Get 500+ working promo codes for Genshin Impact, Fortnite, RAID Shadow Legends, Roblox & more. Free in-game rewards, gems & bonuses. Verified daily - redeem now before codes expire!",
  keywords: [
    // Primary high-intent keywords
    "gaming promo codes",
    "game promo codes",
    "free game codes",
    "game codes 2026",
    // Game-specific keywords (high search volume)
    "genshin impact codes",
    "genshin impact promo codes",
    "fortnite codes",
    "roblox promo codes",
    "raid shadow legends promo codes",
    "raid promo codes",
    "call of duty codes",
    // Intent keywords
    "free game rewards",
    "free in-game rewards",
    "mobile game codes",
    "new player deals",
    "game codes april 2026",
    "working game codes",
    "redeem codes"
  ],
  openGraph: {
    title: "Gaming Promo Codes April 2026 - Free Rewards Today | SaveSmart",
    description: "500+ working promo codes for Genshin Impact, Fortnite, RAID & more. Free gems, rewards & bonuses. Redeem now!",
    url: "https://savesmart.bio/gaming",
    type: "website",
    images: [
      {
        url: "https://savesmart.bio/og/gaming-promo-codes.jpg",
        width: 1200,
        height: 630,
        alt: "Gaming Promo Codes - Free Rewards for Popular Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaming Promo Codes April 2026 - Free Rewards",
    description: "500+ working promo codes for popular games. Free gems, rewards & bonuses.",
  },
  alternates: {
    canonical: "/gaming",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Gaming hub page structured data for rich results
function generateGamingHubSchema(totalCodes: number, gameCount: number) {
  const baseUrl = "https://savesmart.bio"
  
  // CollectionPage schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gaming Promo Codes & Free Rewards",
    description: "Discover working promo codes, in-game rewards, and exclusive bonuses for your favorite games.",
    url: `${baseUrl}/gaming`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCodes,
      itemListOrder: "ItemListOrderDescending",
    },
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gaming",
        item: `${baseUrl}/gaming`,
      },
    ],
  }

  // WebPage schema with speakable for voice search
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Gaming Promo Codes & Free Rewards",
    description: `Find ${totalCodes}+ working promo codes for ${gameCount}+ popular games. Free gems, rewards & bonuses verified daily.`,
    url: `${baseUrl}/gaming`,
    isPartOf: {
      "@type": "WebSite",
      name: "SaveSmart",
      url: baseUrl,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-description"],
    },
  }

  return { collectionSchema, breadcrumbSchema, webPageSchema }
}

export default async function GamingPage() {
  // Fetch data from database (with static fallback)
  const [dbGames, dbFeaturedGames, dbRecentCodes, dbStats] = await Promise.all([
    getAllGames(),
    getFeaturedGames(4),
    getRecentCodes(6),
    getStats(),
  ])
  
  // Use database data if available, otherwise fall back to static
  const popularGames = dbGames.length > 0 ? dbGames.slice(0, 12) : getPopularGames(12)
  const trendingCodes = getTrendingCodes(6)
  const categories = getAllCategories()
  const totalCodes = dbStats.totalCodes > 0 ? dbStats.totalCodes : getTotalActiveCodesCount()

  // Get featured games (top 4 by popularity)
  const featuredGames = dbFeaturedGames.length > 0 ? dbFeaturedGames : popularGames.slice(0, 4)

  // Generate structured data for SEO
  const schemas = generateGamingHubSchema(totalCodes, popularGames.length)

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webPageSchema) }}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="relative z-10 mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Gaming
            </span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link 
                href="/gaming/promo-codes"
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Gamepad2 className="h-3 w-3 mr-1" />
                Gaming Deals
              </Link>
              <Link 
                href="/gaming/today"
                className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                {totalCodes}+ Active Codes
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Gaming Promo Codes & Free Rewards
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Discover working promo codes, in-game rewards, and exclusive bonuses for your favorite games. 
              We verify codes daily so you never miss out on free loot.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/gaming/promo-codes">
                  <Tag className="h-5 w-5 mr-2" />
                  All Promo Codes
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Link href="/gaming/free-rewards">
                  <Gift className="h-5 w-5 mr-2" />
                  Free Rewards
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Link href="/gaming/new-player-deals">
                  <Zap className="h-5 w-5 mr-2" />
                  New Player Deals
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Trending Codes Section */}
      <section className="py-10 md:py-12 border-b border-border">
        <PageContainer>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Trending Codes Today
              </h2>
            </div>
            <Link 
              href="/gaming/today"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trendingCodes.map(({ game, code }) => (
              <PromoCodeCard 
                key={`${game.id}-${code.code}`}
                code={code}
                game={game}
                showGame={true}
                pageSlug="/gaming"
              />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Featured Games */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Gamepad2 className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Featured Games
              </h2>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {featuredGames.map((game) => {
                const codeCount = getActivePromoCodes(game.promoCodes).length
                const logoUrl = getGameLogoUrl(game)
                const hasLogo = game.logoUrl
                const ctaInfo = getGameCtaInfo(game)
              
              return (
                <Card key={game.id} className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200 group">
                  <CardContent className="p-5">
                    {/* Game Logo - Primary Visual Anchor */}
                    <Link href={`/gaming/${game.slug}`} className="flex items-center gap-4 mb-4">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ring-2 ring-border/50 shadow-md bg-muted/50">
                        {hasLogo ? (
                          <Image
                            src={logoUrl}
                            alt={game.name}
                            width={56}
                            height={56}
                            className="rounded-xl object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10">
                            <Gamepad2 className="h-7 w-7 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate text-lg">
                          {game.shortName || game.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {game.categories[0]} | {game.platforms[0]}
                        </p>
                      </div>
                    </Link>
                    
                    {/* Reward Highlight - Not description */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                        <Tag className="h-3 w-3 mr-1" />
                        {codeCount} codes
                      </Badge>
                      {codeCount > 2 && (
                        <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600 border-0">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-0">
                        <Gift className="h-3 w-3 mr-1" />
                        Free Rewards
                      </Badge>
                    </div>

                    {/* Primary CTA - Claim FREE Rewards or Play Free */}
                    {ctaInfo.url && (
                      <Button
                        asChild
                        className={`w-full h-11 font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all ${
                          ctaInfo.buttonStyle === 'affiliate' 
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <a
                          href={ctaInfo.url}
                          target="_blank"
                          rel={ctaInfo.rel}
                        >
                          {ctaInfo.isAffiliate ? (
                            <Gift className="h-5 w-5 mr-2" />
                          ) : (
                            <Gamepad2 className="h-5 w-5 mr-2" />
                          )}
                          {ctaInfo.label}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    
                    {/* Urgency text for affiliate */}
                    {ctaInfo.isAffiliate && ctaInfo.urgencyText && (
                      <p className="text-xs text-amber-600 text-center font-medium mt-1">
                        {ctaInfo.urgencyText}
                      </p>
                    )}

                    {/* View Codes Link - smaller for affiliate, primary for non-affiliate */}
                    <Link 
                      href={`/gaming/${game.slug}`}
                      className={`flex items-center justify-center gap-1 mt-2 text-sm ${
                        ctaInfo.isAffiliate 
                          ? 'font-medium text-muted-foreground hover:text-foreground' 
                          : 'font-semibold text-primary hover:underline'
                      }`}
                    >
                      View All Codes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* Browse by Category */}
      <section className="py-10 md:py-12 border-b border-border">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Browse by Category
            </h2>
          </div>

          <GamingCategoryFilter categories={categories} />
        </PageContainer>
      </section>

      {/* All Games List */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              All Games with Promo Codes
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {popularGames.map((game) => (
              <GameCardCompact 
                key={game.id}
                game={game}
                codeCount={getActivePromoCodes(game.promoCodes).length}
              />
            ))}
          </div>

          {gamesData.length > 12 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/gaming/promo-codes">
                  View All {gamesData.length} Games
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </PageContainer>
      </section>

      {/* Quick Links Footer */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            Explore Gaming Deals
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link 
              href="/gaming/promo-codes"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">All Promo Codes</p>
                <p className="text-xs text-muted-foreground">{totalCodes}+ codes</p>
              </div>
            </Link>
            <Link 
              href="/gaming/free-rewards"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Gift className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-foreground">Free Rewards</p>
                <p className="text-xs text-muted-foreground">Daily bonuses</p>
              </div>
            </Link>
            <Link 
              href="/gaming/new-player-deals"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">New Player Deals</p>
                <p className="text-xs text-muted-foreground">Starter bonuses</p>
              </div>
            </Link>
            <Link 
              href="/gaming/today"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">Today&apos;s Codes</p>
                <p className="text-xs text-muted-foreground">Latest updates</p>
              </div>
            </Link>
          </div>

          {/* Additional SEO Links */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              More Resources
            </h4>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/gaming/best-codes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-sm font-medium transition-colors"
              >
                Best Codes
              </Link>
              <Link 
                href="/gaming/all-codes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
              >
                All Codes Database
              </Link>
              <Link 
                href="/gaming/top-games"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-sm font-medium transition-colors"
              >
                Top Games
              </Link>
            </div>
          </div>
          
          {/* Cross-links to deals */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4">
              Also Check Out
            </h4>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/deals"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                <Tag className="h-4 w-4" />
                All Shopping Deals
              </Link>
              <Link 
                href="/deals/top/gaming"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Top Gaming Deals
              </Link>
              <Link 
                href="/deals/cheap/headphones"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                Cheap Gaming Headphones
              </Link>
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Deals Blog
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Gaming Promo Codes FAQ"
        subtitle="Common questions about gaming codes and rewards"
        faqs={gamingDealsFAQs}
        className="border-t border-border"
      />

      <Footer />
    </div>
  )
}
