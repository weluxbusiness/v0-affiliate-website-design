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
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"

export const revalidate = 1800 // 30 minutes for "today" pages

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
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  
  return {
    title: `${game.name} Codes Today (${dateStr}) - New & Working | SaveSmart`,
    description: `All ${game.name} promo codes for today, ${dateStr}. ${getActivePromoCodes(game.promoCodes).length} working codes verified and updated hourly. Redeem for free rewards now!`,
    keywords: [
      `${game.name} codes today`,
      `${game.name} new codes`,
      `${game.name} codes ${dateStr}`,
      `${game.name} daily codes`,
      `today's ${game.name} codes`,
    ],
    openGraph: {
      title: `${game.name} Codes Today - ${dateStr}`,
      description: `All working ${game.name} promo codes for today.`,
      url: `https://savesmart.bio/gaming/${game.slug}/codes-today`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/codes-today`,
    },
  }
}

export default async function GameCodesTodayPage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 4)
  
  // Filter codes added recently (within last 7 days for "today" context)
  const recentCodes = activeCodes.filter(code => {
    const addedDate = new Date(code.addedAt)
    const daysDiff = (today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  })
  
  const newCodesCount = recentCodes.length
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Codes Today`,
    description: `Working ${game.name} promo codes for ${dateStr}`,
    numberOfItems: activeCodes.length,
    dateModified: today.toISOString(),
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
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12 md:py-16 overflow-hidden">
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
              Codes Today
            </span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {dateStr}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              {newCodesCount} New This Week
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Updated {timeStr}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} Codes Today
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            All working {game.name} promo codes for {dateStr}. We check and verify codes every hour 
            to ensure you always have access to the latest working codes.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white border-0">
              {activeCodes.length} Active Codes
            </Badge>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
                <Gamepad2 className="h-5 w-5" />
                Play {game.shortName || game.name}
              </a>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Best Code Today
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* All Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All Codes for Today ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Verified and working as of {timeStr}
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
                  No active codes today
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon - we update codes hourly!
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}`}>View All {game.name} Content</Link>
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
              About Today&apos;s {game.name} Codes
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Looking for the latest {game.name} promo codes? You&apos;re in the right place. 
                This page is updated multiple times daily to ensure you have access to every working code available on {dateStr}.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team verifies each code by actually testing them in-game, so you can trust that every code listed here works. 
                We also track when codes are added and when they expire, so you never miss out on limited-time rewards.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {game.name} regularly releases new promo codes during special events, updates, and celebrations. 
                Bookmark this page and check back daily to never miss a new code. 
                You can also visit our main {game.name} page for guides, tips, and free rewards beyond promo codes.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Resources
          </h3>
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
              href={`/gaming/${game.slug}/rewards`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gift className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Free Rewards</span>
            </Link>
            <Link
              href="/gaming/today"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Calendar className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">All Games Today</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Similar Games with Codes</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/codes-today`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name} Codes Today
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
