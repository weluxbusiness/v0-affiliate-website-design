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
  Calendar,
  Shield
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
  title: `Free RAID Shadow Legends Rewards (${currentMonth} ${currentYear}) – Get Free Champions, Energy & More`,
  description: `Complete guide to getting free rewards in RAID Shadow Legends. Daily login rewards, promo codes, events, and more ways to get free champions, energy, and silver.`,
  alternates: {
    canonical: "/gaming/raid-shadow-legends/free-rewards",
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Free reward methods
const rewardMethods = [
  {
    icon: Tag,
    title: "Promo Codes",
    description: "Redeem working promo codes for instant free rewards including energy, silver, and champions.",
    rewards: "Energy, Silver, Champions, Shards",
    frequency: "2-4 times per month",
    link: "/raid-shadow-legends-promo-codes",
    linkText: "View All Codes",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Calendar,
    title: "Daily Login Rewards",
    description: "Log in every day to claim escalating rewards. 30-day calendars offer the best rewards on days 28-30.",
    rewards: "Energy, Silver, Shards, Legendary Champions",
    frequency: "Daily",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Trophy,
    title: "Events & Tournaments",
    description: "Participate in limited-time events and tournaments for exclusive rewards and champions.",
    rewards: "Epic/Legendary Champions, Sacred Shards, Gear",
    frequency: "Weekly",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Clan Boss",
    description: "Join an active clan and defeat the Clan Boss daily for massive rewards based on damage dealt.",
    rewards: "Shards, Legendary Gear, Silver",
    frequency: "Daily",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Gift,
    title: "Referral Program",
    description: "Invite friends to play RAID and earn rewards when they reach account milestones.",
    rewards: "Energy, Champions, Sacred Shards",
    frequency: "Per referral",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Sparkles,
    title: "Achievements",
    description: "Complete in-game achievements to earn one-time rewards for reaching milestones.",
    rewards: "Silver, Gems, Energy, Shards",
    frequency: "One-time per achievement",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
]

// Best daily free rewards
const dailyRewards = [
  { reward: "Free Energy Refill", source: "Daily Quests", time: "Resets at midnight UTC" },
  { reward: "Free Ancient Shard", source: "Daily Login (Day 7)", time: "Weekly cycle" },
  { reward: "Free Energy (50)", source: "Free Gift Shop", time: "Every 6 hours" },
  { reward: "Clan Boss Rewards", source: "Clan Activity", time: "After boss kill" },
  { reward: "Arena Tokens", source: "Free Arena Refill", time: "Every 15 minutes" },
]

// FAQs
const freeRewardsFAQs = [
  {
    question: "What are the best ways to get free champions in RAID?",
    answer: "The best ways to get free champions are: Daily Login Rewards (Legendary champions on Day 30), Events and Tournaments, Sacred/Void Shards from Clan Boss, and special Promo Codes. New player codes often include Epic champions as well.",
  },
  {
    question: "How do I get free energy in RAID Shadow Legends?",
    answer: "You can get free energy from: Promo Codes, Daily Quests (50-100 energy), Free Shop Gift (every 6 hours), Weekly Challenges, and Arena/Campaign missions. Energy also regenerates 1 point every 3 minutes.",
  },
  {
    question: "Are there any monthly free rewards in RAID?",
    answer: "Yes! The monthly login calendar offers escalating rewards ending with valuable items on days 28-30, including Legendary champions. Monthly events also provide free rewards for participation.",
  },
  {
    question: "How do I maximize free-to-play rewards in RAID?",
    answer: "Focus on: logging in daily, completing all daily quests, joining an active clan for Clan Boss rewards, participating in all events, checking for promo codes regularly, and claiming free shop gifts every 6 hours.",
  },
]

export default function RAIDFreeRewardsPage() {
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
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-green-900/20 via-green-900/10 to-background border-b border-border overflow-hidden">
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
                <span className="text-foreground">Free Rewards</span>
              </nav>

              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-500 text-white">
                  <Gift className="h-3 w-3 mr-1" />
                  Complete Free Rewards Guide
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated {lastUpdated}
                </Badge>
              </div>

              {/* H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                Free RAID Shadow Legends Rewards ({currentMonth} {currentYear})
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
                Complete guide to getting <strong className="text-foreground">free rewards in RAID Shadow Legends</strong>. 
                Learn how to maximize your free champions, energy, silver, and shards without spending money.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/raid-shadow-legends-promo-codes">
                    <Tag className="mr-2 h-4 w-4" />
                    Get Promo Codes
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/gaming/raid-shadow-legends/beginner-guide">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Beginner Guide
                  </Link>
                </Button>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* All Free Reward Methods */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                All Ways to Get Free Rewards in RAID
              </h2>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {rewardMethods.map((method) => (
                <Card key={method.title} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${method.bgColor}`}>
                        <method.icon className={`h-6 w-6 ${method.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{method.title}</h3>
                        <Badge variant="outline" className="text-xs">{method.frequency}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Rewards: </span>
                      <span className="text-foreground font-medium">{method.rewards}</span>
                    </div>
                    {method.link && (
                      <Link 
                        href={method.link}
                        className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
                      >
                        {method.linkText}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Daily Free Rewards Checklist */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Daily Free Rewards Checklist
                </h2>
              </div>

              <div className="space-y-3">
                {dailyRewards.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{item.reward}</span>
                        <span className="text-muted-foreground"> – {item.source}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Free Rewards FAQ"
          subtitle="Common questions about free rewards in RAID Shadow Legends"
          faqs={freeRewardsFAQs}
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
                href="/gaming/raid-shadow-legends/beginner-guide"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Gamepad2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-foreground">Beginner Guide</span>
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
