import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  ExternalLink,
  Calendar,
  Star,
  Trophy,
  Users,
  Zap,
  ArrowRight
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  getRelatedGames
} from "@/lib/gaming-data"
import type { GameReward } from "@/lib/gaming-data"

export const revalidate = 3600

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
    return {
      title: "Game Not Found | SaveSmart Gaming",
    }
  }
  
  const year = new Date().getFullYear()
  
  return {
    title: `${game.name} Free Rewards & Bonuses ${year} | SaveSmart`,
    description: `Get free ${game.name} rewards including daily bonuses, new player perks, event rewards, and more. ${game.rewards.length} ways to earn free in-game items.`,
    keywords: [
      `${game.name} free rewards`,
      `${game.name} daily rewards`,
      `${game.name} bonuses`,
      `${game.name} free items`,
      `${game.name} daily login`,
      `free ${game.name} currency`,
    ],
    openGraph: {
      title: `${game.name} Free Rewards ${year}`,
      description: `Get free ${game.name} rewards and bonuses.`,
      url: `https://savesmart.bio/gaming/${game.slug}/rewards`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/rewards`,
    },
  }
}

function getRewardIcon(type: GameReward['type']) {
  switch (type) {
    case 'Daily':
      return Calendar
    case 'New Player':
      return Zap
    case 'Event':
      return Star
    case 'Achievement':
      return Trophy
    case 'Referral':
      return Users
    case 'Free':
    default:
      return Gift
  }
}

function getRewardColor(type: GameReward['type']): string {
  switch (type) {
    case 'Daily':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/30'
    case 'New Player':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    case 'Event':
      return 'bg-pink-500/10 text-pink-600 border-pink-500/30'
    case 'Achievement':
      return 'bg-green-500/10 text-green-600 border-green-500/30'
    case 'Referral':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/30'
    case 'Free':
    default:
      return 'bg-secondary/10 text-secondary border-secondary/30'
  }
}

function RewardDetailCard({ reward, gameName }: { reward: GameReward; gameName: string }) {
  const Icon = getRewardIcon(reward.type)
  const colorClass = getRewardColor(reward.type)
  
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass.split(' ')[0]}`}>
            <Icon className={`h-6 w-6 ${colorClass.split(' ')[1]}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">
                {reward.title}
              </h3>
              <Badge variant="outline" className={colorClass}>
                {reward.type}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {reward.description}
            </p>
            
            {reward.value && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                <Gift className="h-4 w-4 text-secondary" />
                <span className="font-medium text-secondary">{reward.value}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function GameRewardsPage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const relatedGames = getRelatedGames(game, 4)
  
  // Group rewards by type
  const rewardsByType = {
    daily: game.rewards.filter(r => r.type === 'Daily'),
    free: game.rewards.filter(r => r.type === 'Free'),
    newPlayer: game.rewards.filter(r => r.type === 'New Player'),
    event: game.rewards.filter(r => r.type === 'Event'),
    achievement: game.rewards.filter(r => r.type === 'Achievement'),
    referral: game.rewards.filter(r => r.type === 'Referral'),
  }
  
  // ItemList schema for rewards
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Free Rewards`,
    description: `All free rewards and bonuses available in ${game.name}`,
    numberOfItems: game.rewards.length,
    itemListElement: game.rewards.map((reward, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: reward.title,
        description: reward.description,
        url: `https://savesmart.bio/gaming/${game.slug}/rewards`
      }
    }))
  }
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
      { "@type": "ListItem", position: 2, name: "Gaming", item: "https://savesmart.bio/gaming" },
      { "@type": "ListItem", position: 3, name: game.name, item: `https://savesmart.bio/gaming/${game.slug}` },
      { "@type": "ListItem", position: 4, name: "Rewards", item: `https://savesmart.bio/gaming/${game.slug}/rewards` }
    ]
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/90 to-secondary text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="relative z-10 mb-6 flex flex-wrap items-center gap-2 text-sm">
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
            <Link 
              href={`/gaming/${game.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              {game.shortName || game.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Free Rewards
            </span>
          </nav>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Gift className="h-3 w-3 mr-1" />
              Free Rewards
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              {game.rewards.length} Rewards
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} Free Rewards & Bonuses
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            All the ways to earn free rewards in {game.name}. 
            Daily bonuses, new player perks, event rewards, and more.
          </p>
          
          <Button size="lg" className="bg-white text-secondary hover:bg-white/90" asChild>
            <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
              <Gamepad2 className="h-5 w-5 mr-2" />
              Play {game.shortName || game.name}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </PageContainer>
      </section>
      
      {/* Daily Rewards */}
      {rewardsByType.daily.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Daily Rewards</h2>
                <p className="text-sm text-muted-foreground">Log in daily to claim these bonuses</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.daily.map((reward) => (
                <RewardDetailCard key={reward.id} reward={reward} gameName={game.name} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Free Rewards */}
      {rewardsByType.free.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Gift className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Free Items</h2>
                <p className="text-sm text-muted-foreground">No purchase required</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.free.map((reward) => (
                <RewardDetailCard key={reward.id} reward={reward} gameName={game.name} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* New Player Rewards */}
      {rewardsByType.newPlayer.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">New Player Rewards</h2>
                <p className="text-sm text-muted-foreground">One-time bonuses for new accounts</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.newPlayer.map((reward) => (
                <RewardDetailCard key={reward.id} reward={reward} gameName={game.name} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Event Rewards */}
      {rewardsByType.event.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <Star className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Event Rewards</h2>
                <p className="text-sm text-muted-foreground">Limited-time special events</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.event.map((reward) => (
                <RewardDetailCard key={reward.id} reward={reward} gameName={game.name} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Achievement & Other Rewards */}
      {(rewardsByType.achievement.length > 0 || rewardsByType.referral.length > 0) && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Trophy className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Achievements & Referrals</h2>
                <p className="text-sm text-muted-foreground">Earn rewards through gameplay</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {[...rewardsByType.achievement, ...rewardsByType.referral].map((reward) => (
                <RewardDetailCard key={reward.id} reward={reward} gameName={game.name} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* No Rewards Fallback */}
      {game.rewards.length === 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Gift className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No reward info available yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check the game&apos;s official channels for reward information.
                </p>
                <Button asChild>
                  <Link href={`/gaming/${game.slug}/codes`}>
                    View Promo Codes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </PageContainer>
        </section>
      )}
      
      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                More Games with Free Rewards
              </h3>
              <Link 
                href="/gaming/free-rewards"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/gaming/${relatedGame.slug}/rewards`}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-background transition-colors text-center"
                >
                  <Gamepad2 className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground line-clamp-1">
                    {relatedGame.shortName || relatedGame.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {relatedGame.rewards.length} rewards
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Quick Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Pages
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/gaming/${game.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              {game.name} Overview
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Promo Codes
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              All Free Rewards
            </Link>
          </div>
        </PageContainer>
      </section>
      
      <Footer />
    </div>
  )
}
