import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  Trophy,
  Calendar,
  Search,
  Flame
} from "lucide-react"
import { 
  gamesData,
  getActivePromoCodes,
  getTotalActiveCodesCount,
  sortPromoCodesByValue
} from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "All Gaming Promo Codes List 2026 - Complete Database | SaveSmart",
  description: "Complete list of all working gaming promo codes in one place. Browse 500+ verified codes for Genshin Impact, Fortnite, RAID, Roblox, and 100+ games. Updated hourly.",
  keywords: [
    "all gaming promo codes",
    "complete game codes list",
    "gaming codes database",
    "all game codes 2026",
    "working promo codes list",
    "game redemption codes"
  ],
  openGraph: {
    title: "All Gaming Promo Codes - Complete Database | SaveSmart",
    description: "Complete list of all working gaming promo codes. 500+ verified codes updated hourly.",
    url: "https://savesmart.bio/gaming/all-codes",
  },
  alternates: {
    canonical: "/gaming/all-codes",
  },
}

export default function AllCodesPage() {
  const totalCodes = getTotalActiveCodesCount()
  
  // Get all codes from all games, flattened
  const allCodes = gamesData
    .flatMap(game => 
      getActivePromoCodes(game.promoCodes).map(code => ({
        game,
        code
      }))
    )
    .sort((a, b) => new Date(b.code.addedAt ?? 0).getTime() - new Date(a.code.addedAt ?? 0).getTime())

  // Group by date added (recent first)
  const today = new Date()
  const todayStr = today.toDateString()
  const yesterdayStr = new Date(today.setDate(today.getDate() - 1)).toDateString()
  
  const todaysCodes = allCodes.filter(item => new Date(item.code.addedAt ?? 0).toDateString() === todayStr)
  const yesterdaysCodes = allCodes.filter(item => new Date(item.code.addedAt ?? 0).toDateString() === yesterdayStr)
  const olderCodes = allCodes.filter(item => {
    const dateStr = new Date(item.code.addedAt ?? 0).toDateString()
    return dateStr !== todayStr && dateStr !== yesterdayStr
  })

  // Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Gaming Promo Codes 2026",
    description: "Complete database of working gaming promo codes",
    numberOfItems: totalCodes,
    itemListElement: allCodes.slice(0, 50).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: `${item.game.name} - ${item.code.code}`,
        description: item.code.reward,
        url: `https://savesmart.bio/gaming/${item.game.slug}`
      }
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-12 md:py-16 overflow-hidden">
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
            <Link 
              href="/gaming" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Gaming
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              All Codes
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Search className="h-3 w-3 mr-1" />
              Complete Database
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Tag className="h-3 w-3 mr-1" />
              {totalCodes}+ Codes
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            All Gaming Promo Codes 2026
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mb-6">
            The most comprehensive database of gaming promo codes. Browse {totalCodes}+ verified codes 
            for {gamesData.length}+ popular games. Every code is tested and updated hourly.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Tag className="h-4 w-4" />
              <span>{totalCodes}+ Active Codes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Gamepad2 className="h-4 w-4" />
              <span>{gamesData.length}+ Games</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Calendar className="h-4 w-4" />
              <span>Updated Hourly</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Quick Navigation */}
      <section className="py-6 border-b border-border bg-muted/30">
        <PageContainer>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              All Games
            </Link>
            <Link
              href="/gaming/best-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Trophy className="h-4 w-4" />
              Best Codes
            </Link>
            <Link
              href="/gaming/top-games"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Flame className="h-4 w-4" />
              Top Games
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Today's Codes */}
      {todaysCodes.length > 0 && (
        <section className="py-10 md:py-12 border-b border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                <Flame className="h-3 w-3 mr-1" />
                New Today
              </Badge>
              <h2 className="text-xl font-bold text-foreground">
                Codes Added Today ({todaysCodes.length})
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {todaysCodes.map(({ game, code }) => (
                <PromoCodeCard 
                  key={`${game.id}-${code.code}`}
                  code={code}
                  game={game}
                  showGame={true}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Yesterday's Codes */}
      {yesterdaysCodes.length > 0 && (
        <section className="py-10 md:py-12 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-0">
                <Calendar className="h-3 w-3 mr-1" />
                Yesterday
              </Badge>
              <h2 className="text-xl font-bold text-foreground">
                Codes Added Yesterday ({yesterdaysCodes.length})
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {yesterdaysCodes.map(({ game, code }) => (
                <PromoCodeCard 
                  key={`${game.id}-${code.code}`}
                  code={code}
                  game={game}
                  showGame={true}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* All Other Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-foreground">
              All Active Codes ({olderCodes.length})
            </h2>
          </div>
          
          {olderCodes.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {olderCodes.map(({ game, code }) => (
                <PromoCodeCard 
                  key={`${game.id}-${code.code}`}
                  code={code}
                  game={game}
                  showGame={true}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  All codes shown above
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for more codes!
                </p>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>

      {/* SEO Content Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              About Gaming Promo Codes
            </h2>
            <div className="prose prose-gray dark:prose-invert">
              <p className="text-muted-foreground mb-4">
                Gaming promo codes are alphanumeric codes that players can redeem for free in-game rewards, 
                currency, items, skins, and other bonuses. These codes are typically released by game 
                developers during special events, updates, collaborations, or as part of marketing campaigns.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">How We Collect Codes</h3>
              <p className="text-muted-foreground mb-4">
                Our team monitors official game social media accounts, livestreams, patch notes, and community 
                forums to find the latest codes. We verify each code before adding it to our database and 
                remove expired codes within hours.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Code Redemption Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Copy codes exactly as shown - most codes are case-sensitive</li>
                <li>Check if your account meets any level or region requirements</li>
                <li>Some codes can only be redeemed once per account</li>
                <li>Codes may have limited total redemptions - redeem quickly!</li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
