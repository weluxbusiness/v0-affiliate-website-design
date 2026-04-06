import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FAQSection } from "@/components/seo"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  ArrowRight
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"

export const revalidate = 86400 // 24 hours - guide content doesn't change often

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
  
  const currentYear = new Date().getFullYear()
  const shortMonth = new Date().toLocaleString('default', { month: 'short' })
  const codeCount = getActivePromoCodes(game.promoCodes).length
  
  return {
    title: `How to Redeem ${game.shortName || game.name} Codes – ${codeCount}+ Working (${shortMonth} ${currentYear})`,
    description: `Complete guide to redeem ${game.name} promo codes. Step-by-step instructions for ${game.platforms.join(', ')}. ${codeCount}+ working codes inside. Redeem free rewards today!`,
    keywords: [
      `how to redeem ${game.name} codes`,
      `${game.name} redeem codes`,
      `${game.name} code redemption`,
      `${game.name} redeem codes guide`,
      `where to redeem ${game.name} codes`,
      `${game.name} promo code guide`,
      `${game.name} codes how to use`,
    ],
    openGraph: {
      title: `How to Redeem ${game.name} Codes - Complete Guide ${currentYear}`,
      description: `Step-by-step guide to redeem ${game.name} promo codes on all platforms. ${codeCount}+ working codes inside!`,
      url: `https://savesmart.bio/gaming/${game.slug}/redeem-codes`,
      type: "article",
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
      },
    },
  }
}

export default async function GameRedeemCodesGuidePage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 4)
  
  // Platform-specific redemption methods
  const hasMobile = game.platforms.some(p => ['Mobile', 'iOS', 'Android'].includes(p))
  const hasPC = game.platforms.some(p => ['PC', 'Windows', 'Mac'].includes(p))
  const hasConsole = game.platforms.some(p => ['PlayStation', 'Xbox', 'Nintendo Switch', 'Console'].includes(p))
  
  // Generate FAQs for this game
  const redeemFAQs = [
    {
      question: `Where do I enter ${game.name} promo codes?`,
      answer: `In ${game.name}, you can redeem codes through the in-game settings menu or the official redemption website. Look for a "Redeem Code" or "Gift Code" option in the game settings. Some games also have a dedicated redemption page on their official website.`,
    },
    {
      question: `Why isn't my ${game.name} code working?`,
      answer: `There are several reasons a code might not work: 1) The code has expired - check the expiration date on our page. 2) The code has reached its redemption limit. 3) You've already redeemed this code on your account. 4) The code is region-restricted. 5) You entered the code incorrectly - codes are case-sensitive.`,
    },
    {
      question: `Can I use ${game.name} codes on multiple accounts?`,
      answer: `Most ${game.name} promo codes can only be redeemed once per account. However, you can use the same code on different accounts if you have multiple. Some special codes may have additional restrictions.`,
    },
    {
      question: `How often are new ${game.name} codes released?`,
      answer: `${game.name} typically releases new promo codes during special events, updates, livestreams, and celebrations. We update our codes list multiple times daily to ensure you always have access to the latest working codes.`,
    },
    {
      question: `Where can I find more ${game.name} codes?`,
      answer: `We compile codes from official ${game.name} social media accounts, livestreams, community events, and partnerships. Bookmark this page and check back regularly - we update codes multiple times per day.`,
    },
  ]
  
  // Structured data for guide
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Redeem ${game.name} Promo Codes`,
    description: `Step-by-step guide to redeem promo codes in ${game.name} and get free rewards.`,
    totalTime: "PT2M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "Working promo code"
      },
      {
        "@type": "HowToSupply", 
        name: `${game.name} account`
      }
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: game.platforms.join(" or ")
      }
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Copy the Code",
        text: "Find a working code from our list and click to copy it to your clipboard.",
        position: 1
      },
      {
        "@type": "HowToStep",
        name: `Open ${game.name}`,
        text: `Launch ${game.name} and log into your account.`,
        position: 2
      },
      {
        "@type": "HowToStep",
        name: "Navigate to Redemption",
        text: "Go to Settings or Menu and find the 'Redeem Code' or 'Gift Code' option.",
        position: 3
      },
      {
        "@type": "HowToStep",
        name: "Enter the Code",
        text: "Paste the code exactly as shown and tap Confirm or Redeem.",
        position: 4
      },
      {
        "@type": "HowToStep",
        name: "Collect Rewards",
        text: "Check your in-game mailbox or inventory for your free rewards.",
        position: 5
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-12 md:py-16 overflow-hidden">
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
              Redeem Guide
            </span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              <BookOpen className="h-3 w-3 mr-1" />
              Step-by-Step Guide
            </Badge>
            <Badge className="bg-emerald-400/20 text-emerald-100 border-0">
              {activeCodes.length} Working Codes
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            How to Redeem {game.name} Codes ({currentMonth} {currentYear})
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Complete guide to redeeming {game.name} promo codes on {game.platforms.join(', ')}. 
            Follow our simple steps and get your free rewards in under 2 minutes.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link href={`/gaming/${game.slug}`}>
                <Tag className="h-5 w-5" />
                View All {activeCodes.length} Codes
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
                <Gamepad2 className="h-5 w-5" />
                Play {game.shortName || game.name}
              </a>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Quick Code to Try */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4 text-emerald-500" />
                Best Code to Try Now
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Step-by-Step Guide */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Step-by-Step: How to Redeem {game.name} Codes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Follow these 5 simple steps to claim your free rewards
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Copy className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-foreground text-lg">Copy the Code</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Browse our list of working {game.name} codes below. Click on any code to automatically 
                        copy it to your clipboard. Make sure to copy the code exactly as shown - codes are case-sensitive.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 2 */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Gamepad2 className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-foreground text-lg">Open {game.shortName || game.name}</h3>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Launch {game.name} on your device and make sure you&apos;re logged into the account 
                        where you want to receive the rewards.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hasMobile && (
                          <Badge variant="outline" className="gap-1">
                            <Smartphone className="h-3 w-3" />
                            Mobile
                          </Badge>
                        )}
                        {hasPC && (
                          <Badge variant="outline" className="gap-1">
                            <Monitor className="h-3 w-3" />
                            PC
                          </Badge>
                        )}
                        {hasConsole && (
                          <Badge variant="outline" className="gap-1">
                            <Gamepad2 className="h-3 w-3" />
                            Console
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 3 */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-foreground text-lg">Find the Redemption Section</h3>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Navigate to the code redemption area. This is usually found in:
                      </p>
                      <ul className="text-muted-foreground space-y-1 list-disc list-inside text-sm">
                        <li>Settings Menu → Redeem Code</li>
                        <li>Profile → Gift Code</li>
                        <li>Official website redemption page</li>
                        <li>In-game mail or events section</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 4 */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">4</span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-foreground text-lg">Paste and Redeem</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Paste the code into the redemption field exactly as copied. Tap &quot;Confirm&quot;, 
                        &quot;Redeem&quot;, or &quot;Submit&quot; to claim your rewards. If successful, you&apos;ll see a 
                        confirmation message.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Step 5 */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-foreground text-lg">Collect Your Rewards!</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Your rewards will be sent to your in-game mailbox or added directly to your inventory. 
                        Check your mail within the game to claim items that require manual collection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tips Box */}
            <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Important Tips for Redeeming Codes</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Codes are <strong>case-sensitive</strong> - enter them exactly as shown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Each code can only be redeemed <strong>once per account</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Some codes <strong>expire quickly</strong> - redeem as soon as possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Make sure you&apos;re logged into the <strong>correct account</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Some codes are <strong>region-restricted</strong> and may not work in all areas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* All Active Codes */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                All Working {game.name} Codes ({currentMonth} {currentYear})
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeCodes.length} verified codes - click any code to copy
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
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6 text-center">
            <Button asChild size="lg">
              <Link href={`/gaming/${game.slug}`}>
                View Full {game.name} Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>
      
      {/* Rewards You Can Get */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Rewards You Can Get from {game.name} Codes
              </h2>
            </div>
            
            <div className="prose prose-muted max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {game.name} promo codes can give you a variety of valuable in-game rewards. Here&apos;s what you can typically expect:
              </p>
              
              <ul className="grid gap-3 md:grid-cols-2 list-none pl-0">
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <Gift className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-foreground font-medium">Premium Currency (Gems, Coins, etc.)</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                    <Gift className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-foreground font-medium">Exclusive Skins & Cosmetics</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                    <Gift className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-foreground font-medium">Character/Hero Unlocks</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <Gift className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-foreground font-medium">Boosts & Power-ups</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                    <Gift className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="text-foreground font-medium">Loot Boxes & Chests</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
                    <Gift className="h-4 w-4 text-cyan-500" />
                  </div>
                  <span className="text-foreground font-medium">Resources & Materials</span>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section */}
      <FAQSection
        title={`${game.name} Code Redemption FAQ`}
        subtitle="Common questions about redeeming codes"
        faqs={redeemFAQs}
        className="border-t border-border"
      />
      
      {/* Related Links */}
      <section className="py-10 md:py-12 border-t border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Resources
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-emerald-500/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">All Codes & Info</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes-today`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-blue-500/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Tag className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Today&apos;s Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/rewards`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-amber-500/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gift className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Free Rewards</span>
            </Link>
            <Link
              href="/gaming"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-purple-500/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-purple-500" />
              <span className="text-sm font-medium text-foreground">All Games</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">Redeem Guides for Similar Games</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/redeem-codes`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    How to Redeem {relatedGame.shortName || relatedGame.name} Codes
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
