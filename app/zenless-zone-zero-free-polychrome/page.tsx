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
  Gem, 
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
  Star,
  Trophy,
  Swords
} from "lucide-react"
import { 
  getGameBySlug,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getBestPromoCode,
  getGameCtaInfo
} from "@/lib/gaming-data"

export const revalidate = 1800

const today = new Date()
const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export const metadata: Metadata = {
  title: `Zenless Zone Zero Free Polychrome (${monthYear}) – Codes & Rewards`,
  description: `Get FREE Zenless Zone Zero Polychrome! Updated ${dateStr} with working codes, events & daily rewards. Claim 500+ free Polychrome today!`,
  keywords: [
    "zenless zone zero free polychrome",
    "free polychrome zzz",
    "zzz polychrome codes",
    "how to get free polychrome",
    "zenless zone zero codes",
    "zzz free gems",
    `zzz polychrome ${monthYear.toLowerCase()}`,
    "zenless zone zero daily polychrome",
  ],
  openGraph: {
    title: `Zenless Zone Zero Free Polychrome – ${monthYear}`,
    description: `FREE Polychrome updated today! Get 500+ free gems from codes & events.`,
    url: "https://savesmart.bio/zenless-zone-zero-free-polychrome",
    type: "website",
  },
  alternates: {
    canonical: "/zenless-zone-zero-free-polychrome",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ZZZFreePolychromePage() {
  const game = getGameBySlug("zenless-zone-zero")
  
  if (!game) {
    return null
  }
  
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const ctaInfo = getGameCtaInfo(game)
  
  // Calculate total polychrome from codes
  const totalPolychrome = activeCodes.reduce((sum, code) => {
    const match = code.reward.match(/(\d+)\s*Polychrome/i)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  // Ways to get free polychrome
  const freePolychromeSources = [
    { title: "Redeem Codes", description: "Active codes from livestreams and events", value: `${totalPolychrome}+ Polychrome`, icon: Gift, color: "text-cyan-500" },
    { title: "Daily Activities", description: "Complete daily missions in New Eridu", value: "60 Polychrome/day", icon: Calendar, color: "text-blue-500" },
    { title: "Shiyu Defense", description: "Challenge endgame content", value: "600+ Polychrome/reset", icon: Trophy, color: "text-amber-500" },
    { title: "HoYoLAB Check-in", description: "Daily web/app check-in rewards", value: "60 Polychrome/month", icon: CheckCircle2, color: "text-green-500" },
    { title: "Events", description: "Limited-time in-game events", value: "300-800+ Polychrome", icon: Star, color: "text-pink-500" },
    { title: "Story & Exploration", description: "Main story and Hollow exploration", value: "1000+ Polychrome", icon: Swords, color: "text-purple-500" },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get free Polychrome in Zenless Zone Zero?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get free Polychrome through: redeem codes, daily activities (60/day), Shiyu Defense, HoYoLAB check-in, limited events, and story/exploration."
        }
      },
      {
        "@type": "Question", 
        name: "How many Polychrome can I get for free each month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "F2P players can earn approximately 6,000-9,000 Polychrome per month through daily activities, Shiyu Defense, events, codes, and exploration."
        }
      },
      {
        "@type": "Question",
        name: "Where do I redeem Zenless Zone Zero codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Redeem codes at the official ZZZ website (zenless.hoyoverse.com/gift) or in-game via Settings > Account > Redemption Code."
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-cyan-500/10 via-background to-teal-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
          <PageContainer className="relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming/zenless-zone-zero" className="hover:text-foreground transition-colors">Zenless Zone Zero</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Free Polychrome</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg">
                    <Gem className="h-7 w-7" />
                  </div>
                  <div>
                    <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {timeStr}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                      Zenless Zone Zero Free Polychrome
                    </h1>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  Complete guide to getting <strong>FREE Polychrome</strong> in Zenless Zone Zero. 
                  Working codes, daily rewards, events, and tips to maximize your free gems!
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Gift className="h-5 w-5 text-cyan-600" />
                    <span className="font-semibold text-cyan-600">{activeCodes.length} Active Codes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Gem className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">{totalPolychrome}+ Free Polychrome</span>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col gap-3 lg:w-auto">
                <Button 
                  asChild 
                  size="lg"
                  className="h-14 px-8 font-bold text-base bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg"
                >
                  <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Play Zenless Zone Zero
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Free to play on PC, Mobile & PlayStation
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Ways to Get Free Polychrome */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-cyan-500" />
              How to Get Free Polychrome
            </h2>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {freePolychromeSources.map((source, index) => (
                <Card key={index} className="hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${source.color}`}>
                        <source.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{source.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 border-0">
                          {source.value}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* Active Codes Section */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Gift className="h-6 w-6 text-purple-500" />
                Active Polychrome Codes
              </h2>
              <Link 
                href="/gaming/zenless-zone-zero"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All Codes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {activeCodes.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {activeCodes.map((code) => (
                  <PromoCodeCard 
                    key={code.id} 
                    code={code}
                    showAffiliateCTA={true}
                    affiliateUrl={ctaInfo.url}
                    affiliateLabel="Play & Redeem"
                    affiliateRel={ctaInfo.rel}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active codes right now. Check back soon!</p>
              </Card>
            )}
          </PageContainer>
        </section>
        
        {/* How to Redeem */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-500" />
              How to Redeem Polychrome Codes
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">1</span>
                    Website Method
                  </h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Go to <strong>zenless.hoyoverse.com/gift</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Log in with your HoYoverse account
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Select your server and character
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Enter the code and click Redeem
                    </li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-white text-sm font-bold">2</span>
                    In-Game Method
                  </h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Open ZZZ and go to <strong>Settings</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Navigate to <strong>Account</strong> tab
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Click <strong>Redemption Code</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Enter the code and confirm
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">How many Polychrome can I get for free each month?</h3>
                  <p className="text-sm text-muted-foreground">
                    F2P players can earn approximately 6,000-9,000 Polychrome per month through daily activities (1,800), 
                    Shiyu Defense (1,200+), events (1,500-3,000+), codes (100-500), and exploration.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">When do new ZZZ codes release?</h3>
                  <p className="text-sm text-muted-foreground">
                    New codes are typically released during version livestreams (every 6 weeks), special events, 
                    and milestones. Livestream codes usually expire within 12-24 hours!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">How many Polychrome for an S-Rank Agent?</h3>
                  <p className="text-sm text-muted-foreground">
                    With soft pity at 75 pulls and hard pity at 90 pulls, you need approximately 12,800 Polychrome 
                    (80 pulls average) to get an S-Rank. For a specific limited agent (worst case), you need 25,600 Polychrome.
                  </p>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-4">More ZZZ Resources</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/gaming/zenless-zone-zero" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 text-sm font-medium transition-colors">
                All ZZZ Codes
              </Link>
              <Link href="/gaming/zenless-zone-zero/codes-today" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-sm font-medium transition-colors">
                Today&apos;s Codes
              </Link>
              <Link href={`/gaming/zenless-zone-zero/codes-${today.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-sm font-medium transition-colors">
                {monthYear} Codes
              </Link>
              <Link href="/genshin-impact-free-primogems" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-sm font-medium transition-colors">
                Genshin Free Primogems
              </Link>
              <Link href="/honkai-star-rail-free-stellar-jade" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 text-sm font-medium transition-colors">
                HSR Free Stellar Jade
              </Link>
            </div>
          </PageContainer>
        </section>
        
        <SEOInternalLinks showPopularGames={true} showLatestCodes={true} />
        <SEOFooterLinks />
      </main>
      <Footer />
    </div>
  )
}
