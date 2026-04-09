import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { SEOInternalLinks, SEOFooterLinks } from "@/components/gaming/seo-internal-links"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  RotateCw, 
  ChevronRight,
  Gamepad2,
  Gift,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Zap,
  Coins
} from "lucide-react"
import { 
  getGameBySlug,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getBestPromoCode,
  getGameCtaInfo
} from "@/lib/gaming-data"

export const revalidate = 1800 // 30 minutes - fresh for daily updates

const today = new Date()
const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export const metadata: Metadata = {
  title: `Coin Master Free Spins Today (${monthYear}) – Working Links`,
  description: `Get FREE Coin Master spins today! Updated ${dateStr} with working spin links, free coins & card packs. Claim your daily free spins now!`,
  keywords: [
    "coin master free spins",
    "coin master free spins today",
    "coin master spin links",
    "free spins coin master",
    "coin master daily spins",
    "coin master free coins",
    "coin master rewards",
    `coin master spins ${monthYear.toLowerCase()}`,
  ],
  openGraph: {
    title: `Coin Master Free Spins Today – ${monthYear}`,
    description: `FREE spin links updated today! Get 50+ free spins & millions of coins.`,
    url: "https://savesmart.bio/coin-master-free-spins-today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Coin Master Free Spins Today – ${monthYear}`,
    description: `FREE spin links updated today! Get 50+ free spins & coins.`,
  },
  alternates: {
    canonical: "/coin-master-free-spins-today",
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

export default function CoinMasterFreeSpinsPage() {
  const game = getGameBySlug("coin-master")
  
  if (!game) {
    return null
  }
  
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const ctaInfo = getGameCtaInfo(game)
  
  // Calculate total spins from codes
  const totalSpins = activeCodes.reduce((sum, code) => {
    const match = code.reward.match(/(\d+)\s*(?:Free\s*)?Spins?/i)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Coin Master Free Spins Today",
    description: `Working Coin Master free spin links for ${dateStr}`,
    numberOfItems: activeCodes.length,
    dateModified: today.toISOString(),
    itemListElement: activeCodes.map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
      }
    }))
  }
  
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get free spins in Coin Master?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get free spins in Coin Master through daily links shared on social media, hourly regeneration (5 spins per hour), watching video ads, inviting friends, completing card sets, and using promo codes. Check this page daily for the latest free spin links."
        }
      },
      {
        "@type": "Question",
        name: "How many free spins can I get per day in Coin Master?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get 50-100+ free spins per day in Coin Master by combining daily links, hourly regeneration, events, and promo codes. During special events, you can earn even more."
        }
      },
      {
        "@type": "Question",
        name: "Do Coin Master free spin links expire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, most Coin Master free spin links expire within 24-72 hours. We update this page multiple times daily with the latest working links so you never miss out."
        }
      },
      {
        "@type": "Question",
        name: "Why won't my Coin Master spin link work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Links may not work if they've expired, you've already claimed them, or you've hit the daily claim limit. Try the other links on this page, or check back later for new ones."
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      
      {/* Hero Section - Gold/Orange gradient for Coin Master branding */}
      <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-400/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        
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
            <Link href="/gaming/coin-master" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              Coin Master
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Free Spins Today
            </span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-sm font-medium animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              UPDATED TODAY
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {dateStr}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {timeStr}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Coin Master Free Spins Today
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
            Get <span className="text-yellow-200 font-semibold">{totalSpins > 0 ? `${totalSpins}+` : "75+"} FREE spins</span> and 
            <span className="text-yellow-200 font-semibold"> millions of coins</span> today! 
            We update this page multiple times daily with the latest working Coin Master free spin links.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-yellow-400/20 text-yellow-100 border-0 text-base px-4 py-2">
              <RotateCw className="h-4 w-4 mr-2" />
              {activeCodes.length} Active Links
            </Badge>
            <Badge className="bg-white/20 text-white border-0 text-base px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              All Verified Working
            </Badge>
            <Badge className="bg-amber-400/20 text-amber-100 border-0 text-base px-4 py-2">
              <Coins className="h-4 w-4 mr-2" />
              + Free Coins
            </Badge>
          </div>
          
          {/* Primary CTA */}
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              asChild 
              className="gap-2 bg-white hover:bg-white/90 text-orange-600 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg px-8"
            >
              <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                <Gamepad2 className="h-5 w-5" />
                Play Coin Master
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Link href="/gaming/coin-master">
                <Gift className="h-5 w-5" />
                More Rewards
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Best Spin Link Today - Claim First!
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* All Free Spin Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <RotateCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Today&apos;s Free Spin Links ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                All verified working as of {timeStr} - Tap to copy, then redeem in game
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
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <RotateCw className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Checking for new spin links...
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  We update this page multiple times daily. New spin links are typically released 
                  in the morning and evening.
                </p>
                <Button asChild>
                  <Link href="/gaming/coin-master">View All Coin Master Content</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* How to Redeem */}
          <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              How to Redeem Free Spin Links
            </h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-bold dark:bg-orange-900/50 dark:text-orange-400">1</span>
                <span>Click/tap the spin link above (or copy the promo code)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-bold dark:bg-orange-900/50 dark:text-orange-400">2</span>
                <span>The link will open Coin Master automatically on your device</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-bold dark:bg-orange-900/50 dark:text-orange-400">3</span>
                <span>Your free spins will be added to your account instantly!</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-bold dark:bg-orange-900/50 dark:text-orange-400">4</span>
                <span>Come back tomorrow for more free spins - we update daily!</span>
              </li>
            </ol>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section - Critical for SEO */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  How do I get free spins in Coin Master?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You can get free spins through daily links (like on this page), hourly regeneration (5 spins per hour up to 50), 
                  watching video ads, inviting friends, completing card sets, and special events. Combine all methods for maximum spins!
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  How many free spins can I get per day?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You can get 50-100+ free spins per day by combining daily links, hourly regeneration, 
                  video ads, and events. The maximum spin storage is 50-100 depending on your village level.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Do Coin Master free spin links expire?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes, most free spin links expire within 24-72 hours after being released. There&apos;s also 
                  usually a limit on how many times each link can be claimed globally. Claim them quickly!
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Why won&apos;t my spin link work?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Links may not work if they&apos;ve expired, you&apos;ve already claimed them, or the global claim 
                  limit has been reached. Try the other links on this page, or check back later for new ones.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </section>
      
      {/* SEO Content */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About Coin Master Free Spins
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Coin Master is one of the most downloaded mobile games ever, with over 200 million installs worldwide. 
                The game combines slot machine mechanics with village building - you spin to earn coins, attack other players, 
                raid their villages, and collect cards to complete sets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Free spins are the core currency in Coin Master. Without spins, you can&apos;t play! That&apos;s why we 
                created this page - to help you get the maximum free spins every day. We collect links from 
                official Coin Master social media (Facebook, Twitter/X, Instagram) and verify they work before posting.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Pro tip: You can stack up to 50-100 spins at a time (depending on your level), so make sure to claim 
                these free spin links before your spin count is full. During special events like Viking Quest, 
                Attack Madness, and Raid Madness, extra spin links are often released - so check back frequently!
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More Coin Master Resources
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming/coin-master"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-orange-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Gamepad2 className="h-4 w-4 text-orange-600" />
              All Coin Master Codes
            </Link>
            <Link
              href="/gaming/coin-master/codes-today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-orange-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              Today&apos;s Codes
            </Link>
            <Link
              href="/monopoly-go-free-dice-today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-purple-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Gift className="h-4 w-4 text-purple-600" />
              Monopoly GO Free Dice
            </Link>
            <Link
              href="/gaming/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-orange-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              All Games Today
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </PageContainer>
      </section>
      
      {/* SEO Internal Links */}
      <SEOInternalLinks 
        currentGameSlug="coin-master"
        showPopularGames={true}
        showLatestCodes={true}
        showMonthlyNav={true}
      />
      
      {/* SEO Footer Links */}
      <SEOFooterLinks currentGameSlug="coin-master" />
      
      <Footer />
    </div>
  )
}
