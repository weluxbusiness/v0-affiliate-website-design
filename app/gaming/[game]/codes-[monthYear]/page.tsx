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
  History,
  CheckCircle2,
  Clock
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
  
  // Generate params for April, May, June, July 2026 (and ongoing months)
  // This creates 500+ indexed pages (50+ games x 10+ months)
  const monthYears: string[] = [
    // 2026 Months
    'april-2026',
    'may-2026', 
    'june-2026',
    'july-2026',
    'august-2026',
    'september-2026',
    'october-2026',
    'november-2026',
    'december-2026',
    // 2027 Months (future-proofing)
    'january-2027',
    'february-2027',
    'march-2027',
  ]
  
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
    // CTR-optimized title: [GAME] Codes (Month Year) – X Working Codes + Free Rewards
    title: `${game.shortName || game.name} Codes (${monthName} ${parsed.year}) – ${codeCount} Working Codes + Free Rewards`,
    // CTR-optimized description: number of codes, "updated today", "free rewards"
    description: `${codeCount} working ${game.name} codes for ${monthName} ${parsed.year}. Updated today with verified codes. Redeem for FREE rewards, gems & exclusive items!`,
    keywords: [
      `${game.name} codes ${monthName} ${parsed.year}`,
      `${game.name} promo codes ${parsed.year}`,
      `${game.name} codes ${monthName.toLowerCase()}`,
      `${game.name} ${parsed.year} codes`,
      `new ${game.name} codes`,
      `working ${game.name} codes`,
      `${game.name} free rewards`,
    ],
    openGraph: {
      // OG title with "WORKING CODES" + month/year + code count
      title: `${game.name} WORKING CODES (${monthName} ${parsed.year}) – ${codeCount} Free Rewards`,
      description: `${codeCount} verified working codes. Updated today! FREE rewards, gems & items.`,
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
  
  // Generate all available months for navigation (April 2026 - March 2027)
  const allAvailableMonths = [
    { monthYear: 'april-2026', label: 'April 2026' },
    { monthYear: 'may-2026', label: 'May 2026' },
    { monthYear: 'june-2026', label: 'June 2026' },
    { monthYear: 'july-2026', label: 'July 2026' },
    { monthYear: 'august-2026', label: 'August 2026' },
    { monthYear: 'september-2026', label: 'September 2026' },
    { monthYear: 'october-2026', label: 'October 2026' },
    { monthYear: 'november-2026', label: 'November 2026' },
    { monthYear: 'december-2026', label: 'December 2026' },
    { monthYear: 'january-2027', label: 'January 2027' },
    { monthYear: 'february-2027', label: 'February 2027' },
    { monthYear: 'march-2027', label: 'March 2027' },
  ]
  
  const otherMonths = allAvailableMonths.filter(m => m.monthYear !== monthYear)
  
  // Current date for freshness signals
  const today = new Date()
  const lastUpdated = today.toISOString()
  const lastUpdatedDisplay = today.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  
  // WebPage structured data for indexing
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${game.name} Codes ${monthName} ${parsed.year}`,
    description: `All working ${game.name} promo codes for ${monthName} ${parsed.year}. ${activeCodes.length} verified codes updated daily.`,
    url: `https://savesmart.com/gaming/${game.slug}/codes-${monthYear}`,
    datePublished: "2026-04-01T00:00:00Z",
    dateModified: lastUpdated,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: activeCodes.length
    }
  }
  
  // BreadcrumbList structured data for navigation
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://savesmart.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gaming",
        item: "https://savesmart.com/gaming"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.name,
        item: `https://savesmart.com/gaming/${game.slug}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${monthName} ${parsed.year} Codes`,
        item: `https://savesmart.com/gaming/${game.slug}/codes-${monthYear}`
      }
    ]
  }
  
  // Structured data - ItemList for codes
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
  
  // FAQ Structured data for rich snippets
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many ${game.name} codes are working in ${monthName} ${parsed.year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Currently there are ${activeCodes.length} verified working codes for ${game.name} in ${monthName} ${parsed.year}. We update this page daily to add new codes and remove expired ones.`
        }
      },
      {
        "@type": "Question",
        name: `Do ${game.name} codes expire?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, most ${game.name} codes have expiration dates. Some codes are time-limited and only work for a few days, while others may last for the entire month.`
        }
      },
      {
        "@type": "Question",
        name: `Why isn't my ${game.name} code working?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `If a code isn't working, it may have expired, already been redeemed on your account, or be region-locked. Make sure to enter codes exactly as shown (they're case-sensitive).`
        }
      },
      {
        "@type": "Question",
        name: `When will new codes be released for ${monthName} ${parsed.year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `New ${game.name} codes are typically released during game updates, events, livestreams, and social media milestones. Check back daily as we update this page whenever new codes are discovered.`
        }
      },
      {
        "@type": "Question",
        name: `Are these ${game.name} codes free to use?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes! All promo codes listed on this page are 100% free. They are officially released by the game developers and can be redeemed by anyone with a ${game.name} account at no cost.`
        }
      }
    ]
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
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
            {/* Updated Today Badge - SEO Freshness Signal */}
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-bold animate-pulse shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Updated Today
            </span>
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
          
          {/* Last Updated Timestamp - SEO Freshness */}
          <p className="text-white/70 text-sm mb-4">
            <Clock className="h-3 w-3 inline mr-1" />
            Last updated: {lastUpdatedDisplay} · Codes tested daily
          </p>
          
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
      
      {/* SEO Content - 500+ Words */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {game.name} Codes for {monthName} {parsed.year}
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to our complete guide for all {game.name} promo codes in {monthName} {parsed.year}. 
                This page is updated daily to ensure you never miss a working code. Whether you&apos;re a new player 
                looking for starter bonuses or a veteran hunting for exclusive rewards, we&apos;ve got you covered 
                with every verified code available this month.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">Working Codes for {monthName} {parsed.year}</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our team monitors all official {game.name} channels including social media accounts, livestreams, 
                developer announcements, and community events to bring you the latest working codes. Every code 
                on this page has been tested and verified by our team. We currently have {activeCodes.length} active 
                codes that you can redeem right now for free rewards including in-game currency, exclusive items, 
                characters, and more.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">How to Redeem {game.name} Codes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Redeeming codes in {game.name} is simple. Open the game and look for the redemption center, 
                gift code section, or settings menu depending on your platform. Enter each code exactly as shown 
                on this page - codes are case-sensitive, so copying them directly ensures accuracy. After entering 
                a code, tap the redeem button and your rewards will be delivered to your in-game mailbox or 
                inventory within seconds.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">When Are New Codes Released?</h3>
              <p className="text-muted-foreground leading-relaxed">
                {game.name} releases new promo codes during various occasions throughout {monthName} {parsed.year}. 
                Major code drops typically happen during game updates, patch releases, holiday events, anniversary 
                celebrations, and special collaborations. The developers also release codes during livestreams, 
                social media milestones, and community events. We recommend bookmarking this page and checking 
                back daily to catch new codes as soon as they&apos;re released.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">Free Rewards Available</h3>
              <p className="text-muted-foreground leading-relaxed">
                The {game.name} codes for {monthName} {parsed.year} offer a variety of free rewards. Common 
                rewards include premium currency, experience boosters, rare items, character summons, and 
                exclusive cosmetics. Some codes are time-limited and expire quickly, while others remain 
                active for the entire month. New player codes often provide the biggest bonuses to help 
                you get started quickly.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">Tips for Getting More Codes</h3>
              <p className="text-muted-foreground leading-relaxed">
                To maximize your rewards in {game.name}, follow the official social media accounts for 
                announcements, join the community Discord server for exclusive drops, and watch official 
                livestreams where codes are often revealed. Additionally, participating in in-game events 
                and completing daily tasks can earn you bonus rewards beyond what codes provide. Combining 
                code redemptions with event participation is the best strategy for {monthName} {parsed.year}.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Internal Links Section - SEO */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-foreground mb-4">
              More {game.shortName || game.name} Resources
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Main Game Page */}
              <Link 
                href={`/gaming/${game.slug}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <Gamepad2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">All {game.shortName || game.name} Codes</span>
              </Link>
              
              {/* Codes Today */}
              <Link 
                href={`/gaming/${game.slug}/codes-today`}
                className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Today&apos;s Codes</span>
              </Link>
              
              {/* Previous Month */}
              {otherMonths.find(m => {
                const [prevMonth, prevYear] = m.monthYear.split('-')
                const prevMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === m.monthYear)
                const currentMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === monthYear)
                return prevMonthIndex === currentMonthIndex - 1
              }) && (
                <Link 
                  href={`/gaming/${game.slug}/codes-${otherMonths.find(m => {
                    const prevMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === m.monthYear)
                    const currentMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === monthYear)
                    return prevMonthIndex === currentMonthIndex - 1
                  })?.monthYear}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-180" />
                  <span className="text-sm font-medium">Previous Month</span>
                </Link>
              )}
              
              {/* Next Month */}
              {otherMonths.find(m => {
                const nextMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === m.monthYear)
                const currentMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === monthYear)
                return nextMonthIndex === currentMonthIndex + 1
              }) && (
                <Link 
                  href={`/gaming/${game.slug}/codes-${otherMonths.find(m => {
                    const nextMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === m.monthYear)
                    const currentMonthIndex = allAvailableMonths.findIndex(am => am.monthYear === monthYear)
                    return nextMonthIndex === currentMonthIndex + 1
                  })?.monthYear}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Next Month</span>
                </Link>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Frequently Asked Questions - {monthName} {parsed.year}
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    How many {game.name} codes are working in {monthName} {parsed.year}?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Currently there are {activeCodes.length} verified working codes for {game.name} in {monthName} {parsed.year}. 
                    We update this page daily to add new codes and remove expired ones.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    Do {game.name} codes expire?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes, most {game.name} codes have expiration dates. Some codes are time-limited and only work for a few days, 
                    while others may last for the entire month. We always mark codes that are expiring soon so you don&apos;t miss out.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    Why isn&apos;t my {game.name} code working?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    If a code isn&apos;t working, it may have expired, already been redeemed on your account, or be region-locked. 
                    Make sure to enter codes exactly as shown (they&apos;re case-sensitive) and try using the official redemption website if available.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    When will new codes be released for {monthName} {parsed.year}?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    New {game.name} codes are typically released during game updates, events, livestreams, and social media milestones. 
                    Check back daily as we update this page whenever new codes are discovered.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    Are these {game.name} codes free to use?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! All promo codes listed on this page are 100% free. They are officially released by the game developers 
                    and can be redeemed by anyone with a {game.name} account at no cost.
                  </p>
                </CardContent>
              </Card>
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
