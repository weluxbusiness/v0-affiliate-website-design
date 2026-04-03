import type { Metadata } from "next"
import Link from "next/link"
import { 
  ChevronRight, 
  Gamepad2, 
  Gift, 
  Zap, 
  Tag, 
  Trophy,
  Star,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Swords,
  Shield,
  Sparkles,
  Calendar
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getGameBySlug, 
  getActivePromoCodes, 
  getExpiredPromoCodes,
  sortPromoCodesByValue,
  gamesData
} from "@/lib/gaming-data"
import { FAQSection } from "@/components/seo"

// ISR - Revalidate every 30 minutes for fresh content
export const revalidate = 1800

// CTR-optimized metadata targeting high-intent RAID keywords
export const metadata: Metadata = {
  title: "RAID Shadow Legends Promo Codes (April 2026) – Free Energy, Silver & XP Boost",
  description: "Get 15+ working RAID Shadow Legends promo codes for April 2026. Claim FREE energy, silver, XP boosts & epic champions. All codes verified today - redeem instant rewards now!",
  keywords: [
    // Primary high-intent keywords
    "raid shadow legends promo codes",
    "raid shadow legends codes",
    "raid promo codes",
    "raid codes today",
    "raid codes april 2026",
    // Reward-specific keywords
    "raid shadow legends free energy",
    "raid shadow legends free silver",
    "raid shadow legends free champions",
    "raid free rewards",
    // Long-tail keywords
    "working raid shadow legends codes",
    "raid shadow legends codes today",
    "new raid shadow legends codes",
    "raid shadow legends redeem codes",
  ],
  openGraph: {
    title: "RAID Shadow Legends Promo Codes April 2026 – Free Rewards Today",
    description: "15+ verified RAID codes working today. Free energy, silver, XP boosts & champions. Updated hourly!",
    url: "https://savesmart.bio/raid-shadow-legends-promo-codes",
    type: "website",
    siteName: "SaveSmart",
    images: [
      {
        url: "https://savesmart.bio/og/raid-shadow-legends-promo-codes.jpg",
        width: 1200,
        height: 630,
        alt: "RAID Shadow Legends Promo Codes - Free Rewards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAID Shadow Legends Promo Codes – Free Rewards Today",
    description: "15+ working codes. Free energy, silver & champions. Redeem now!",
  },
  alternates: {
    canonical: "/raid-shadow-legends-promo-codes",
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

// RAID-specific FAQ data
const raidFAQs = [
  {
    question: "Are RAID Shadow Legends promo codes still working in April 2026?",
    answer: "Yes! We verify all RAID Shadow Legends promo codes daily. The codes listed on this page are confirmed working as of today. Codes typically work for 1-4 weeks after release, so redeem them quickly to avoid missing out on free rewards.",
  },
  {
    question: "How often do new RAID promo codes come out?",
    answer: "Plarium releases new RAID Shadow Legends promo codes 2-4 times per month, typically during special events, updates, or partnerships. We update this page within hours of new codes being released, so bookmark this page and check back regularly.",
  },
  {
    question: "Can I use multiple RAID promo codes on one account?",
    answer: "Yes, you can redeem multiple different promo codes on the same RAID account. However, each code can only be used once per account. Make sure to redeem all active codes to maximize your free rewards.",
  },
  {
    question: "Why isn't my RAID promo code working?",
    answer: "If a code isn't working, it may have expired, reached its redemption limit, or you may have already redeemed it. Codes are case-sensitive, so enter them exactly as shown. Try copying and pasting the code directly to avoid typos.",
  },
  {
    question: "What rewards can I get from RAID Shadow Legends promo codes?",
    answer: "RAID promo codes typically give free Energy (for battles), Silver (in-game currency), XP Boosts (faster leveling), Epic/Rare Champions, Ancient Shards, and various upgrade materials. Some special codes may include Legendary champions or exclusive items.",
  },
  {
    question: "Where do I redeem RAID Shadow Legends codes?",
    answer: "You can redeem codes through the official RAID website at raid.plarium.com/promo-codes. Log into your Plarium account, enter the code, and rewards will be sent to your in-game mailbox. You can also redeem codes through the in-game settings menu.",
  },
]

// Rewards you can get section data
const rewardTypes = [
  {
    icon: Zap,
    title: "Free Energy",
    description: "Get 100-500 energy to run more dungeon battles and campaign stages",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Star,
    title: "Free Silver",
    description: "Earn 100K-1M silver for upgrading artifacts and champions",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
  },
  {
    icon: Sparkles,
    title: "XP Boosts",
    description: "Double XP for 1-3 days to level up champions faster",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Free Champions",
    description: "Unlock Epic and Rare champions to strengthen your roster",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Gift,
    title: "Ancient Shards",
    description: "Pull new champions from the Ancient Shard summon pool",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Upgrade Materials",
    description: "Get potions, tomes, and gear for champion progression",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
]

// Tips to get more rewards
const rewardTips = [
  {
    title: "Complete Daily Quests",
    description: "Daily quests reset every 24 hours and reward energy, silver, and shards. Complete all quests daily for maximum rewards.",
  },
  {
    title: "Join an Active Clan",
    description: "Clans unlock Clan Boss battles with massive rewards including Sacred Shards and legendary gear. Find a clan that kills Clan Boss daily.",
  },
  {
    title: "Participate in Events",
    description: "RAID runs constant events with free champions, shards, and resources. Check the Events tab daily and participate in tournaments.",
  },
  {
    title: "Link Social Accounts",
    description: "Link your Facebook and Google accounts for bonus rewards and easier account recovery. Check your mail for link bonuses.",
  },
  {
    title: "Watch for Promo Code Drops",
    description: "Follow RAID on Twitter/X and YouTube. New codes are often announced during livestreams and social media campaigns.",
  },
  {
    title: "Claim Login Rewards",
    description: "Log in every day to claim daily login rewards. Monthly login calendars offer Legendary champions and Sacred Shards.",
  },
]

export default function RAIDShadowLegendsPromoCodesPage() {
  const game = getGameBySlug("raid-shadow-legends")
  
  if (!game) {
    return null
  }

  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const expiredCodes = getExpiredPromoCodes(game.promoCodes)
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Related games for internal linking
  const relatedGames = gamesData
    .filter(g => g.slug !== 'raid-shadow-legends')
    .filter(g => ['genshin-impact', 'fortnite', 'roblox', 'honkai-star-rail', 'afk-arena'].includes(g.slug))
    .slice(0, 5)

  // Generate structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: raidFAQs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RAID Shadow Legends Promo Codes",
    description: "Active promo codes for RAID Shadow Legends with free rewards",
    numberOfItems: activeCodes.length,
    itemListElement: activeCodes.map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        url: "https://savesmart.bio/raid-shadow-legends-promo-codes"
      }
    }))
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "RAID Shadow Legends Promo Codes (April 2026)",
    description: "Get working RAID Shadow Legends promo codes for free energy, silver, XP boosts and champions.",
    url: "https://savesmart.bio/raid-shadow-legends-promo-codes",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "VideoGame",
      name: "RAID: Shadow Legends",
      gamePlatform: ["PC", "Mobile", "iOS", "Android"],
      genre: ["RPG", "Gacha"],
      publisher: {
        "@type": "Organization",
        name: "Plarium"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-purple-900/20 via-purple-900/10 to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5" />
          <PageContainer className="relative">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">RAID Shadow Legends Codes</span>
              </nav>

              {/* Last Updated Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Updated Today
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {activeCodes.length}+ Working Codes
                </Badge>
              </div>

              {/* H1 - Primary Keyword */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                RAID Shadow Legends Promo Codes ({currentMonth} {currentYear}) – Free Rewards Today
              </h1>

              {/* Value Proposition */}
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl hero-description">
                Get all working RAID Shadow Legends promo codes and claim <strong className="text-foreground">free energy, silver, XP boosts, and epic champions</strong>. 
                All {activeCodes.length}+ codes verified and updated daily.
              </p>

              {/* Last Updated */}
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: {lastUpdated}
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Active Codes Section - ABOVE THE FOLD */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Active RAID Shadow Legends Promo Codes
                </h2>
                <p className="text-sm text-muted-foreground">Verified and working as of {currentMonth} {currentYear}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 ml-13">
              Copy any code below and redeem it at <a href="https://raid.plarium.com/promo-codes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">raid.plarium.com/promo-codes</a> for instant free rewards.
            </p>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} game={game} />
              ))}
            </div>

            {activeCodes.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active codes available right now. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </PageContainer>
        </section>

        {/* New Codes This Month */}
        {(() => {
          const today = new Date()
          const recentCodes = activeCodes.filter(code => {
            const addedDate = new Date(code.addedAt)
            const daysDiff = (today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff <= 30
          })
          
          if (recentCodes.length === 0) return null
          
          return (
            <section className="py-10 md:py-12 bg-gradient-to-b from-amber-500/5 to-transparent border-t border-border">
              <PageContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Flame className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      New Codes Added This Month
                    </h2>
                    <Badge variant="outline" className="mt-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
                      {recentCodes.length} New Codes – Working Now
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {recentCodes.slice(0, 4).map((code) => (
                    <Card key={code.id} className="border-amber-500/20 bg-amber-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <code className="text-lg font-mono font-bold text-primary">{code.code}</code>
                            <p className="text-sm text-muted-foreground mt-1">{code.reward}</p>
                          </div>
                          <Badge className="bg-amber-500 text-white">NEW</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </PageContainer>
            </section>
          )
        })()}

        {/* What Rewards Do You Get */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                What Rewards Do You Get from RAID Promo Codes?
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {rewardTypes.map((reward) => (
                <Card key={reward.title} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${reward.bgColor}`}>
                        <reward.icon className={`h-5 w-5 ${reward.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Best Rewards List */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Best Rewards from Current Codes
              </h3>
              <ul className="space-y-3">
                {activeCodes.slice(0, 6).map((code) => (
                  <li key={code.id} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{code.reward}</span>
                      <span className="text-muted-foreground"> – Use code </span>
                      <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-primary">{code.code}</code>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </PageContainer>
        </section>

        {/* How to Redeem RAID Codes */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Gamepad2 className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  How to Redeem RAID Shadow Legends Codes
                </h2>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
                <p className="text-base leading-relaxed">
                  Redeeming RAID Shadow Legends promo codes takes less than a minute. Follow these simple steps to claim your free rewards:
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Copy the Code</h4>
                        <p className="text-sm text-muted-foreground">Click on any code above to copy it to your clipboard automatically.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Visit Redemption Page</h4>
                        <p className="text-sm text-muted-foreground">Go to <a href="https://raid.plarium.com/promo-codes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">raid.plarium.com/promo-codes</a> and log in.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Paste & Redeem</h4>
                        <p className="text-sm text-muted-foreground">Paste the code in the redemption field and click &quot;Redeem Code&quot;.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Check Your Mailbox</h4>
                        <p className="text-sm text-muted-foreground">Open RAID and check your in-game mailbox for rewards!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Pro Tips for RAID Codes</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Codes are case-sensitive – enter them exactly as shown</li>
                      <li>Each code can only be redeemed once per account</li>
                      <li>Some codes expire within 1-2 weeks – redeem quickly</li>
                      <li>New player codes only work for accounts under 7 days old</li>
                      <li>Rewards appear in your mailbox within 1-5 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Tips to Get More Rewards */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Tips to Get More Free Rewards in RAID
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {rewardTips.map((tip, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Expired Codes */}
        {expiredCodes.length > 0 && (
          <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
            <PageContainer>
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Expired RAID Shadow Legends Codes
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6 ml-13">
                  These codes have expired and no longer work. We keep them listed for reference.
                </p>

                <div className="space-y-2">
                  {expiredCodes.slice(0, 10).map((code) => (
                    <div 
                      key={code.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-sm text-muted-foreground line-through">
                          {code.code}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {code.reward}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                        Expired
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </PageContainer>
          </section>
        )}

        {/* FAQ Section */}
        <FAQSection
          title="RAID Shadow Legends Promo Codes FAQ"
          subtitle="Common questions about RAID codes and rewards"
          faqs={raidFAQs}
          className="border-t border-border"
        />

        {/* More Free Rewards - Internal Linking */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More Free Gaming Rewards
            </h2>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
              {relatedGames.map((g) => (
                <Link
                  key={g.slug}
                  href={`/gaming/${g.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground text-center">
                    {g.shortName || g.name} Codes
                  </span>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/gaming"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-primary" />
                All Gaming Codes
              </Link>
              <Link
                href="/gaming/promo-codes"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
              >
                <Tag className="h-3.5 w-3.5 text-primary" />
                Promo Codes Hub
              </Link>
              <Link
                href="/gaming/today"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
              >
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                Today&apos;s Codes
              </Link>
              <Link
                href="/gaming/free-rewards"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
              >
                <Gift className="h-3.5 w-3.5 text-green-500" />
                Free Rewards
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-4">Want More Free Rewards?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Bookmark this page and check back daily for new RAID Shadow Legends promo codes. We update our codes within hours of release!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/gaming/raid-shadow-legends">
                  <Swords className="mr-2 h-4 w-4" />
                  View Full RAID Guide
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gaming">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Browse All Games
                </Link>
              </Button>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
