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
  Train
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
  title: `Honkai Star Rail Free Stellar Jade (${monthYear}) – Codes & Rewards`,
  description: `Get FREE Honkai Star Rail Stellar Jade! Updated ${dateStr} with working codes, events & daily rewards. Claim 1000+ free Stellar Jade today!`,
  keywords: [
    "honkai star rail free stellar jade",
    "free stellar jade hsr",
    "hsr stellar jade codes",
    "how to get free stellar jade",
    "honkai star rail codes",
    "hsr free gems",
    `hsr stellar jade ${monthYear.toLowerCase()}`,
    "star rail daily jade",
  ],
  openGraph: {
    title: `Honkai Star Rail Free Stellar Jade – ${monthYear}`,
    description: `FREE Stellar Jade updated today! Get 1000+ free jade from codes & events.`,
    url: "https://savesmart.bio/honkai-star-rail-free-stellar-jade",
    type: "website",
  },
  alternates: {
    canonical: "/honkai-star-rail-free-stellar-jade",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HSRFreeStellarJadePage() {
  const game = getGameBySlug("honkai-star-rail")
  
  if (!game) {
    return null
  }
  
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const ctaInfo = getGameCtaInfo(game)
  
  // Calculate total jade from codes
  const totalJade = activeCodes.reduce((sum, code) => {
    const match = code.reward.match(/(\d+)\s*Stellar\s*Jade/i)
    return sum + (match ? parseInt(match[1]) : 0)
  }, 0)
  
  // Ways to get free stellar jade
  const freeJadeSources = [
    { title: "Redeem Codes", description: "Active codes from livestreams and events", value: `${totalJade}+ Stellar Jade`, icon: Gift, color: "text-purple-500" },
    { title: "Daily Training", description: "Complete daily training activities", value: "60 Stellar Jade/day", icon: Calendar, color: "text-blue-500" },
    { title: "Memory of Chaos", description: "Challenge floors twice per month", value: "800 Stellar Jade/reset", icon: Trophy, color: "text-amber-500" },
    { title: "Simulated Universe", description: "Weekly points and challenges", value: "300+ Stellar Jade/week", icon: Star, color: "text-pink-500" },
    { title: "HoYoLAB Check-in", description: "Daily web/app check-in rewards", value: "60 Stellar Jade/month", icon: CheckCircle2, color: "text-green-500" },
    { title: "Trailblaze Missions", description: "Main story and companion quests", value: "1000+ Stellar Jade", icon: Train, color: "text-cyan-500" },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get free Stellar Jade in Honkai Star Rail?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can get free Stellar Jade through: redeem codes, daily training (60/day), Memory of Chaos (800/reset), Simulated Universe, HoYoLAB check-in, and Trailblaze missions."
        }
      },
      {
        "@type": "Question", 
        name: "How many Stellar Jade can I get for free each month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "F2P players can earn approximately 8,000-12,000 Stellar Jade per month through daily training, Memory of Chaos, Simulated Universe, events, codes, and exploration."
        }
      },
      {
        "@type": "Question",
        name: "Where do I redeem Honkai Star Rail codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Redeem codes at the official HSR website or in-game via the phone menu > three horizontal lines > Redemption Code."
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
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
          <PageContainer className="relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/gaming/honkai-star-rail" className="hover:text-foreground transition-colors">Honkai Star Rail</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Free Stellar Jade</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <Gem className="h-7 w-7" />
                  </div>
                  <div>
                    <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {timeStr}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                      Honkai Star Rail Free Stellar Jade
                    </h1>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  Complete guide to getting <strong>FREE Stellar Jade</strong> in Honkai: Star Rail. 
                  Working codes, daily rewards, events, and tips to maximize your free gems!
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Gift className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-600">{activeCodes.length} Active Codes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Gem className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">{totalJade}+ Free Stellar Jade</span>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col gap-3 lg:w-auto">
                <Button 
                  asChild 
                  size="lg"
                  className="h-14 px-8 font-bold text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Play Honkai Star Rail
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
        
        {/* Ways to Get Free Stellar Jade */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              How to Get Free Stellar Jade
            </h2>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {freeJadeSources.map((source, index) => (
                <Card key={index} className="hover:border-indigo-500/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${source.color}`}>
                        <source.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{source.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                        <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-0">
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
                Active Stellar Jade Codes
              </h2>
              <Link 
                href="/gaming/honkai-star-rail"
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
              How to Redeem Stellar Jade Codes
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
                      Go to <strong>hsr.hoyoverse.com/gift</strong>
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
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-bold">2</span>
                    In-Game Method
                  </h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Open HSR and tap the <strong>Phone icon</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Tap the <strong>three horizontal lines</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      Select <strong>Redemption Code</strong>
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
                  <h3 className="font-semibold mb-2">How many Stellar Jade can I get for free each month?</h3>
                  <p className="text-sm text-muted-foreground">
                    F2P players can earn approximately 8,000-12,000 Stellar Jade per month through daily training (1,800), 
                    Memory of Chaos (1,600), Simulated Universe (1,200+), events (2,000-4,000+), and codes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">When do new HSR codes release?</h3>
                  <p className="text-sm text-muted-foreground">
                    New codes are typically released during version livestreams (every 6 weeks), special events, 
                    and milestones. Livestream codes usually expire within 12-24 hours!
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">How many Stellar Jade for a 5-star character?</h3>
                  <p className="text-sm text-muted-foreground">
                    With soft pity at 74 pulls and hard pity at 90 pulls, you need approximately 14,400 Stellar Jade 
                    to guarantee a 5-star. For a specific limited character (worst case 50/50 loss), you need 28,800 Jade.
                  </p>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-4">More Star Rail Resources</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/gaming/honkai-star-rail" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 text-sm font-medium transition-colors">
                All HSR Codes
              </Link>
              <Link href="/gaming/honkai-star-rail/codes-today" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-sm font-medium transition-colors">
                Today&apos;s Codes
              </Link>
              <Link href={`/gaming/honkai-star-rail/codes-${today.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}-${today.getFullYear()}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-sm font-medium transition-colors">
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
