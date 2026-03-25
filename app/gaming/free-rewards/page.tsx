import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Gift, 
  ChevronRight,
  Gamepad2,
  Tag,
  Zap,
  Calendar,
  ArrowRight,
  Star
} from "lucide-react"
import { 
  gamesData,
  getGamesWithFreeRewards,
  getActivePromoCodes
} from "@/lib/gaming-data"
import type { GameReward } from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Free Gaming Rewards - Daily Bonuses & In-Game Freebies | SaveSmart",
  description: "Discover free rewards, daily bonuses, and in-game freebies for popular games. Get free currency, items, and characters without spending money.",
  keywords: [
    "free gaming rewards",
    "daily game bonuses",
    "free in-game items",
    "free game currency",
    "free primogems",
    "free v-bucks",
    "daily login rewards"
  ],
  openGraph: {
    title: "Free Gaming Rewards | SaveSmart",
    description: "Discover free rewards and daily bonuses for popular games.",
    url: "https://savesmart.bio/gaming/free-rewards",
  },
  alternates: {
    canonical: "/gaming/free-rewards",
  },
}

function RewardTypeCard({ reward, gameName, gameSlug }: { 
  reward: GameReward
  gameName: string
  gameSlug: string 
}) {
  const typeColors: Record<GameReward['type'], string> = {
    'Free': 'bg-secondary/10 text-secondary border-secondary/30',
    'Daily': 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    'New Player': 'bg-primary/10 text-primary border-primary/30',
    'Event': 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    'Referral': 'bg-pink-500/10 text-pink-600 border-pink-500/30',
    'Achievement': 'bg-green-500/10 text-green-600 border-green-500/30',
  }

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="outline" className={typeColors[reward.type]}>
            {reward.type}
          </Badge>
          <Link 
            href={`/gaming/${gameSlug}`}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {gameName}
          </Link>
        </div>

        <h3 className="font-semibold text-foreground mb-2">
          {reward.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {reward.description}
        </p>

        {reward.value && (
          <div className="flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-secondary" />
            <span className="font-medium text-secondary">{reward.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function GamingFreeRewardsPage() {
  const gamesWithRewards = getGamesWithFreeRewards()

  // Collect all free and daily rewards
  const allRewards: { reward: GameReward; gameName: string; gameSlug: string }[] = []
  
  gamesWithRewards.forEach(game => {
    game.rewards
      .filter(r => r.type === 'Free' || r.type === 'Daily')
      .forEach(reward => {
        allRewards.push({
          reward,
          gameName: game.shortName || game.name,
          gameSlug: game.slug
        })
      })
  })

  // Separate by type
  const dailyRewards = allRewards.filter(r => r.reward.type === 'Daily')
  const freeRewards = allRewards.filter(r => r.reward.type === 'Free')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/90 to-secondary text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link 
              href="/gaming" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Gaming
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Free Rewards
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/10 text-white border-0">
              <Gift className="h-3 w-3 mr-1" />
              Free Rewards
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              {allRewards.length}+ Rewards
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Free Gaming Rewards & Daily Bonuses
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            Claim free in-game currency, items, and rewards without spending a dime. 
            Daily login bonuses, free passes, and more.
          </p>
        </PageContainer>
      </section>

      {/* Quick Navigation */}
      <section className="py-6 border-b border-border bg-muted/30">
        <PageContainer>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              All Games
            </Link>
            <Link
              href="/gaming/promo-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              Promo Codes
            </Link>
            <Link
              href="/gaming/new-player-deals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Zap className="h-4 w-4" />
              New Player Deals
            </Link>
            <Link
              href="/gaming/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Today&apos;s Codes
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Daily Rewards Section */}
      {dailyRewards.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Daily Login Rewards
                </h2>
                <p className="text-sm text-muted-foreground">
                  Log in daily to claim these bonuses
                </p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {dailyRewards.map((item, index) => (
                <RewardTypeCard
                  key={`daily-${index}`}
                  reward={item.reward}
                  gameName={item.gameName}
                  gameSlug={item.gameSlug}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Free Rewards Section */}
      {freeRewards.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Gift className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Free Rewards & Items
                </h2>
                <p className="text-sm text-muted-foreground">
                  No purchase required - claim these anytime
                </p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {freeRewards.map((item, index) => (
                <RewardTypeCard
                  key={`free-${index}`}
                  reward={item.reward}
                  gameName={item.gameName}
                  gameSlug={item.gameSlug}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Games with Free Rewards */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Games with Free Rewards
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gamesWithRewards.slice(0, 8).map((game) => (
              <Link
                key={game.id}
                href={`/gaming/${game.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center group"
              >
                <Gamepad2 className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {game.shortName || game.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {game.rewards.filter(r => r.type === 'Free' || r.type === 'Daily').length} free rewards
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/gaming">
                View All Games
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
