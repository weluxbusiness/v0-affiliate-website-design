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
  Waves
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
  title: `Wuthering Waves Free Astrite (${monthYear}) – Codes & Rewards`,
  description: `Get FREE Wuthering Waves Astrite! Updated ${dateStr} with working codes, events & daily rewards. Claim 1000+ free Astrite today!`,
  keywords: [
    "wuthering waves free astrite",
    "free astrite wuthering waves",
    "wuwa astrite codes",
    "how to get free astrite",
    "wuthering waves codes",
    "wuwa free gems",
    `wuthering waves astrite ${monthYear.toLowerCase()}`,
    "wuwa daily astrite",
  ],
  openGraph: {
    title: `Wuthering Waves Free Astrite – ${monthYear}`,
    description: `FREE Astrite updated today! Get 1000+ free gems from codes & events.`,
    url: "https://savesmart.bio/wuthering-waves-free-astrite",
    type: "website",
  },
  alternates: {
    canonical: "/wuthering-waves-free-astrite",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function WuWaFreeAstritePage() {
  const game = getGameBySlug("wuthering-waves")
  
  if (!game) {
    return null
  }
  
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const ctaInfo = getGameCtaInfo(game)
  
  // Calculate total astrite from codes
  const totalAstrite = activeCodes.reduce((sum, code) => {
    const match = code.reward.match(/(\d+)\s*Astrite/i)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  // Ways to get free astrite
  const freeAstriteSources = [
    { title: "Redeem Codes", description: "Active codes from livestreams and events", value: `${totalAstrite}+ Astrite`, icon: Gift, color: "text-purple-500" },
    { title: "Daily Activities", description: "Complete Guidebook missions daily", value: "60 Astrite/day", icon: Calendar, color: "text-blue-500" },
    { title: "Tower of Adversity", description: "Challenge endgame content", value: "600+ Astrite/reset", icon: Trophy, color: "text-amber-500" },
    { title: "Pioneer Podcast", description: "Weekly battle pass rewards", value: "200+ Astrite/week", icon: Star, color: "text-pink-500" },
    { title: "Events", description: "Limited-time in-game events", value: "300-1000+ Astrite", icon: Sparkles, color: "text-cyan-500" },
    { title: "Exploration", description: "Supply Pods, chests, achievements", value: "Unlimited", icon: Waves, color: "text-green-500" },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get free Astrite in Wuthering Waves?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get free Astrite through: redeem codes, daily activities (60/day), Tower of Adversity, Pioneer Podcast, limited events, and exploration."
        }
      },
      {
        "@type": "Question", 
        name: "How many Astrite can I get for free each month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "F2P players can earn approximately 8,000-12,000 Astrite per month through daily activities, Tower of Adversity, Pioneer Podcast, events, codes, and exploration."
        }
      },
      {
        "@type": "Question",
        name: "Where do I redeem Wuthering Waves codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Redeem codes in-game: Go to Terminal (Esc) > Convene > Redemption Code, or visit the official Kuro Games redemption page."
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
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-violet-500/10 via-background to-fuchsia-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent" />
          <PageContainer className="relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming/wuthering-waves" className="hover:text-foreground transition-colors">Wuthering Waves</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Free Astrite</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
                    <Gem className="h-7 w-7" />
                  </div>
                  <div>
                    <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {timeStr}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                      Wuthering Waves Free Astrite
                    </h1>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  Complete guide to getting <strong>FREE Astrite</strong> in Wuthering Waves. 
                  Working codes, daily rewards, events, and tips to maximize your free gems!
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <Gift className="h-5 w-5 text-violet-600" />
                    <span className="font-semibold text-violet-600">{activeCodes.length} Active Codes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Gem className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">{totalAstrite}+ Free Astrite</span>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col gap-3 lg:w-auto">
                <Button 
                  asChild 
                  size="lg"
                  className="h-14 px-8 font-bold text-base bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white shadow-lg"
                >
                  <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Play Wuthering Waves
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
        
        {/* Ways to Get Free Astrite */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-violet-500" />
              How to Get Free Astrite
            </h2>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {freeAstriteSources.map((source, index) => (
                <Card key={index} className="hover:border-violet-500/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${source.color}`}>
                        <source.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{source.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                        <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 border-0">
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
                Active Astrite Codes
              </h2>
              <Link 
                href="/gaming/wuthering-waves"
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
              How to Redeem Astrite Codes
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white text-sm font-bold">In-Game</span>
                  Redemption Steps
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Open Wuthering Waves and press <strong>Esc</strong> to open Terminal
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Navigate to <strong>Convene</strong> tab
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Click <strong>Redemption Code</strong> button
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Enter the code and click <strong>Confirm</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Check your in-game mail for rewards
                  </li>
                </ol>
              </CardContent>
            </Card>
          </PageContainer>
        </section>
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">How many Astrite can I get for free each month?</h3>
                  <p className="text-sm text-muted-foreground">
                    F2P players can earn approximately 8,000-12,000 Astrite per month through daily activities (1,800), 
                    Tower of Adversity (1,200+), Pioneer Podcast (800+), events (2,000-4,000+), and codes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">When do new Wuthering Waves codes release?</h3>
                  <p className="text-sm text-muted-foreground">
                    New codes are typically released during version livestreams, special events, and milestones. 
                    Follow official Wuthering Waves social media for the latest codes!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">How many Astrite for a 5-star Resonator?</h3>
                  <p className="text-sm text-muted-foreground">
                    With soft pity at 66 pulls and hard pity at 80 pulls, you need approximately 12,800 Astrite 
                    (80 pulls) to guarantee a 5-star. WuWa has a generous 50/50 system with guaranteed featured character.
                  </p>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-4">More Wuthering Waves Resources</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/gaming/wuthering-waves" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 text-sm font-medium transition-colors">
                All WuWa Codes
              </Link>
              <Link href="/gaming/wuthering-waves/codes-today" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-sm font-medium transition-colors">
                Today&apos;s Codes
              </Link>
              <Link href={`/gaming/wuthering-waves/codes-${today.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-sm font-medium transition-colors">
                {monthYear} Codes
              </Link>
              <Link href="/genshin-impact-free-primogems" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-sm font-medium transition-colors">
                Genshin Free Primogems
              </Link>
              <Link href="/zenless-zone-zero-free-polychrome" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 text-sm font-medium transition-colors">
                ZZZ Free Polychrome
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
