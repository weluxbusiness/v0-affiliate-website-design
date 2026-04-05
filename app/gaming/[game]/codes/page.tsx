import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { BreadcrumbNav, generateGamingBreadcrumbs } from "@/components/seo/breadcrumb-nav"
import { LastUpdated } from "@/components/seo/last-updated"
import { InternalLinksWidget } from "@/components/seo/internal-links-widget"
import { ContextualLinksList, gamingContextualLinks } from "@/components/seo/contextual-links"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  ExternalLink,
  ArrowRight
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  getExpiredPromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"

export const revalidate = 3600

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
    return {
      title: "Game Not Found | SaveSmart Gaming",
    }
  }
  
  const year = new Date().getFullYear()
  const shortMonth = new Date().toLocaleString('default', { month: 'short' })
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const primaryReward = game.promoCodes[0]?.rewardType || 'Rewards'
  const benefit = primaryReward === 'Primogems' ? 'Primogems' : primaryReward === 'V-Bucks' ? 'V-Bucks' : primaryReward === 'Gems' ? 'Gems' : 'Rewards'
  
  return {
    title: `${game.shortName || game.name} Codes – ${codeCount}+ Working Free ${benefit} (${shortMonth} ${year})`,
    description: `Complete list of all ${game.name} promo codes for ${year}. ${codeCount} verified working codes. Redeem for free ${game.promoCodes[0]?.rewardType || 'rewards'} and in-game items.`,
    keywords: [
      `${game.name} codes`,
      `${game.name} promo codes ${year}`,
      `${game.name} redeem codes`,
      `${game.name} codes list`,
      `all ${game.name} codes`,
      `working ${game.name} codes`,
    ],
    openGraph: {
      title: `All ${game.name} Promo Codes ${year}`,
      description: `Complete list of all working ${game.name} promo codes.`,
      url: `https://savesmart.bio/gaming/${game.slug}/codes`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/codes`,
    },
  }
}

export default async function GameCodesPage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const expiredCodes = getExpiredPromoCodes(game.promoCodes)
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 4)
  
  // FAQPage schema for codes
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I redeem ${game.name} promo codes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `To redeem ${game.name} promo codes, open the game and look for the settings or promo code section. Enter the code exactly as shown and click redeem to receive your rewards.`
        }
      },
      {
        "@type": "Question",
        name: `Are ${game.name} promo codes free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, all ${game.name} promo codes listed on SaveSmart are completely free to use. Simply copy the code and redeem it in-game for free rewards.`
        }
      },
      {
        "@type": "Question",
        name: `How often are new ${game.name} codes released?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `New ${game.name} promo codes are typically released during special events, updates, and celebrations. We update our list daily to ensure all codes are current.`
        }
      }
    ]
  }
  
  // ItemList schema for codes
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Promo Codes`,
    description: `Complete list of all working ${game.name} promo codes`,
    numberOfItems: activeCodes.length,
    itemListElement: activeCodes.slice(0, 20).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        url: `https://savesmart.bio/gaming/${game.slug}/codes`
      }
    }))
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumb with JSON-LD Schema */}
          <div className="relative z-10 mb-6">
            <BreadcrumbNav 
              items={generateGamingBreadcrumbs(game.slug, game.shortName || game.name, 'codes')}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Tag className="h-3 w-3 mr-1" />
              All Promo Codes
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              {activeCodes.length} Active
            </span>
            <LastUpdated className="text-white/70 [&_time]:text-white/90" />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            All {game.name} Promo Codes
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Complete list of all working {game.name} promo codes for {new Date().getFullYear()}. 
            Every code is verified and tested.
          </p>
          
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
              <Gamepad2 className="h-5 w-5" />
              Play {game.shortName || game.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Active Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Tag className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Active Codes ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Working codes you can redeem right now
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
                  No active codes right now
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon - we update codes daily!
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}`}>
                    View Game Page
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* Expired Codes (for reference) */}
      {expiredCodes.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-muted-foreground">
                Expired Codes ({expiredCodes.length})
              </h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              These codes are no longer active but are kept for reference.
            </p>
            
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {expiredCodes.map((code) => (
                <div 
                  key={code.id}
                  className="p-3 rounded-lg border border-border bg-background/50 opacity-60"
                >
                  <code className="font-mono text-sm text-muted-foreground line-through">
                    {code.code}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {code.reward}
                  </p>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Similar Games with Codes
              </h3>
              <Link 
                href="/gaming"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/gaming/${relatedGame.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
                >
                  <Gamepad2 className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {relatedGame.shortName || relatedGame.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getActivePromoCodes(relatedGame.promoCodes).length} codes
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Internal Links Widget */}
      <section className="py-8 border-t border-border">
        <PageContainer>
          <InternalLinksWidget 
            pageType="gaming" 
            currentSlug={game.slug}
          />
        </PageContainer>
      </section>
      
      {/* Contextual Links */}
      <section className="py-8 border-t border-border">
        <PageContainer>
          <ContextualLinksList 
            links={gamingContextualLinks.filter(l => !l.href.includes(game.slug))}
          />
        </PageContainer>
      </section>
      
      {/* Quick Links */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Pages
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/gaming/${game.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              {game.name} Overview
            </Link>
            <Link
              href={`/gaming/${game.slug}/rewards`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
            <Link
              href="/gaming/promo-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Gaming Codes
            </Link>
          </div>
        </PageContainer>
      </section>
      
      <Footer />
    </div>
  )
}
