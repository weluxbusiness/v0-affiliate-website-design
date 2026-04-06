"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav"
import { FAQSection } from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Gift,
  Lightbulb,
  BookOpen,
  Zap,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Target,
  TrendingUp,
  Shield,
  Calendar
} from "lucide-react"
import { 
  getActivePromoCodes,
  getRelatedGames
} from "@/lib/gaming-data"
import type { Game } from "@/lib/gaming-data"
import { 
  getBlogUrl,
  getSeoUrl,
  type BlogPageType,
} from "@/lib/seo-routes"
import { BlogLinksSection } from "@/components/gaming/cross-links"

// Blog page configuration
interface BlogPageConfig {
  title: string
  headingPrefix: string
  icon: React.ReactNode
  color: string
}

const BLOG_CONFIG: Record<BlogPageType, BlogPageConfig> = {
  'how-to-get-free-rewards': {
    title: 'How to Get Free Rewards',
    headingPrefix: 'Free Rewards Guide',
    icon: <Gift className="h-6 w-6" />,
    color: 'text-emerald-500',
  },
  'tips-and-tricks': {
    title: 'Tips and Tricks',
    headingPrefix: 'Pro Tips',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'text-yellow-500',
  },
  'beginner-guide': {
    title: 'Beginner Guide',
    headingPrefix: 'Getting Started',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-blue-500',
  },
  'how-to-level-up-fast': {
    title: 'How to Level Up Fast',
    headingPrefix: 'Fast Leveling',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-purple-500',
  },
  'best-strategies': {
    title: 'Best Strategies',
    headingPrefix: 'Top Strategies',
    icon: <Trophy className="h-6 w-6" />,
    color: 'text-amber-500',
  },
}

interface BlogPageContentProps {
  game: Game
  pageType: BlogPageType
  slug: string
}

export function BlogPageContent({ game, pageType, slug }: BlogPageContentProps) {
  const config = BLOG_CONFIG[pageType]
  const activeCodes = getActivePromoCodes(game.promoCodes)
  const relatedGames = getRelatedGames(game, 6)
  
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const updateDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  
  // Generate breadcrumbs with flat URL
  const breadcrumbs = [
    { name: 'Gaming', url: '/gaming' },
    { name: game.name, url: `/gaming/${game.slug}` },
    { name: config.title, url: `/${slug}` },
  ]
  
  // JSON-LD structured data for article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${game.name} ${config.title} (${monthYear})`,
    description: `Complete ${config.title.toLowerCase()} for ${game.name}. Updated ${monthYear}.`,
    image: game.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'SaveSmart Gaming',
      url: 'https://savesmart.bio',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaveSmart',
      logo: {
        '@type': 'ImageObject',
        url: 'https://savesmart.bio/logo.png',
      },
    },
    datePublished: game.lastUpdated,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://savesmart.bio/${slug}`,
    },
  }

  // Generate FAQs based on page type
  const faqs = getFaqsByType(game.name, pageType, activeCodes.length, monthYear)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        
        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/30">
          <PageContainer>
            <div className="py-3">
              <BreadcrumbNav items={breadcrumbs} />
            </div>
          </PageContainer>
        </div>
        
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-muted/50 to-background">
          <PageContainer>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background border border-border ${config.color}`}>
                  {config.icon}
                </div>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Updated {updateDate}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                {game.name} {config.title}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-3xl">
                {pageType === 'how-to-get-free-rewards' && `Discover all the ways to earn free rewards in ${game.name} without spending any money. From promo codes to daily bonuses, we cover everything.`}
                {pageType === 'tips-and-tricks' && `Master ${game.name} with our collection of pro tips, hidden tricks, and advanced techniques that will give you the edge.`}
                {pageType === 'beginner-guide' && `New to ${game.name}? This comprehensive guide covers everything you need to know to start your journey on the right foot.`}
                {pageType === 'how-to-level-up-fast' && `Want to level up quickly in ${game.name}? Our expert guide reveals the fastest methods and pro strategies for rapid progression.`}
                {pageType === 'best-strategies' && `Dominate in ${game.name} with proven strategies, optimal builds, and meta tactics used by top players.`}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>10-15 min read</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{game.playerCount || '1M+ players'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gift className="h-4 w-4" />
                  <span>{activeCodes.length} active codes</span>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Quick Navigation */}
        <section className="py-6 border-b border-border bg-muted/20">
          <PageContainer>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">Jump to:</span>
              {pageType === 'how-to-get-free-rewards' && (
                <>
                  <a href="#promo-codes" className="text-sm text-primary hover:underline">Promo Codes</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#daily-rewards" className="text-sm text-primary hover:underline">Daily Rewards</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#events" className="text-sm text-primary hover:underline">Events</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#referrals" className="text-sm text-primary hover:underline">Referrals</a>
                </>
              )}
              {pageType === 'tips-and-tricks' && (
                <>
                  <a href="#pro-tips" className="text-sm text-primary hover:underline">Pro Tips</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#hidden-features" className="text-sm text-primary hover:underline">Hidden Features</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#advanced" className="text-sm text-primary hover:underline">Advanced Techniques</a>
                </>
              )}
              {pageType === 'beginner-guide' && (
                <>
                  <a href="#getting-started" className="text-sm text-primary hover:underline">Getting Started</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#basics" className="text-sm text-primary hover:underline">Core Mechanics</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#mistakes" className="text-sm text-primary hover:underline">Mistakes to Avoid</a>
                </>
              )}
              {pageType === 'how-to-level-up-fast' && (
                <>
                  <a href="#fast-methods" className="text-sm text-primary hover:underline">Fast Methods</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#xp-sources" className="text-sm text-primary hover:underline">XP Sources</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#optimization" className="text-sm text-primary hover:underline">Optimization</a>
                </>
              )}
              {pageType === 'best-strategies' && (
                <>
                  <a href="#meta" className="text-sm text-primary hover:underline">Current Meta</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#builds" className="text-sm text-primary hover:underline">Best Builds</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="#tactics" className="text-sm text-primary hover:underline">Tactics</a>
                </>
              )}
              <span className="text-muted-foreground">|</span>
              <a href="#faq" className="text-sm text-primary hover:underline">FAQ</a>
            </div>
          </PageContainer>
        </section>
        
        {/* Main Content */}
        <article className="py-10 md:py-14">
          <PageContainer>
            <div className="max-w-4xl mx-auto">
              
              {/* HOW TO GET FREE REWARDS */}
              {pageType === 'how-to-get-free-rewards' && (
                <FreeRewardsContent game={game} activeCodes={activeCodes} monthYear={monthYear} updateDate={updateDate} />
              )}
              
              {/* TIPS AND TRICKS */}
              {pageType === 'tips-and-tricks' && (
                <TipsAndTricksContent game={game} activeCodes={activeCodes} />
              )}
              
              {/* BEGINNER GUIDE */}
              {pageType === 'beginner-guide' && (
                <BeginnerGuideContent game={game} activeCodes={activeCodes} />
              )}
              
              {/* HOW TO LEVEL UP FAST */}
              {pageType === 'how-to-level-up-fast' && (
                <LevelUpFastContent game={game} activeCodes={activeCodes} />
              )}
              
              {/* BEST STRATEGIES */}
              {pageType === 'best-strategies' && (
                <BestStrategiesContent game={game} activeCodes={activeCodes} monthYear={monthYear} />
              )}
              
            </div>
          </PageContainer>
        </article>
        
        {/* FAQ Section */}
        <section id="faq" className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <FAQSection 
              faqs={faqs}
              title={`${game.name} ${config.title} FAQ`}
            />
          </PageContainer>
        </section>
        
        {/* Cross-links to other blog pages */}
        <BlogLinksSection game={game} currentBlogType={pageType} />
        
        {/* Related games */}
        {relatedGames.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Game Guides</h2>
              <div className="flex flex-wrap gap-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={getBlogUrl(relatedGame.slug, pageType)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {relatedGame.shortName || relatedGame.name} {config.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

// Content sections as separate components for organization
function FreeRewardsContent({ game, activeCodes, monthYear, updateDate }: { game: Game; activeCodes: ReturnType<typeof getActivePromoCodes>; monthYear: string; updateDate: string }) {
  return (
    <div className="space-y-8">
      <p className="text-xl text-muted-foreground leading-relaxed">
        Looking for ways to get free rewards in {game.name}? You&apos;re in the right place. This comprehensive guide covers every legitimate method to earn free gems, items, and bonuses without spending a single dollar. Updated for {monthYear}.
      </p>
      
      <section id="promo-codes">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Gift className="h-6 w-6 text-emerald-500" />
          Promo Codes - Instant Free Rewards
        </h2>
        <p className="text-muted-foreground mb-4">
          The fastest way to get free rewards in {game.name} is through promo codes. These are special codes released by the developers that give you instant rewards when redeemed. Currently, there are <strong className="text-foreground">{activeCodes.length} active promo codes</strong> available.
        </p>
        <p className="text-muted-foreground mb-6">
          Promo codes typically offer free gems, currency, items, and exclusive cosmetics. They&apos;re usually time-limited, so it&apos;s important to redeem them as soon as possible. Check our <Link href={getSeoUrl(game.slug, 'codes')} className="text-primary hover:underline font-medium">codes page</Link> for the latest verified codes.
        </p>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">{activeCodes.length} Active Promo Codes Available</p>
                <p className="text-sm text-muted-foreground">Verified and working as of {updateDate}</p>
              </div>
              <Button asChild>
                <Link href={getSeoUrl(game.slug, 'codes')}>
                  View All Codes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section id="daily-rewards">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Calendar className="h-6 w-6 text-blue-500" />
          Daily Login Rewards
        </h2>
        <p className="text-muted-foreground mb-4">
          One of the most consistent ways to earn free rewards is through daily login bonuses. {game.name} offers generous daily rewards that accumulate over time. Simply logging in each day can earn you significant rewards.
        </p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Daily check-in bonuses</strong> - Free currency and items just for opening the game</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Consecutive login rewards</strong> - Bigger rewards for logging in multiple days in a row</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Weekly milestone bonuses</strong> - Special rewards for maintaining weekly streaks</span>
          </li>
        </ul>
      </section>
      
      <section id="events">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Star className="h-6 w-6 text-purple-500" />
          In-Game Events
        </h2>
        <p className="text-muted-foreground mb-4">
          {game.name} regularly hosts special events that offer exclusive free rewards. These are some of the best opportunities to stock up on premium currency and rare items.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Anniversary events</strong> - Major celebrations with generous giveaways</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Seasonal events</strong> - Holiday-themed events with exclusive rewards</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Collaboration events</strong> - Crossover events with unique free items</span>
          </li>
        </ul>
      </section>
      
      <section id="referrals">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Users className="h-6 w-6 text-amber-500" />
          Referral Programs
        </h2>
        <p className="text-muted-foreground mb-4">
          By inviting friends to play {game.name}, both you and your friends can earn bonus rewards. Don&apos;t overlook the referral system - it can be a goldmine for free rewards.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Friend system bonuses</strong> - Add friends for daily gift exchanges</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Guild/clan rewards</strong> - Join an active community for group rewards</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Social media codes</strong> - Follow official accounts for exclusive codes</span>
          </li>
        </ul>
      </section>
      
      <section>
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Target className="h-6 w-6 text-red-500" />
          Achievements and Missions
        </h2>
        <p className="text-muted-foreground mb-4">
          Don&apos;t forget about achievement rewards! {game.name} has an extensive achievement system that rewards you for normal gameplay activities.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <Trophy className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Tutorial achievements</strong> - Easy rewards for learning the game</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Trophy className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Progression milestones</strong> - Rewards for reaching new levels</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Trophy className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Collection achievements</strong> - Bonuses for collecting characters/items</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

function TipsAndTricksContent({ game, activeCodes }: { game: Game; activeCodes: ReturnType<typeof getActivePromoCodes> }) {
  return (
    <div className="space-y-8">
      <p className="text-xl text-muted-foreground leading-relaxed">
        Want to become a {game.name} pro? These insider tips and tricks will help you play smarter, progress faster, and get more out of every session.
      </p>
      
      <section id="pro-tips">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          Essential Pro Tips
        </h2>
        
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">1. Optimize Your Daily Routine</h3>
            <p className="text-muted-foreground">
              Efficient daily play is crucial. Create a checklist of daily activities and complete them in order of priority. Focus on time-limited activities first.
            </p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">2. Resource Management</h3>
            <p className="text-muted-foreground">
              Don&apos;t spend premium currency impulsively. Save for limited-time banners, special events, and guaranteed rewards.
            </p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">3. Join an Active Community</h3>
            <p className="text-muted-foreground">
              Being part of an active guild or clan provides significant benefits including exclusive rewards and valuable advice.
            </p>
          </div>
        </div>
      </section>
      
      <section id="hidden-features">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Star className="h-6 w-6 text-amber-500" />
          Hidden Features Most Players Miss
        </h2>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Secret menus</strong> - Long-press or swipe gestures may reveal hidden options</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Timing bonuses</strong> - Certain actions at specific times yield better results</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Combo systems</strong> - Chain actions together for bonus effects</span>
          </li>
        </ul>
      </section>
      
      <section id="advanced">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <TrendingUp className="h-6 w-6 text-emerald-500" />
          Advanced Techniques
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Animation Canceling</h3>
            <p className="text-muted-foreground">
              Learn to cancel animations to increase your actions per minute. This can significantly speed up farming efficiency.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Energy Management</h3>
            <p className="text-muted-foreground">
              Never let your energy cap out. Plan your play sessions around energy regeneration to maximize efficiency.
            </p>
          </div>
        </div>
      </section>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Get Free Rewards Now</p>
              <p className="text-sm text-muted-foreground">{activeCodes.length} promo codes currently available</p>
            </div>
            <Button asChild>
              <Link href={getSeoUrl(game.slug, 'codes')}>
                View Free Rewards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BeginnerGuideContent({ game, activeCodes }: { game: Game; activeCodes: ReturnType<typeof getActivePromoCodes> }) {
  return (
    <div className="space-y-8">
      <p className="text-xl text-muted-foreground leading-relaxed">
        Welcome to {game.name}! This beginner guide will help you understand the game, avoid common mistakes, and start your journey on the right foot.
      </p>
      
      <section id="getting-started">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <BookOpen className="h-6 w-6 text-blue-500" />
          Getting Started
        </h2>
        <p className="text-muted-foreground mb-4">
          The first few hours in {game.name} are crucial. Here&apos;s what you should focus on as a new player:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Complete the tutorial</strong> - Learn the basic mechanics and earn free rewards</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Redeem all promo codes</strong> - Get free resources to boost your start</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Link your account</strong> - Prevent data loss and unlock cross-platform play</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Join a guild early</strong> - Access guild features and community support</span>
          </li>
        </ul>
      </section>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">New Player Tip: Claim Free Codes</p>
              <p className="text-sm text-muted-foreground">{activeCodes.length} promo codes available for instant rewards</p>
            </div>
            <Button asChild>
              <Link href={getSeoUrl(game.slug, 'codes')}>
                View Codes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <section id="basics">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Shield className="h-6 w-6 text-emerald-500" />
          Core Mechanics
        </h2>
        <p className="text-muted-foreground mb-4">
          Understanding these core mechanics will help you progress efficiently in {game.name}:
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Energy/Stamina System</h3>
            <p className="text-muted-foreground">
              Most activities cost energy. Plan your play sessions around energy regeneration and never let it cap out.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Currency Types</h3>
            <p className="text-muted-foreground">
              Learn the different currencies. Free currency is for daily use; premium currency should be saved for special occasions.
            </p>
          </div>
        </div>
      </section>
      
      <section id="mistakes">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Target className="h-6 w-6 text-red-500" />
          Common Mistakes to Avoid
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Spreading resources too thin</strong> - Focus on a core team instead of upgrading everyone</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Spending premium currency early</strong> - Save for limited-time offers and guaranteed pulls</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Ignoring daily activities</strong> - Consistent daily play beats occasional grinding</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Not joining a guild</strong> - Guild rewards are too valuable to miss</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

function LevelUpFastContent({ game, activeCodes }: { game: Game; activeCodes: ReturnType<typeof getActivePromoCodes> }) {
  return (
    <div className="space-y-8">
      <p className="text-xl text-muted-foreground leading-relaxed">
        Want to level up quickly in {game.name}? Our expert guide reveals the fastest methods and pro strategies for rapid progression.
      </p>
      
      <section id="fast-methods">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Zap className="h-6 w-6 text-purple-500" />
          Fastest Leveling Methods
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">1. Main Story Progression</h3>
            <p className="text-muted-foreground">
              The main story offers the most XP per energy spent. Progress through it as quickly as possible.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">2. Event Participation</h3>
            <p className="text-muted-foreground">
              Events often have bonus XP rewards. Prioritize event content during limited-time periods.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">3. Daily Missions</h3>
            <p className="text-muted-foreground">
              Never skip daily missions. They provide consistent XP and compound over time.
            </p>
          </div>
        </div>
      </section>
      
      <section id="xp-sources">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <TrendingUp className="h-6 w-6 text-emerald-500" />
          All XP Sources
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Story quests</strong> - High XP, one-time rewards</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Daily/Weekly missions</strong> - Consistent XP income</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Events</strong> - Bonus XP during limited periods</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">XP items</strong> - Use during bonus XP periods</span>
          </li>
        </ul>
      </section>
      
      <section id="optimization">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Target className="h-6 w-6 text-amber-500" />
          XP Optimization Tips
        </h2>
        <p className="text-muted-foreground mb-4">
          These tips will help you maximize XP gain in {game.name}:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span>Use XP boost items during high-efficiency farming sessions</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span>Never let your energy/stamina cap out</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <span>Prioritize limited-time XP events</span>
          </li>
        </ul>
      </section>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Boost Your Progress</p>
              <p className="text-sm text-muted-foreground">{activeCodes.length} promo codes with resources available</p>
            </div>
            <Button asChild>
              <Link href={getSeoUrl(game.slug, 'codes')}>
                Get Free Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BestStrategiesContent({ game, activeCodes, monthYear }: { game: Game; activeCodes: ReturnType<typeof getActivePromoCodes>; monthYear: string }) {
  return (
    <div className="space-y-8">
      <p className="text-xl text-muted-foreground leading-relaxed">
        Dominate in {game.name} with proven strategies, optimal builds, and meta tactics used by top players. Updated for {monthYear}.
      </p>
      
      <section id="meta">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Trophy className="h-6 w-6 text-amber-500" />
          Current Meta ({monthYear})
        </h2>
        <p className="text-muted-foreground mb-4">
          The current meta in {game.name} emphasizes synergy and efficiency over raw power. Here are the key trends:
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Synergy Over Power</h3>
            <p className="text-muted-foreground">
              Team synergy matters more than individual strength. Build teams with complementary abilities.
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Flexibility is Key</h3>
            <p className="text-muted-foreground">
              The best players adapt their strategies based on content. Don&apos;t rely on a single approach.
            </p>
          </div>
        </div>
      </section>
      
      <section id="builds">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Shield className="h-6 w-6 text-emerald-500" />
          Best Team Builds
        </h2>
        <p className="text-muted-foreground mb-4">
          Focus on building a balanced team with proper role coverage:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Main DPS</strong> - Your primary damage dealer</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Tank/Defender</strong> - Absorbs damage for the team</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Support/Healer</strong> - Keeps the team alive</span>
          </li>
          <li className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <span><strong className="text-foreground">Utility</strong> - Buffs, debuffs, and crowd control</span>
          </li>
        </ul>
      </section>
      
      <section id="tactics">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
          <Target className="h-6 w-6 text-red-500" />
          Advanced Tactics
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Skill Rotation</h3>
            <p className="text-muted-foreground">
              Master the optimal skill rotation for maximum efficiency. The order of abilities matters.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cooldown Management</h3>
            <p className="text-muted-foreground">
              Track important cooldowns and time your actions accordingly. Don&apos;t waste powerful abilities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Resource Efficiency</h3>
            <p className="text-muted-foreground">
              Don&apos;t overkill enemies. Use just enough resources to complete content efficiently.
            </p>
          </div>
        </div>
      </section>
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Get Resources for Your Builds</p>
              <p className="text-sm text-muted-foreground">{activeCodes.length} promo codes available now</p>
            </div>
            <Button asChild>
              <Link href={getSeoUrl(game.slug, 'codes')}>
                View All Codes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Generate FAQs based on page type
function getFaqsByType(gameName: string, pageType: BlogPageType, codeCount: number, monthYear: string): Array<{ question: string; answer: string }> {
  const baseFaqs: Record<BlogPageType, Array<{ question: string; answer: string }>> = {
    'how-to-get-free-rewards': [
      {
        question: `How do I get free rewards in ${gameName}?`,
        answer: `You can get free rewards in ${gameName} through promo codes, daily login bonuses, in-game events, achievements, and referral programs. Currently, there are ${codeCount} active promo codes available.`
      },
      {
        question: `Are ${gameName} promo codes free?`,
        answer: `Yes, all promo codes for ${gameName} are completely free. They are released by the developers as gifts to players.`
      },
      {
        question: `How often does ${gameName} release new promo codes?`,
        answer: `${gameName} typically releases new promo codes during updates, special events, holidays, and anniversaries.`
      },
    ],
    'tips-and-tricks': [
      {
        question: `What are the best tips for ${gameName}?`,
        answer: `The best tips include optimizing your daily routine, managing resources wisely, joining an active guild, and focusing on a core team.`
      },
      {
        question: `Are there any secret tricks in ${gameName}?`,
        answer: `Yes, ${gameName} has several hidden features and tricks including animation canceling, optimal timing, and hidden menus.`
      },
    ],
    'beginner-guide': [
      {
        question: `How do I start playing ${gameName}?`,
        answer: `Start by completing the tutorial, claiming free rewards and promo codes, linking your account, and focusing on the main story.`
      },
      {
        question: `What mistakes should I avoid as a ${gameName} beginner?`,
        answer: `Common mistakes include spending premium currency early, spreading resources across too many characters, and ignoring daily activities.`
      },
      {
        question: `Is ${gameName} free to play?`,
        answer: `Yes, ${gameName} is free to play. You can enjoy the full game without spending money.`
      },
    ],
    'how-to-level-up-fast': [
      {
        question: `What is the fastest way to level up in ${gameName}?`,
        answer: `The fastest way to level up is through main story progression, event participation, and completing daily missions.`
      },
      {
        question: `How can I get more XP in ${gameName}?`,
        answer: `Maximize XP by completing all daily and weekly missions, participating in events, and using XP boost items strategically.`
      },
    ],
    'best-strategies': [
      {
        question: `What is the best strategy for ${gameName}?`,
        answer: `The best strategy focuses on team synergy, proper role coverage, resource management, and adapting to different situations.`
      },
      {
        question: `What is the current meta in ${gameName}?`,
        answer: `The meta in ${gameName} for ${monthYear} emphasizes synergy and efficiency over raw power.`
      },
    ],
  }
  
  return baseFaqs[pageType] || []
}
