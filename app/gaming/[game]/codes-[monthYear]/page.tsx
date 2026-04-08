import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  Calendar,
  ArrowRight,
  History
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"

export const revalidate = 86400 // 24 hours for monthly pages

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

function parseMonthYear(monthYear: string | undefined): { month: string; year: number; monthIndex: number } | null {
  if (!monthYear || typeof monthYear !== 'string') return null
  
  const match = monthYear.match(/^([a-z]+)-(\d{4})$/)
  if (!match) return null
  
  const month = match[1].toLowerCase()
  const year = parseInt(match[2])
  const monthIndex = MONTHS.indexOf(month)
  
  if (monthIndex === -1 || year < 2020 || year > 2030) return null
  
  return { month, year, monthIndex }
}

function formatMonth(month: string): string {
  return month.charAt(0).toUpperCase() + month.slice(1)
}

export async function generateStaticParams() {
  const gameSlugs = getAllGameSlugs()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  
  // Generate params for current month and next 2 months
  const monthYears: string[] = []
  for (let i = 0; i <= 2; i++) {
    const date = new Date(currentYear, currentMonth + i)
    const month = MONTHS[date.getMonth()]
    const year = date.getFullYear()
    monthYears.push(`${month}-${year}`)
  }
  
  return gameSlugs.flatMap(game => 
    monthYears.map(monthYear => ({ game, monthYear }))
  )
}

interface PageProps {
  params: Promise<{ game: string; monthYear: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { game: gameSlug, monthYear } = await params
  const game = getGameBySlug(gameSlug)
  const parsed = parseMonthYear(monthYear)
  
  if (!game || !parsed) {
    return { title: "Not Found | SaveSmart Gaming" }
  }
  
  const monthName = formatMonth(parsed.month)
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const primaryReward = game.promoCodes[0]?.rewardType || 'Rewards'
  const benefit = primaryReward === 'Primogems' ? 'Primogems' : primaryReward === 'V-Bucks' ? 'V-Bucks' : primaryReward === 'Gems' ? 'Gems' : 'Rewards'
  
  return {
    title: `${game.shortName || game.name} Codes (${monthName} ${parsed.year}) – ${codeCount}+ Free ${benefit}`,
    description: `Complete list of all ${game.name} promo codes for ${monthName} ${parsed.year}. ${codeCount} verified working codes. Redeem for free rewards and in-game items.`,
    keywords: [
      `${game.name} codes ${monthName} ${parsed.year}`,
      `${game.name} promo codes ${parsed.year}`,
      `${game.name} codes ${monthName.toLowerCase()}`,
      `${game.name} ${parsed.year} codes`,
      `new ${game.name} codes`,
    ],
    openGraph: {
      title: `${game.name} Codes - ${monthName} ${parsed.year}`,
      description: `All working ${game.name} promo codes for ${monthName} ${parsed.year}.`,
      url: `https://savesmart.bio/gaming/${game.slug}/codes-${monthYear}`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/codes-${monthYear}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function GameCodesMonthPage({ params }: PageProps) {
  const { game: gameSlug, monthYear } = await params
  const game = getGameBySlug(gameSlug)
  const parsed = parseMonthYear(monthYear)
  
  if (!game || !parsed) {
    notFound()
  }
  
  const monthName = formatMonth(parsed.month)
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 4)
  
  // Calculate date ranges
  const currentDate = new Date()
  const pageDate = new Date(parsed.year, parsed.monthIndex)
  const isCurrentMonth = currentDate.getMonth() === parsed.monthIndex && currentDate.getFullYear() === parsed.year
  const isFutureMonth = pageDate > currentDate
  
  // Generate other months for navigation
  const otherMonths: { monthYear: string; label: string }[] = []
  for (let i = -2; i <= 2; i++) {
    const date = new Date(parsed.year, parsed.monthIndex + i)
    const m = MONTHS[date.getMonth()]
    const y = date.getFullYear()
    if (y >= 2024 && `${m}-${y}` !== monthYear) {
      otherMonths.push({
        monthYear: `${m}-${y}`,
        label: `${formatMonth(m)} ${y}`
      })
    }
  }
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Codes ${monthName} ${parsed.year}`,
    description: `Working ${game.name} promo codes for ${monthName} ${parsed.year}`,
    numberOfItems: activeCodes.length,
    itemListElement: activeCodes.slice(0, 10).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
      }
    }))
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 to-purple-700 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="relative z-10 mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href="/gaming" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              Gaming
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/gaming/${game.slug}`} className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              {game.shortName || game.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              {monthName} {parsed.year}
            </span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {monthName} {parsed.year}
            </span>
            {isCurrentMonth && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm font-medium">
                Current Month
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              {activeCodes.length} Active Codes
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} Codes {monthName} {parsed.year}
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            {isFutureMonth 
              ? `Upcoming ${game.name} promo codes expected for ${monthName} ${parsed.year}. Bookmark this page for updates.`
              : `Complete archive of all ${game.name} promo codes for ${monthName} ${parsed.year}. All codes verified and tested.`
            }
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
                <Gamepad2 className="h-5 w-5" />
                Play {game.shortName || game.name}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link href={`/gaming/${game.slug}/codes-today`}>
                <Calendar className="h-5 w-5" />
                Today&apos;s Codes
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Month Navigation */}
      <section className="py-6 border-b border-border bg-muted/30">
        <PageContainer>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className="h-4 w-4" />
              Other Months:
            </span>
            {otherMonths.map((m) => (
              <Link
                key={m.monthYear}
                href={`/gaming/${game.slug}/codes-${m.monthYear}`}
                className="inline-flex items-center px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
              >
                {m.label}
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && !isFutureMonth && (
        <section className="py-8 border-b border-border">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3">Best Code This Month</p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* All Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Tag className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All {monthName} {parsed.year} Codes ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                {isFutureMonth ? 'Expected codes - check back soon' : 'Complete archive of codes for this month'}
              </p>
            </div>
          </div>
          
          {activeCodes.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isFutureMonth ? 'No codes yet' : 'No codes archived'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isFutureMonth 
                    ? `Check back when ${monthName} begins for new codes.`
                    : 'No codes were available during this period.'}
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}/codes-today`}>View Today&apos;s Codes</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* SEO Content */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {game.name} Codes for {monthName} {parsed.year}
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This page contains all {game.name} promo codes that were active during {monthName} {parsed.year}. 
                Whether you&apos;re looking for current codes or researching past promotions, we maintain a complete archive 
                of every code released.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {game.name} typically releases new promo codes during special events, game updates, and collaborations. 
                Major releases often happen during holidays and anniversary celebrations. We track all official sources 
                including the game&apos;s social media, livestreams, and community events to ensure no code is missed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To redeem {game.name} codes, open the game and navigate to the redemption center or settings menu. 
                Enter each code exactly as shown (codes are case-sensitive) and claim your rewards. Most codes can only 
                be used once per account, so make sure to redeem them before they expire.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">More {game.name} Resources</h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Game Overview</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Tag className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium text-foreground">All Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes-today`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Calendar className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Today&apos;s Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/rewards`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gift className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Free Rewards</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Other Games - {monthName} {parsed.year}</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/codes-${monthYear}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </PageContainer>
      </section>
      
      <Footer />
    </div>
  )
}
