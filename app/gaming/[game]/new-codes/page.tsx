import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { BreadcrumbNav, generateGamingBreadcrumbs } from "@/components/seo/breadcrumb-nav"
import { LastUpdated } from "@/components/seo/last-updated"
import { FAQSection } from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  Sparkles,
  Gamepad2,
  Gift,
  ExternalLink,
  ArrowRight,
  Clock,
  Calendar,
  Zap,
  CheckCircle2
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"

export const revalidate = 600 // 10 minutes for new codes pages

export async function generateStaticParams() {
  return getAllGameSlugs().map(slug => ({ game: slug }))
}

interface PageProps {
  params: Promise<{ game: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    return { title: "Game Not Found | SaveSmart Gaming" }
  }
  
  const today = new Date()
  const shortMonth = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const primaryReward = game.promoCodes[0]?.rewardType || 'Rewards'
  const benefit = primaryReward === 'Primogems' ? 'Primogems' : primaryReward === 'V-Bucks' ? 'V-Bucks' : primaryReward === 'Gems' ? 'Gems' : 'Rewards'
  
  return {
    title: `${game.shortName || game.name} New Codes – ${codeCount}+ Free ${benefit} (${shortMonth})`,
    description: `Discover the newest ${game.name} promo codes for ${shortMonth}. ${codeCount}+ fresh codes just released. Get free gems, skins & exclusive rewards - updated daily!`,
    keywords: [
      `${game.name} new codes`,
      `${game.name} latest codes`,
      `new ${game.name} promo codes`,
      `${game.name} codes ${shortMonth.toLowerCase()}`,
      `${game.name} fresh codes`,
      `${game.name} recent codes`,
      `${game.name} codes this month`,
    ],
    openGraph: {
      title: `${game.name} New Codes - Latest ${codeCount}+ Rewards | ${shortMonth}`,
      description: `${codeCount}+ new codes just released. Free gems, skins & rewards!`,
      url: `https://savesmart.bio/gaming/${game.slug}/new-codes`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} New Codes - Fresh Releases`,
      description: `${codeCount}+ new codes available now. Redeem for free rewards!`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}`,
    },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function GameNewCodesPage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 6)
  
  // Filter codes by recency
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const newThisWeek = activeCodes.filter(code => new Date(code.addedAt) >= oneWeekAgo)
  const newThisMonth = activeCodes.filter(code => 
    new Date(code.addedAt) >= oneMonthAgo && new Date(code.addedAt) < oneWeekAgo
  )
  const olderCodes = activeCodes.filter(code => new Date(code.addedAt) < oneMonthAgo)
  
  // FAQs for new codes
  const newCodesFAQs = [
    {
      question: `When does ${game.name} release new codes?`,
      answer: `${game.name} typically releases new promo codes during game updates, special events, holidays, livestreams, and milestone celebrations. New codes can appear at any time, which is why we monitor all official channels and update our list multiple times daily.`,
    },
    {
      question: `How can I be first to know about new ${game.name} codes?`,
      answer: `Bookmark this page and check back regularly! We update our ${game.name} codes list within minutes of new codes being released. You can also follow the game&apos;s official social media accounts and enable notifications for announcements.`,
    },
    {
      question: `Do new ${game.name} codes expire quickly?`,
      answer: `Some new ${game.name} codes have short expiration windows, especially event codes that may only last a few days or have limited redemptions. We recommend redeeming new codes as soon as you see them to avoid missing out.`,
    },
    {
      question: `Are new codes better than older codes?`,
      answer: `New codes often provide current event rewards or seasonal items that older codes don&apos;t have. However, both new and older codes are valuable - make sure to redeem all working codes you haven&apos;t used yet!`,
    },
    {
      question: `Why should I check for new ${game.name} codes regularly?`,
      answer: `${game.name} developers release new codes throughout the month for various promotions. Regular players who check frequently can accumulate significant free rewards over time. Some codes also have limited redemptions and run out quickly.`,
    },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} New Codes ${monthYear}`,
    description: `Latest ${game.name} promo codes released in ${monthYear}`,
    numberOfItems: activeCodes.length,
    dateModified: today.toISOString(),
    itemListElement: activeCodes.slice(0, 20).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        datePosted: code.addedAt,
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
      <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <div className="relative z-10 mb-6">
            <BreadcrumbNav 
              items={generateGamingBreadcrumbs(game.slug, game.shortName || game.name, 'new-codes')}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Fresh Codes
            </Badge>
            <Badge className="bg-amber-300/20 text-amber-100 border-0">
              <Zap className="h-3 w-3 mr-1" />
              {newThisWeek.length} Added This Week
            </Badge>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Updated {timeStr}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} New Codes ({monthYear})
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            The latest {game.name} promo codes released this month. We update this list daily 
            so you never miss a new code. Redeem them quickly - some have limited uses!
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">New This Week</p>
                <p className="text-lg font-bold">{newThisWeek.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">This Month</p>
                <p className="text-lg font-bold">{newThisMonth.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Tag className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Total Active</p>
                <p className="text-lg font-bold">{activeCodes.length}</p>
              </div>
            </div>
          </div>
          
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
              <Gamepad2 className="h-5 w-5" />
              Play {game.shortName || game.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </PageContainer>
      </section>
      
      {/* Best New Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Best New Code
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* New This Week */}
      {newThisWeek.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  New This Week ({newThisWeek.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fresh codes added in the last 7 days
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newThisWeek.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* New This Month */}
      {newThisMonth.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Earlier This Month ({newThisMonth.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Codes added 1-4 weeks ago - still working!
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newThisMonth.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Older Active Codes */}
      {olderCodes.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                <CheckCircle2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Still Working ({olderCodes.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Older codes that are still active
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {olderCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* No Codes Fallback */}
      {activeCodes.length === 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No new codes available right now
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon - we update codes as soon as they&apos;re released!
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}`}>View All {game.name} Content</Link>
                </Button>
              </CardContent>
            </Card>
          </PageContainer>
        </section>
      )}
      
      {/* SEO Content Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {game.name} New Codes - {monthYear} Update
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to our {game.name} new codes page for {monthYear}! Here you&apos;ll find the freshest 
                promo codes released by the {game.name} developers. We organize codes by when they were added 
                so you can easily spot the newest releases.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {game.name} regularly releases new promo codes through various channels. These include official 
                social media announcements, game update celebrations, holiday events, livestreams, and community 
                milestones. Our team monitors all these sources around the clock to bring you codes as soon as 
                they go live.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                Why New Codes Matter
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                New {game.name} codes often have the best rewards because they&apos;re tied to current events 
                and promotions. They may include limited-time items, event currencies, or exclusive cosmetics 
                that won&apos;t be available once the promotion ends. Some new codes also have redemption limits, 
                meaning only a certain number of players can use them before they&apos;re disabled.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                How to Stay Updated
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Bookmark this page and check daily for updates</li>
                <li>Follow {game.name} official social media accounts</li>
                <li>Enable game notifications for announcements</li>
                <li>Join community Discord servers and forums</li>
                <li>Watch official livestreams where codes are often revealed</li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <FAQSection 
            faqs={newCodesFAQs}
            title={`${game.name} New Codes FAQ`}
          />
        </PageContainer>
      </section>
      
      {/* Internal Links */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Resources
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Game Overview</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes-today`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
            >
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Codes Today</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/working-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-foreground">Working Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/free-rewards`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
            >
              <Gift className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium text-foreground">Free Rewards</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/redeem-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
            >
              <Tag className="h-8 w-8 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Redeem Guide</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">More Games with New Codes</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/new-codes`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name} New Codes
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
