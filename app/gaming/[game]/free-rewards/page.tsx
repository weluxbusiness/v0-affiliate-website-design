import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { BreadcrumbNav, generateGamingBreadcrumbs } from "@/components/seo/breadcrumb-nav"
import { FAQSection } from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  Gift,
  Gamepad2,
  ExternalLink,
  ArrowRight,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  Star,
  Trophy,
  Users,
  Sparkles
} from "lucide-react"
import { 
  getGameBySlug,
  getAllGameSlugs,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode
} from "@/lib/gaming-data"
import type { GameReward } from "@/lib/gaming-data"

export const revalidate = 3600 // 1 hour for free rewards pages

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
  
  const today = new Date()
  const shortMonth = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const rewardCount = game.rewards.length
  
  return {
    title: `${game.shortName || game.name} Free Rewards – ${codeCount}+ Codes & Bonuses (${shortMonth})`,
    description: `Get all free ${game.name} rewards for ${shortMonth}! ${codeCount}+ promo codes plus ${rewardCount}+ daily bonuses, login rewards & free items. No purchase needed - claim now!`,
    keywords: [
      `${game.name} free rewards`,
      `${game.name} free stuff`,
      `${game.name} free codes`,
      `${game.name} free items`,
      `${game.name} daily rewards`,
      `${game.name} free gems`,
      `${game.name} free skins`,
      `free ${game.name} currency`,
    ],
    openGraph: {
      title: `${game.name} Free Rewards - ${codeCount}+ Codes & Bonuses | ${shortMonth}`,
      description: `${codeCount}+ free codes plus daily bonuses. No purchase needed!`,
      url: `https://savesmart.bio/gaming/${game.slug}/free-rewards`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} Free Rewards - Codes & Bonuses`,
      description: `${codeCount}+ free codes and daily rewards. Claim now!`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}/free-rewards`,
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

function RewardCard({ reward }: { reward: GameReward }) {
  const Icon = getRewardIcon(reward.type)
  const colorClass = getRewardColor(reward.type)
  
  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass.split(' ')[0]}`}>
            <Icon className={`h-6 w-6 ${colorClass.split(' ')[1]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">
                {reward.title}
              </h3>
              <Badge variant="outline" className={`${colorClass} shrink-0`}>
                {reward.type}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {reward.description}
            </p>
            
            {reward.value && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/5 border border-secondary/20">
                <Gift className="h-4 w-4 text-secondary shrink-0" />
                <span className="font-medium text-secondary text-sm truncate">{reward.value}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function GameFreeRewardsPage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 6)
  
  // Group rewards by type
  const rewardsByType = {
    daily: game.rewards.filter(r => r.type === 'Daily'),
    free: game.rewards.filter(r => r.type === 'Free'),
    newPlayer: game.rewards.filter(r => r.type === 'New Player'),
    event: game.rewards.filter(r => r.type === 'Event'),
    achievement: game.rewards.filter(r => r.type === 'Achievement'),
    referral: game.rewards.filter(r => r.type === 'Referral'),
  }
  
  // Calculate totals
  const totalRewards = game.rewards.length
  const totalCodes = activeCodes.length
  const totalFreeItems = totalRewards + totalCodes
  
  // FAQs for free rewards
  const freeRewardsFAQs = [
    {
      question: `How do I get free rewards in ${game.name}?`,
      answer: `There are multiple ways to get free rewards in ${game.name}: 1) Redeem promo codes from our list above. 2) Log in daily for login rewards. 3) Complete achievements and milestones. 4) Participate in limited-time events. 5) Refer friends to earn referral bonuses.`,
    },
    {
      question: `Are ${game.name} promo codes really free?`,
      answer: `Yes! All ${game.name} promo codes listed on SaveSmart are 100% free to use. Simply copy the code and redeem it in-game. There&apos;s no purchase required - these are official codes released by the game developers.`,
    },
    {
      question: `What free rewards can I get in ${game.name}?`,
      answer: `Free ${game.name} rewards include: in-game currency (gems, coins, etc.), character skins and cosmetics, experience boosters, premium items, exclusive collectibles, and limited-time event rewards. The specific rewards vary by code and promotion.`,
    },
    {
      question: `How often does ${game.name} give free rewards?`,
      answer: `${game.name} offers daily login rewards every day, plus new promo codes are released regularly during events, updates, and celebrations. We recommend checking this page daily to maximize your free rewards.`,
    },
    {
      question: `Do I need to spend money to get ${game.name} rewards?`,
      answer: `No! While ${game.name} has optional in-app purchases, you can earn substantial rewards completely free through promo codes, daily logins, achievements, and events. Our guide focuses exclusively on free rewards.`,
    },
  ]
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Free Rewards ${monthYear}`,
    description: `All free rewards available in ${game.name} including promo codes and bonuses`,
    numberOfItems: totalFreeItems,
    dateModified: today.toISOString(),
    itemListElement: [
      ...activeCodes.slice(0, 10).map((code, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: code.code,
          description: code.reward,
          price: "0",
          priceCurrency: "USD",
        }
      })),
      ...game.rewards.slice(0, 10).map((reward, index) => ({
        "@type": "ListItem",
        position: activeCodes.slice(0, 10).length + index + 1,
        item: {
          "@type": "Thing",
          name: reward.title,
          description: reward.description,
        }
      }))
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
      <section className="relative bg-gradient-to-br from-pink-500 to-rose-600 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <div className="relative z-10 mb-6">
            <BreadcrumbNav 
              items={generateGamingBreadcrumbs(game.slug, game.shortName || game.name, 'free-rewards')}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              <Gift className="h-3 w-3 mr-1" />
              100% Free
            </Badge>
            <Badge className="bg-pink-300/20 text-pink-100 border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              {totalFreeItems}+ Rewards
            </Badge>
            <Badge className="bg-white/10 text-white border-white/30">
              No Purchase Required
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} Free Rewards ({monthYear})
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Every way to get free rewards in {game.name}! We&apos;ve compiled all working promo codes, 
            daily bonuses, and free items you can claim without spending a dime.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Tag className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Promo Codes</p>
                <p className="text-lg font-bold">{totalCodes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Gift className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Bonus Rewards</p>
                <p className="text-lg font-bold">{totalRewards}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Total Free</p>
                <p className="text-lg font-bold">{totalFreeItems}+</p>
              </div>
            </div>
          </div>
          
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <a href={game.affiliateLink} target="_blank" rel="noopener noreferrer">
              <Gamepad2 className="h-5 w-5" />
              Play {game.shortName || game.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </PageContainer>
      </section>
      
      {/* Best Free Code */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-500" />
                Best Free Code Right Now
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Free Promo Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Free Promo Codes ({activeCodes.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Redeem these codes for instant free rewards
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
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Tag className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No promo codes available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check back soon for new codes!
                </p>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* Daily Rewards */}
      {rewardsByType.daily.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Daily Login Rewards</h2>
                <p className="text-sm text-muted-foreground">Log in every day to claim these bonuses</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.daily.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
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
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">New Player Rewards</h2>
                <p className="text-sm text-muted-foreground">One-time bonuses for starting players</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.newPlayer.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Free Items */}
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
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Event Rewards */}
      {rewardsByType.event.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <Star className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Event Rewards</h2>
                <p className="text-sm text-muted-foreground">Limited-time special events</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {rewardsByType.event.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Achievement & Referral Rewards */}
      {(rewardsByType.achievement.length > 0 || rewardsByType.referral.length > 0) && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Achievements & Referrals</h2>
                <p className="text-sm text-muted-foreground">Earn rewards through gameplay and invites</p>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {[...rewardsByType.achievement, ...rewardsByType.referral].map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* SEO Content Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {game.name} Free Rewards Guide - {monthYear}
            </h2>
            <div className="prose prose-muted max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Looking for free rewards in {game.name}? You&apos;ve come to the right place! This comprehensive 
                guide covers every way to earn free items, currency, and bonuses in {game.name} without spending 
                real money. We update this page regularly to ensure you never miss a free reward opportunity.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                Types of Free Rewards in {game.name}
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Promo Codes:</strong> Official codes that give instant free rewards when redeemed</li>
                <li><strong>Daily Login Rewards:</strong> Bonuses earned by simply logging into the game each day</li>
                <li><strong>New Player Rewards:</strong> One-time bonuses for completing tutorials and early milestones</li>
                <li><strong>Event Rewards:</strong> Limited-time items from special in-game events</li>
                <li><strong>Achievement Rewards:</strong> Free items earned by reaching gameplay milestones</li>
                <li><strong>Referral Rewards:</strong> Bonuses for inviting friends to play</li>
              </ul>
              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                How to Maximize Your Free Rewards
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                To get the most free rewards in {game.name}, we recommend: logging in daily even if you 
                don&apos;t play, redeeming all promo codes as soon as they&apos;re released (before they expire), 
                completing achievement milestones, participating in every event, and inviting friends through 
                the referral program. Consistent players can earn significant rewards over time without 
                spending any money.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bookmark this page and check back regularly. We monitor official {game.name} channels daily 
                to bring you new promo codes and reward opportunities as soon as they become available.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <FAQSection 
            faqs={freeRewardsFAQs}
            title={`${game.name} Free Rewards FAQ`}
          />
        </PageContainer>
      </section>
      
      {/* Internal Links */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            More {game.name} Resources
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Game Overview</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/codes-today`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Clock className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-foreground">Codes Today</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/working-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-foreground">Working Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/new-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Sparkles className="h-8 w-8 text-amber-500" />
              <span className="text-sm font-medium text-foreground">New Codes</span>
            </Link>
            <Link
              href={`/gaming/${game.slug}/redeem-codes`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
            >
              <Tag className="h-8 w-8 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Redeem Guide</span>
            </Link>
          </div>
          
          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">More Games with Free Rewards</h4>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/gaming/${relatedGame.slug}/free-rewards`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name} Free Rewards
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
