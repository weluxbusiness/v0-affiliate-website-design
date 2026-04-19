import type { Metadata } from "next"
import Link from "next/link"
import { 
  ChevronRight, 
  Gamepad2, 
  Gift,
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  Tag,
  Sparkles,
  Zap,
  Star,
  Users,
  Shield,
  Swords,
  BookOpen,
  Target
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FAQSection } from "@/components/seo"

export const revalidate = 86400 // Daily

const currentMonth = new Date().toLocaleString('default', { month: 'long' })
const currentYear = new Date().getFullYear()

export const metadata: Metadata = {
  title: `RAID Shadow Legends Beginner Guide (${currentYear}) – Tips for New Players`,
  description: `Complete beginner guide for RAID Shadow Legends. Learn how to get started, best champions to focus on, promo codes, and tips to progress fast in ${currentYear}.`,
  alternates: {
    canonical: "/gaming/raid-shadow-legends/beginner-guide",
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Beginner tips
const beginnerTips = [
  {
    step: 1,
    title: "Redeem All Promo Codes First",
    description: "Before anything else, redeem all available promo codes for free energy, champions, and resources. New player codes give the best rewards!",
    icon: Tag,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    link: "/raid-shadow-legends-promo-codes",
    linkText: "Get All Promo Codes",
  },
  {
    step: 2,
    title: "Complete the Tutorial & Campaign",
    description: "Focus on completing the campaign first. It teaches game mechanics and rewards you with essential champions and resources.",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    step: 3,
    title: "Join an Active Clan Immediately",
    description: "Clans unlock Clan Boss, the best source of Shards and Legendary gear. Join any active clan ASAP – you can upgrade later.",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    step: 4,
    title: "Focus on One Champion at a Time",
    description: "Don't spread resources thin. Level your starter champion to 60 first, then build a dungeon team around them.",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    step: 5,
    title: "Complete Daily Quests Every Day",
    description: "Daily quests give energy, silver, and shards. Completing all daily quests also contributes to weekly rewards.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    step: 6,
    title: "Participate in Every Event",
    description: "Even if you can't complete events, partial rewards are valuable. Focus on events that align with your current goals.",
    icon: Trophy,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
]

// Best starter champions
const starterChampions = [
  { name: "Kael", role: "Damage (Poison)", rating: "S-Tier", tip: "Best starter for most content. Focus on him first." },
  { name: "Athel", role: "Damage (Speed)", rating: "A-Tier", tip: "Great for arena and speed teams." },
  { name: "Elhain", role: "Damage (AoE)", rating: "A-Tier", tip: "Best for farming campaign stages." },
  { name: "Galek", role: "Damage (ATK-based)", rating: "B-Tier", tip: "Decent but outclassed by others." },
]

// FAQs for beginners
const beginnerFAQs = [
  {
    question: "Which starter champion should I pick in RAID?",
    answer: "Kael is generally considered the best starter champion for new players. His poison abilities make him excellent for Clan Boss and dungeons, and he remains useful into the late game. However, any starter can work – the important thing is to focus on one.",
  },
  {
    question: "How do I get free champions as a new player?",
    answer: "New players can get free champions from: Promo codes (especially new player codes), the 7-day login reward, completing campaign chapters, and the Arbiter missions. Also check for events that reward champions.",
  },
  {
    question: "Should I spend gems as a new player?",
    answer: "The best use of gems early on is: 1) Buy the Gem Mine (500 gems), 2) Expand your Champion vault if needed, 3) Buy Masteries for your first level 60 champion (800 gems). Avoid spending gems on shards or energy refills until late game.",
  },
  {
    question: "How important is joining a clan in RAID?",
    answer: "Extremely important! Clan Boss is the best source of Shards and Legendary gear in the game. Join any active clan immediately – even dealing minimal damage earns rewards. You can find a better clan later.",
  },
  {
    question: "What should I focus on first in RAID?",
    answer: "Priority order for new players: 1) Redeem all promo codes, 2) Complete campaign to unlock all content, 3) Get your starter to level 60, 4) Join a clan for Clan Boss, 5) Build a dungeon farming team. Don't try to do everything at once.",
  },
]

export default function RAIDBeginnerGuidePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-blue-900/20 via-blue-900/10 to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5" />
          <PageContainer className="relative">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/raid-shadow-legends-promo-codes" className="hover:text-foreground transition-colors">RAID Codes</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Beginner Guide</span>
              </nav>

              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500 text-white">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Complete Beginner Guide
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated {lastUpdated}
                </Badge>
              </div>

              {/* H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                RAID Shadow Legends Beginner Guide ({currentYear})
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
                New to RAID Shadow Legends? This complete beginner guide covers everything you need to know to 
                <strong className="text-foreground"> start strong and progress fast</strong>. From promo codes to champion builds.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/raid-shadow-legends-promo-codes">
                    <Tag className="mr-2 h-4 w-4" />
                    Get Free Promo Codes
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/gaming/raid-shadow-legends/free-rewards">
                    <Gift className="mr-2 h-4 w-4" />
                    Free Rewards Guide
                  </Link>
                </Button>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Step-by-Step Guide */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Getting Started: Step-by-Step
              </h2>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {beginnerTips.map((tip) => (
                <Card key={tip.step} className="border-border/50 hover:border-primary/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">
                    {tip.step}
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${tip.bgColor}`}>
                        <tip.icon className={`h-6 w-6 ${tip.color}`} />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">Step {tip.step}</Badge>
                        <h3 className="font-bold text-lg text-foreground">{tip.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                    {tip.link && (
                      <Link 
                        href={tip.link}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {tip.linkText}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Starter Champions */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Swords className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Starter Champion Tier List
                </h2>
              </div>

              <div className="space-y-3">
                {starterChampions.map((champion, index) => (
                  <div 
                    key={champion.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <span className="text-lg font-bold text-purple-500">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{champion.name}</span>
                          <Badge 
                            className={
                              champion.rating === "S-Tier" ? "bg-green-500 text-white" :
                              champion.rating === "A-Tier" ? "bg-blue-500 text-white" :
                              "bg-amber-500 text-white"
                            }
                          >
                            {champion.rating}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{champion.role}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs text-right hidden md:block">{champion.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Important Tips Box */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-3">Pro Tips for New Players</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Never use Epic/Legendary champions as food – they might be buffed later</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Save your Ancient/Sacred Shards for 2x events to double your chances</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Speed is the most important stat in RAID – fast teams win</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Farm campaign 12-3 Brutal for silver and XP once you can clear it</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>Check <Link href="/raid-shadow-legends-promo-codes" className="text-primary hover:underline">promo codes</Link> weekly for free rewards</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Beginner FAQ"
          subtitle="Common questions from new RAID Shadow Legends players"
          faqs={beginnerFAQs}
          className="border-t border-border"
        />

        {/* Internal Links */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">More RAID Shadow Legends Resources</h2>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
              <Link
                href="/raid-shadow-legends-promo-codes"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">All RAID Promo Codes</span>
              </Link>
              <Link
                href="/gaming/raid-shadow-legends/new-codes"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-foreground">New Codes This Month</span>
              </Link>
              <Link
                href="/gaming/raid-shadow-legends/free-rewards"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Gift className="h-5 w-5 text-green-500" />
                <span className="font-medium text-foreground">Free Rewards Guide</span>
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
