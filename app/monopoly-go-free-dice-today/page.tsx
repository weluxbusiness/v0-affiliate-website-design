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
  Dices, 
  ChevronRight,
  Gamepad2,
  Gift,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Zap
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
  title: `Monopoly GO Free Dice Links Today (${monthYear}) – Daily Rolls`,
  description: `Get FREE Monopoly GO dice links today! Updated ${dateStr} with working dice links, free rolls & stickers. Claim your daily free dice now!`,
  keywords: [
    "monopoly go free dice",
    "monopoly go free dice links today",
    "monopoly go dice links",
    "free dice monopoly go",
    "monopoly go daily dice",
    "monopoly go free rolls",
    "monopoly go stickers",
    `monopoly go dice ${monthYear.toLowerCase()}`,
  ],
  openGraph: {
    title: `Monopoly GO Free Dice Links Today – ${monthYear}`,
    description: `FREE dice links updated today! Get 100+ free dice rolls & stickers.`,
    url: "https://savesmart.bio/monopoly-go-free-dice-today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Monopoly GO Free Dice Links Today – ${monthYear}`,
    description: `FREE dice links updated today! Get 100+ free dice rolls.`,
  },
  alternates: {
    canonical: "/monopoly-go-free-dice-today",
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

export default function MonopolyGoFreeDicePage() {
  const game = getGameBySlug("monopoly-go")
  
  if (!game) {
    return null
  }
  
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const ctaInfo = getGameCtaInfo(game)
  
  // Calculate total dice from codes
  const totalDice = activeCodes.reduce((sum, code) => {
    const match = code.reward.match(/(\d+)\s*(?:Free\s*)?Dice/i)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Monopoly GO Free Dice Links Today",
    description: `Working Monopoly GO free dice links for ${dateStr}`,
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
        name: "How do I get free dice in Monopoly GO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get free dice in Monopoly GO by using daily links shared by the developers, completing in-game events, inviting friends, watching ads, and using promo codes. Check this page daily for the latest free dice links."
        }
      },
      {
        "@type": "Question",
        name: "How many free dice can I get per day in Monopoly GO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can typically get 50-200+ free dice per day in Monopoly GO by combining all available sources: daily links, hourly regeneration, events, and promo codes."
        }
      },
      {
        "@type": "Question",
        name: "Do Monopoly GO free dice links expire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, most Monopoly GO free dice links expire within 24-72 hours after being released. That's why we update this page multiple times daily to ensure you have access to the latest working links."
        }
      },
      {
        "@type": "Question",
        name: "Where can I find Monopoly GO free dice links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best place to find Monopoly GO free dice links is right here! We aggregate links from official Monopoly GO social media accounts and verify they work before posting."
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
      
      {/* Hero Section - Purple/Blue gradient for Monopoly GO branding */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
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
            <Link href="/gaming/monopoly-go" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              Monopoly GO
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Free Dice Today
            </span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm font-medium animate-pulse">
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
            Monopoly GO Free Dice Links Today
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
            Get <span className="text-yellow-300 font-semibold">{totalDice > 0 ? `${totalDice}+` : "100+"} FREE dice rolls</span> today! 
            We update this page multiple times daily with the latest working Monopoly GO free dice links, promo codes, and sticker rewards.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-yellow-500/20 text-yellow-200 border-0 text-base px-4 py-2">
              <Dices className="h-4 w-4 mr-2" />
              {activeCodes.length} Active Links
            </Badge>
            <Badge className="bg-white/20 text-white border-0 text-base px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              All Verified Working
            </Badge>
          </div>
          
          {/* Primary CTA */}
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              asChild 
              className="gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg px-8"
            >
              <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                <Gamepad2 className="h-5 w-5" />
                Play Monopoly GO
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link href="/gaming/monopoly-go">
                <Gift className="h-5 w-5" />
                More Rewards
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Best Dice Link Today - Claim First!
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* All Free Dice Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Dices className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Today&apos;s Free Dice Links ({activeCodes.length})
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
                <Dices className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Checking for new dice links...
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  We update this page multiple times daily. New dice links are usually released in the morning and evening.
                </p>
                <Button asChild>
                  <Link href="/gaming/monopoly-go">View All Monopoly GO Content</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* How to Redeem */}
          <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              How to Redeem Free Dice Links
            </h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold dark:bg-purple-900/50 dark:text-purple-400">1</span>
                <span>Copy the dice link or promo code above</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold dark:bg-purple-900/50 dark:text-purple-400">2</span>
                <span>Open Monopoly GO on your mobile device</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold dark:bg-purple-900/50 dark:text-purple-400">3</span>
                <span>Click the link or go to Settings → Promo Codes</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold dark:bg-purple-900/50 dark:text-purple-400">4</span>
                <span>Paste the code and tap Redeem - dice will be added instantly!</span>
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
                  How do I get free dice in Monopoly GO?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You can get free dice through daily links (like the ones on this page), completing events, 
                  inviting friends, watching ads, and using promo codes. We recommend checking this page daily 
                  for the latest free dice links.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  How many free dice can I get per day?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You can typically get 50-200+ free dice per day by combining all sources: daily links, 
                  hourly regeneration (5 dice every 60 min), events, and promo codes. Power users can get even more!
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Do Monopoly GO free dice links expire?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes, most free dice links expire within 24-72 hours after being released. That&apos;s why we 
                  update this page multiple times daily to ensure you always have access to working links.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Why isn&apos;t my dice link working?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Links may not work if they&apos;ve expired, you&apos;ve already claimed them, or there&apos;s a 
                  region restriction. Try refreshing this page for the latest verified links, and make sure 
                  your game is updated to the latest version.
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
              About Monopoly GO Free Dice Links
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Monopoly GO is one of the most popular mobile games in the world, with over 100 million downloads. 
                Dice are the core resource in the game - you need them to roll around the board, collect properties, 
                and complete events. Getting free dice is essential for progressing without spending money.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This page is your ultimate resource for Monopoly GO free dice links. We aggregate links from 
                official Monopoly GO social media accounts (Facebook, Instagram, Twitter/X, Discord) and verify 
                that each one works before posting. Our team updates this page multiple times daily, especially 
                during special events when extra dice links are released.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Beyond free dice links, you can also earn dice through in-game activities like completing sticker 
                sets, participating in tournaments, and finishing daily goals. Combine all these methods with our 
                daily dice links for maximum free rolls!
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More Monopoly GO Resources
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming/monopoly-go"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-purple-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Gamepad2 className="h-4 w-4 text-purple-600" />
              All Monopoly GO Codes
            </Link>
            <Link
              href="/gaming/monopoly-go/codes-today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-purple-500/50 text-sm font-medium text-foreground transition-colors"
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              Today&apos;s Codes
            </Link>
            <Link
              href="/gaming/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-purple-500/50 text-sm font-medium text-foreground transition-colors"
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
        currentGameSlug="monopoly-go"
        showPopularGames={true}
        showLatestCodes={true}
        showMonthlyNav={true}
      />
      
      {/* SEO Footer Links */}
      <SEOFooterLinks currentGameSlug="monopoly-go" />
      
      <Footer />
    </div>
  )
}
