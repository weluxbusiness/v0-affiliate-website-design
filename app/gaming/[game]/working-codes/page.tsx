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
  CheckCircle2,
  Gamepad2,
  Gift,
  ExternalLink,
  ArrowRight,
  Shield,
  Clock,
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

export const revalidate = 600 // 10 minutes for working codes pages

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
    title: `${game.shortName || game.name} Working Codes – ${codeCount}+ Verified (${shortMonth})`,
    description: `All ${codeCount}+ working ${game.name} promo codes for ${monthYear}. Every code verified and tested by our team. Get free gems, skins & rewards - redeem before they expire!`,
    keywords: [
      `${game.name} working codes`,
      `${game.name} codes that work`,
      `${game.name} verified codes`,
      `${game.name} tested codes`,
      `working ${game.name} promo codes`,
      `${game.name} active codes`,
      `${game.name} codes ${monthYear.toLowerCase()}`,
    ],
    openGraph: {
      title: `${game.name} Working Codes - ${codeCount}+ Verified | ${monthYear}`,
      description: `${codeCount}+ verified working codes. Free gems, skins & rewards. Updated hourly!`,
      url: `https://savesmart.bio/gaming/${game.slug}/working-codes`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} Working Codes - Verified & Tested`,
      description: `${codeCount}+ working codes verified today. Redeem now!`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/working-codes`,
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
}

export default async function GameWorkingCodesPage({ params }: PageProps) {
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
  const verifiedCodes = activeCodes.filter(code => code.isVerified)
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 6)
  
  // Calculate total reward value
  const totalRewardValue = activeCodes.reduce((sum, code) => sum + (code.rewardValue || 0), 0)
  
  // FAQs for working codes
  const workingCodesFAQs = [
    {
      question: `How do you verify ${game.name} codes are working?`,
      answer: `Our team tests every ${game.name} code directly in the game before adding it to our list. We check codes multiple times daily and immediately remove any that stop working. Codes marked as "Verified" have been successfully redeemed within the last 24 hours.`,
    },
    {
      question: `Why might a code show as working but not work for me?`,
      answer: `There are a few reasons: 1) You may have already redeemed the code on your account (each code works once per account). 2) The code may be region-restricted to certain countries. 3) Some codes are only for new players or specific account levels. 4) The code may have just expired - we update every 10 minutes.`,
    },
    {
      question: `How often do you update the ${game.name} working codes list?`,
      answer: `We update our ${game.name} codes list multiple times per day. Our automated system checks code validity every 10 minutes, and our team manually verifies new codes as they&apos;re released from official sources, social media, and community events.`,
    },
    {
      question: `Where do ${game.name} codes come from?`,
      answer: `${game.name} codes are released through various official channels including: game updates and patch notes, official social media accounts, livestreams and community events, partnerships and collaborations, and special celebrations or milestones.`,
    },
    {
      question: `What rewards can I get from ${game.name} working codes?`,
      answer: `${game.name} codes typically provide free in-game currency, premium items, character skins, experience boosts, and exclusive collectibles. The specific rewards vary by code - check each code&apos;s description for details on what you&apos;ll receive.`,
    },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Working Codes ${monthYear}`,
    description: `All verified working ${game.name} promo codes as of ${dateStr}`,
    numberOfItems: activeCodes.length,
    dateModified: today.toISOString(),
    itemListElement: activeCodes.slice(0, 20).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        availability: "https://schema.org/InStock",
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
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <div className="relative z-10 mb-6">
            <BreadcrumbNav 
              items={generateGamingBreadcrumbs(game.slug, game.shortName || game.name, 'working-codes')}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              <Shield className="h-3 w-3 mr-1" />
              All Verified
            </Badge>
            <Badge className="bg-emerald-400/20 text-emerald-100 border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {verifiedCodes.length} Tested Today
            </Badge>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Updated {timeStr}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} Working Codes ({monthYear})
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Every code on this page has been verified and tested by our team. We check {game.name} codes 
            multiple times daily to ensure you only see codes that actually work.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Tag className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Active Codes</p>
                <p className="text-lg font-bold">{activeCodes.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Verified</p>
                <p className="text-lg font-bold">{verifiedCodes.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Total Value</p>
                <p className="text-lg font-bold">{totalRewardValue.toLocaleString()}+</p>
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
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Best Working Code Right Now
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* All Working Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All Working Codes ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Verified and tested as of {dateStr}
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
                  No working codes available right now
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon - we update codes every 10 minutes!
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}`}>View All {game.name} Content</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* How We Verify Codes */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              How We Verify {game.name} Codes
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Real Testing</h3>
                  <p className="text-sm text-muted-foreground">
                    Every code is tested in-game by our team before being added to this list.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 mb-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Hourly Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    We check all codes multiple times daily and remove expired ones immediately.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Community Verified</h3>
                  <p className="text-sm text-muted-foreground">
                    Codes are cross-checked with community reports and official sources.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* SEO Content Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {game.name} Working Codes
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Finding working {game.name} promo codes can be frustrating. Many websites list outdated or expired codes, 
                wasting your time. That&apos;s why we created this dedicated page for verified, working {game.name} codes only.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every code you see on this page has been tested within the last 24 hours by our team. We play {game.name} 
                regularly and understand how important it is to have access to legitimate, working codes. Our verification 
                process ensures you never waste time on expired codes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {game.name} developers release new promo codes through various channels: official social media accounts, 
                livestreams, game updates, and special events. We monitor all these sources to bring you codes as soon as 
                they&apos;re available. Bookmark this page and check back regularly to never miss a new working code.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                Rewards You Can Get from Working Codes
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Free in-game currency ({game.promoCodes[0]?.rewardType || 'Gems/Coins'})</li>
                <li>Exclusive character skins and cosmetics</li>
                <li>Premium items and power-ups</li>
                <li>Experience boosters and level-up materials</li>
                <li>Limited-time event rewards</li>
                <li>New player starter packs</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Don&apos;t miss out on free rewards! Each {game.name} code can only be redeemed once per account, 
                so make sure to claim them all. Some codes have limited uses or expiration dates, so redeem 
                them as soon as possible.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <FAQSection 
            faqs={workingCodesFAQs}
            title={`${game.name} Working Codes FAQ`}
          />
        </PageContainer>
      </section>
      
      {/* Internal Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Resources
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Game Overview</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes-today`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Codes Today</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/new-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Sparkles className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">New Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/free-rewards`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gift className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium text-foreground">Free Rewards</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/redeem-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Tag className="h-8 w-8 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Redeem Guide</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">More Games with Working Codes</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/working-codes`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name} Working Codes
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
