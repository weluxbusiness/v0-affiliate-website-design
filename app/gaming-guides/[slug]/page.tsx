import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  Gamepad2,
  Sparkles,
  TrendingUp,
  Shield,
  Calendar
} from "lucide-react"
import { 
  getGameBySlug,
  getActivePromoCodes,
  getRelatedGames
} from "@/lib/gaming-data"
import { 
  parseBlogSlug, 
  generateAllBlogSlugs,
  getBlogUrl,
  getSeoUrl,
  type BlogPageType,
  BLOG_PAGE_TYPES
} from "@/lib/seo-routes"

export const revalidate = 86400 // 24 hours - blog content updates less frequently

export async function generateStaticParams() {
  return generateAllBlogSlugs()
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Blog page configuration
interface BlogPageConfig {
  title: string
  headingPrefix: string
  icon: React.ReactNode
  color: string
  keywords: string[]
}

const BLOG_CONFIG: Record<BlogPageType, BlogPageConfig> = {
  'how-to-get-free-rewards': {
    title: 'How to Get Free Rewards',
    headingPrefix: 'Free Rewards Guide',
    icon: <Gift className="h-6 w-6" />,
    color: 'text-emerald-500',
    keywords: ['free rewards', 'free gems', 'free items', 'no cost'],
  },
  'tips-and-tricks': {
    title: 'Tips and Tricks',
    headingPrefix: 'Pro Tips',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'text-yellow-500',
    keywords: ['tips', 'tricks', 'secrets', 'hacks'],
  },
  'beginner-guide': {
    title: 'Beginner Guide',
    headingPrefix: 'Getting Started',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-blue-500',
    keywords: ['beginner', 'starter', 'new player', 'guide'],
  },
  'how-to-level-up-fast': {
    title: 'How to Level Up Fast',
    headingPrefix: 'Fast Leveling',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-purple-500',
    keywords: ['level up', 'fast', 'quick', 'XP'],
  },
  'best-strategies': {
    title: 'Best Strategies',
    headingPrefix: 'Top Strategies',
    icon: <Trophy className="h-6 w-6" />,
    color: 'text-amber-500',
    keywords: ['strategy', 'meta', 'best', 'optimal'],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseBlogSlug(slug)
  
  if (!parsed) {
    return { title: "Page Not Found | SaveSmart" }
  }
  
  const game = getGameBySlug(parsed.gameSlug)
  if (!game) {
    return { title: "Game Not Found | SaveSmart Gaming" }
  }
  
  const config = BLOG_CONFIG[parsed.pageType]
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const shortMonth = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  
  const titleByType: Record<BlogPageType, string> = {
    'how-to-get-free-rewards': `${game.shortName || game.name} Free Rewards Guide – Get Free Gems & Items (${shortMonth})`,
    'tips-and-tricks': `${game.shortName || game.name} Tips & Tricks – Pro Secrets (${shortMonth})`,
    'beginner-guide': `${game.shortName || game.name} Beginner Guide – Start Strong (${shortMonth})`,
    'how-to-level-up-fast': `${game.shortName || game.name} Level Up Fast – Quick XP Guide (${shortMonth})`,
    'best-strategies': `${game.shortName || game.name} Best Strategies – Win More (${shortMonth})`,
  }
  
  const descriptionByType: Record<BlogPageType, string> = {
    'how-to-get-free-rewards': `Complete guide to get free rewards in ${game.name}. Learn how to earn free gems, items, and bonuses without spending money. Updated ${monthYear}.`,
    'tips-and-tricks': `Master ${game.name} with our expert tips and tricks. Pro secrets, hidden features, and advanced techniques. Updated ${monthYear}.`,
    'beginner-guide': `New to ${game.name}? Our beginner guide covers everything you need to know to start strong. Tips, strategies, and mistakes to avoid. Updated ${monthYear}.`,
    'how-to-level-up-fast': `Level up quickly in ${game.name} with our fast XP guide. Best methods, shortcuts, and pro strategies for rapid progression. Updated ${monthYear}.`,
    'best-strategies': `Dominate ${game.name} with the best strategies and meta builds. Win more matches with proven tactics. Updated ${monthYear}.`,
  }
  
  return {
    title: titleByType[parsed.pageType],
    description: descriptionByType[parsed.pageType],
    keywords: [
      `${game.name} ${config.title.toLowerCase()}`,
      ...config.keywords.map(k => `${game.name} ${k}`),
      `${game.name} guide`,
      `${game.name} ${monthYear}`,
    ],
    openGraph: {
      title: titleByType[parsed.pageType],
      description: descriptionByType[parsed.pageType],
      type: 'article',
      publishedTime: game.lastUpdated,
      modifiedTime: new Date().toISOString(),
    },
    alternates: {
      canonical: `https://savesmart.bio/gaming-guides/${slug}`,
    },
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseBlogSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const game = getGameBySlug(parsed.gameSlug)
  if (!game) {
    notFound()
  }
  
  const { pageType } = parsed
  const config = BLOG_CONFIG[pageType]
  const activeCodes = getActivePromoCodes(game.promoCodes)
  const relatedGames = getRelatedGames(game.id, 6)
  
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const updateDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  
  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Gaming', url: '/gaming' },
    { name: game.name, url: `/gaming/${game.slug}` },
    { name: config.title, url: `/gaming-guides/${slug}` },
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
      '@id': `https://savesmart.bio/gaming-guides/${slug}`,
    },
  }

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
                      Promo codes typically offer free gems, currency, items, and exclusive cosmetics. They&apos;re usually time-limited, so it&apos;s important to redeem them as soon as possible. Check our <Link href={getSeoUrl(game.slug, 'working-codes')} className="text-primary hover:underline font-medium">working codes page</Link> for the latest verified codes.
                    </p>
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-foreground">{activeCodes.length} Active Promo Codes Available</p>
                            <p className="text-sm text-muted-foreground">Verified and working as of {updateDate}</p>
                          </div>
                          <Button asChild>
                            <Link href={getSeoUrl(game.slug, 'codes-today')}>
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
                      One of the most consistent ways to earn free rewards is through daily login bonuses. {game.name} offers generous daily rewards that accumulate over time. Simply logging in each day, even for a few minutes, can earn you:
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
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Monthly cumulative rewards</strong> - Premium items after logging in for a set number of days each month</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg border border-border">
                      <strong className="text-foreground">Pro tip:</strong> Set a daily reminder to log in, even if you don&apos;t have time to play. Those daily rewards add up significantly over a month.
                    </p>
                  </section>
                  
                  <section id="events">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                      In-Game Events and Limited-Time Activities
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {game.name} regularly hosts special events that offer exclusive free rewards. These events are some of the best opportunities to stock up on premium currency and rare items without spending money.
                    </p>
                    <p className="text-muted-foreground mb-4">Types of events to watch for:</p>
                    <ul className="space-y-2 mb-4">
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
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Community milestone events</strong> - Rewards when the community hits targets</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section id="referrals">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Users className="h-6 w-6 text-amber-500" />
                      Referral Programs and Social Rewards
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Many players overlook the referral system, but it can be a goldmine for free rewards. By inviting friends to play {game.name}, both you and your friends can earn bonus rewards.
                    </p>
                    <p className="text-muted-foreground mb-4">Additional social features that offer free rewards:</p>
                    <ul className="space-y-2 mb-4">
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
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Stream drops</strong> - Watch official streams for free rewards</span>
                      </li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Target className="h-6 w-6 text-red-500" />
                      Achievements and Missions
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Don&apos;t forget about achievement rewards! {game.name} has an extensive achievement system that rewards you for normal gameplay activities. Focus on completing daily and weekly missions for consistent free rewards.
                    </p>
                    <p className="text-muted-foreground mb-4">Key achievement categories:</p>
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
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <Trophy className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Challenge achievements</strong> - Premium rewards for difficult tasks</span>
                      </li>
                    </ul>
                  </section>
                </div>
              )}
              
              {/* TIPS AND TRICKS */}
              {pageType === 'tips-and-tricks' && (
                <div className="space-y-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Want to become a {game.name} pro? These insider tips and tricks will help you play smarter, progress faster, and get more out of every session. From hidden features to advanced techniques, we&apos;ve got you covered.
                  </p>
                  
                  <section id="pro-tips">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Lightbulb className="h-6 w-6 text-yellow-500" />
                      Essential Pro Tips
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      These tips separate casual players from experts. Master these fundamentals and you&apos;ll see immediate improvement in your {game.name} gameplay.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-muted/30 rounded-lg border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-2">1. Optimize Your Daily Routine</h3>
                        <p className="text-muted-foreground">
                          Efficient daily play is crucial. Create a checklist of daily activities and complete them in order of priority. Focus on time-limited activities first, then move to permanent content.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/30 rounded-lg border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-2">2. Resource Management</h3>
                        <p className="text-muted-foreground">
                          Don&apos;t spend premium currency impulsively. Save for limited-time banners, special events, and guaranteed rewards. The most successful players are patient with their resources.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted/30 rounded-lg border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-2">3. Join an Active Community</h3>
                        <p className="text-muted-foreground">
                          Being part of an active guild or clan provides significant benefits beyond just social interaction. You&apos;ll get access to guild-exclusive rewards, team content, and valuable advice from experienced players.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <section id="hidden-features">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Star className="h-6 w-6 text-amber-500" />
                      Hidden Features Most Players Miss
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {game.name} has several features that aren&apos;t immediately obvious. These hidden mechanics can give you a significant advantage:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Secret menus</strong> - Long-press or swipe gestures may reveal hidden options</span>
                      </li>
                      <li className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span><strong className="text-foreground">Developer console</strong> - Some games have debug features accessible to players</span>
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
                    <p className="text-muted-foreground mb-6">
                      Once you&apos;ve mastered the basics, these advanced techniques will take your gameplay to the next level:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Animation Canceling</h3>
                        <p className="text-muted-foreground">
                          Learn to cancel animations to increase your actions per minute. This technique can significantly speed up farming and combat efficiency.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Energy Management</h3>
                        <p className="text-muted-foreground">
                          Never let your energy cap out. Plan your play sessions around energy regeneration to maximize efficiency.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Event Optimization</h3>
                        <p className="text-muted-foreground">
                          During events, prioritize limited-time rewards over permanent content. Events often offer the best value for your time and resources.
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
                          <Link href={getSeoUrl(game.slug, 'free-rewards')}>
                            View Free Rewards <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* BEGINNER GUIDE */}
              {pageType === 'beginner-guide' && (
                <div className="space-y-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Welcome to {game.name}! This beginner guide will help you understand the game, avoid common mistakes, and set yourself up for long-term success. Whether you&apos;re completely new or returning after a break, this guide has everything you need.
                  </p>
                  
                  <section id="getting-started">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                      Getting Started - Your First Steps
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      The first few hours in {game.name} are crucial for setting up your account correctly. Here&apos;s what you should focus on:
                    </p>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Complete the Tutorial</h3>
                        <p className="text-muted-foreground">
                          Don&apos;t skip the tutorial! It teaches essential mechanics and often provides significant starter rewards. Pay attention to every tip - they&apos;ll save you time later.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Claim All Free Rewards</h3>
                        <p className="text-muted-foreground mb-3">
                          Immediately check for any available promo codes and new player bonuses. These limited-time rewards give you a huge head start.
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <Link href={getSeoUrl(game.slug, 'new-codes')}>
                            View {activeCodes.length} Active Codes <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Link Your Account</h3>
                        <p className="text-muted-foreground">
                          Link your account to email, Google, or social media immediately. This protects your progress and often provides bonus rewards for linking.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <section id="basics">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Gamepad2 className="h-6 w-6 text-purple-500" />
                      Core Mechanics Explained
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Understanding {game.name}&apos;s core mechanics is essential for long-term success. Here are the key systems you need to know:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Progression System</h3>
                        <p className="text-muted-foreground">
                          The progression system in {game.name} revolves around leveling up your account and characters. Focus on main story missions first, as they unlock essential features and provide the best rewards for your time.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Currency Types</h3>
                        <p className="text-muted-foreground mb-3">{game.name} has multiple currencies. Learn what each one is used for:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Premium currency</strong> - Save this for limited-time offers and guaranteed rewards</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Standard currency</strong> - Use freely for regular upgrades and purchases</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Event currency</strong> - Spend before events end - they don&apos;t carry over</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  
                  <section id="mistakes">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Shield className="h-6 w-6 text-red-500" />
                      Common Beginner Mistakes to Avoid
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Learning from others&apos; mistakes is the fastest way to improve. Here are the most common errors new {game.name} players make:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Mistake #1: Spending Premium Currency Early</h3>
                        <p className="text-muted-foreground">
                          New players often spend premium currency on basic items or regular banners. Save it for special events and guaranteed rewards - the value is much better.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Mistake #2: Spreading Resources Too Thin</h3>
                        <p className="text-muted-foreground">
                          Focus on building a core team of characters rather than trying to level everyone equally. A strong main team is better than many weak characters.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Mistake #3: Ignoring Daily Activities</h3>
                        <p className="text-muted-foreground">
                          Daily missions and activities provide essential resources. Even 15 minutes of daily play adds up significantly over time.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Mistake #4: Playing Solo</h3>
                        <p className="text-muted-foreground">
                          Joining a guild or adding friends provides bonus rewards, help with difficult content, and makes the game more enjoyable. Don&apos;t neglect the social features.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}
              
              {/* HOW TO LEVEL UP FAST */}
              {pageType === 'how-to-level-up-fast' && (
                <div className="space-y-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Want to level up quickly in {game.name}? This guide reveals the most efficient methods to maximize your XP gain and accelerate your progression. From optimal grinding spots to pro shortcuts, we cover it all.
                  </p>
                  
                  <section id="fast-methods">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Zap className="h-6 w-6 text-purple-500" />
                      Fastest Leveling Methods
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      These are the most time-efficient ways to gain XP in {game.name}. Prioritize these activities when you want to level up quickly.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Method #1: Main Story Progression</h3>
                        <p className="text-muted-foreground">
                          The main story provides the highest XP per energy spent. Complete story missions before farming side content. Story progression also unlocks essential features that multiply your XP gain.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Method #2: Event Participation</h3>
                        <p className="text-muted-foreground">
                          Limited-time events often provide bonus XP or special XP items. During events, shift your focus to event activities for accelerated leveling.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Method #3: XP Boost Items</h3>
                        <p className="text-muted-foreground">
                          Use XP boost items strategically during high-efficiency grinding sessions. Stack boosts when possible for maximum effect.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <section id="xp-sources">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <TrendingUp className="h-6 w-6 text-emerald-500" />
                      All XP Sources Ranked
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Not all XP sources are created equal. Here&apos;s a ranking of XP sources by efficiency:
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Badge className="bg-amber-500">Tier S</Badge>
                          Best XP Sources
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Main story missions</strong> - Highest XP reward, unlock progression</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Event stages</strong> - Bonus XP during limited time</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Star className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Daily missions</strong> - Consistent, efficient rewards</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Badge className="bg-blue-500">Tier A</Badge>
                          Good XP Sources
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Weekly challenges</strong> - Strong rewards for completion</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Guild activities</strong> - Bonus XP from group content</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Achievement rewards</strong> - One-time bonus XP</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  
                  <section id="optimization">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Target className="h-6 w-6 text-amber-500" />
                      Optimization Tips
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      These optimization tips will help you squeeze every bit of XP from your play sessions:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Energy Management</h3>
                        <p className="text-muted-foreground">
                          Never let your energy cap out. Set alarms if needed to use energy before it maxes out. Wasted energy is wasted XP.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Boost Stacking</h3>
                        <p className="text-muted-foreground">
                          Stack XP boosts from different sources when possible. Combine premium boosts with event boosts for maximum effect.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Optimal Play Times</h3>
                        <p className="text-muted-foreground">
                          Some games have server reset times that allow you to double-dip on daily rewards. Learn your game&apos;s reset schedule and plan accordingly.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">Boost Your Progress with Free Codes</p>
                          <p className="text-sm text-muted-foreground">{activeCodes.length} codes available - free XP items inside</p>
                        </div>
                        <Button asChild>
                          <Link href={getSeoUrl(game.slug, 'working-codes')}>
                            Get Free Codes <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* BEST STRATEGIES */}
              {pageType === 'best-strategies' && (
                <div className="space-y-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Ready to dominate in {game.name}? This strategy guide covers the current meta, optimal builds, and proven tactics used by top players. Whether you&apos;re competing in PvP or pushing endgame content, these strategies will give you the edge.
                  </p>
                  
                  <section id="meta">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Trophy className="h-6 w-6 text-amber-500" />
                      Current Meta Overview ({monthYear})
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      The meta in {game.name} is constantly evolving. Here&apos;s what&apos;s dominating in {monthYear}:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Top-Tier Strategies</h3>
                        <p className="text-muted-foreground">
                          The most effective approaches in the current meta focus on synergy and efficiency. Players who understand team composition and timing consistently outperform those who rely on raw power alone.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Meta Shifts to Watch</h3>
                        <p className="text-muted-foreground">
                          With recent updates, certain strategies have become more or less viable. Stay informed about patch notes and community discussions to adapt quickly to meta shifts.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <section id="builds">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Star className="h-6 w-6 text-purple-500" />
                      Best Builds and Team Compositions
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Building an effective team is about more than just picking the strongest characters. Consider these factors when creating your builds:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Synergy Over Individual Power</h3>
                        <p className="text-muted-foreground">
                          A team of characters that work well together will outperform a team of individually strong characters with no synergy. Look for abilities that complement each other.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">Role Coverage</h3>
                        <p className="text-muted-foreground mb-3">Ensure your team covers essential roles:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Damage dealers</strong> - Your primary source of damage output</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Tanks/Defenders</strong> - Protect your team and control aggro</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Support/Healers</strong> - Keep your team alive and buffed</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                            <span><strong className="text-foreground">Utility</strong> - Provide crowd control and strategic advantages</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  
                  <section id="tactics">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                      <Target className="h-6 w-6 text-red-500" />
                      Advanced Tactics
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      These advanced tactics separate good players from great ones:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Resource Management</h3>
                        <p className="text-muted-foreground">
                          Know when to use powerful abilities and when to save them. Resource management is often the deciding factor in close matches.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Positioning and Timing</h3>
                        <p className="text-muted-foreground">
                          Perfect execution often comes down to positioning and timing. Practice until these become second nature.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Adaptation</h3>
                        <p className="text-muted-foreground">
                          The best players adapt their strategy based on the situation. Have multiple approaches ready and switch when needed.
                        </p>
                      </div>
                    </div>
                  </section>
                  
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">Get Free Resources for Your Builds</p>
                          <p className="text-sm text-muted-foreground">{activeCodes.length} codes available - free currency &amp; items</p>
                        </div>
                        <Button asChild>
                          <Link href={getSeoUrl(game.slug, 'free-rewards')}>
                            Claim Free Rewards <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
            </div>
          </PageContainer>
        </article>
        
        {/* FAQ Section */}
        <section id="faq" className="py-10 bg-muted/30 border-t border-border">
          <PageContainer>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <FAQSection
                faqs={getFaqsByType(game.name, pageType, activeCodes.length, monthYear)}
                gameName={game.name}
              />
            </div>
          </PageContainer>
        </section>
        
        {/* Internal Links */}
        <section className="py-10 border-t border-border">
          <PageContainer>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-foreground mb-6">More {game.name} Guides</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {BLOG_PAGE_TYPES.filter(type => type !== pageType).map((type) => {
                  const typeConfig = BLOG_CONFIG[type]
                  return (
                    <Link
                      key={type}
                      href={`/gaming-guides/${game.slug}-${type}`}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
                    >
                      <div className={typeConfig.color}>{typeConfig.icon}</div>
                      <span className="text-sm font-medium text-foreground">{typeConfig.title}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Promo Code Links */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-foreground mb-4">{game.name} Promo Codes</h4>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={getSeoUrl(game.slug, 'codes-today')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-sm font-medium text-primary transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    Codes Today
                  </Link>
                  <Link
                    href={getSeoUrl(game.slug, 'working-codes')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-sm font-medium text-emerald-600 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Working Codes
                  </Link>
                  <Link
                    href={getSeoUrl(game.slug, 'free-rewards')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-sm font-medium text-purple-600 transition-colors"
                  >
                    <Gift className="h-4 w-4" />
                    Free Rewards
                  </Link>
                </div>
              </div>
              
              {/* Related Games */}
              {relatedGames.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Similar Games</h4>
                  <div className="flex flex-wrap gap-3">
                    {relatedGames.map((relatedGame) => (
                      <Link
                        key={relatedGame.id}
                        href={`/gaming-guides/${relatedGame.slug}-${pageType}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                      >
                        {relatedGame.shortName || relatedGame.name} {config.title}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
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
        answer: `Yes, all promo codes for ${gameName} are completely free. They are released by the developers as gifts to players and can be redeemed for free gems, items, and other rewards.`
      },
      {
        question: `How often does ${gameName} release new promo codes?`,
        answer: `${gameName} typically releases new promo codes during updates, special events, holidays, and anniversaries. Check our codes page regularly for the latest codes.`
      },
      {
        question: `Do ${gameName} daily login rewards reset?`,
        answer: `Yes, daily login rewards reset each day. Make sure to log in daily to claim your rewards. Some games also have weekly and monthly cumulative login bonuses.`
      },
    ],
    'tips-and-tricks': [
      {
        question: `What are the best tips for ${gameName}?`,
        answer: `The best tips for ${gameName} include optimizing your daily routine, managing resources wisely, joining an active guild, and focusing on building a core team rather than spreading resources thin.`
      },
      {
        question: `Are there any secret tricks in ${gameName}?`,
        answer: `Yes, ${gameName} has several hidden features and tricks that can give you an advantage. These include animation canceling, optimal timing for certain actions, and hidden menus accessible through gestures.`
      },
      {
        question: `How do pros play ${gameName}?`,
        answer: `Pro players focus on efficiency, resource management, and staying updated with the meta. They complete daily activities religiously, save premium currency for the best value, and participate in every event.`
      },
    ],
    'beginner-guide': [
      {
        question: `How do I start playing ${gameName}?`,
        answer: `Start by completing the tutorial, claiming all free rewards and promo codes, linking your account, and focusing on the main story progression. Don't spread your resources too thin - focus on a core team.`
      },
      {
        question: `What mistakes should I avoid as a ${gameName} beginner?`,
        answer: `Common beginner mistakes include spending premium currency early, spreading resources across too many characters, ignoring daily activities, and not joining a guild. Save your premium currency for limited-time offers.`
      },
      {
        question: `Is ${gameName} free to play?`,
        answer: `Yes, ${gameName} is free to play. You can enjoy the full game without spending money. The free promo codes and daily rewards provide plenty of resources for free-to-play progression.`
      },
      {
        question: `How long does it take to get good at ${gameName}?`,
        answer: `With consistent daily play and following best practices, you can become competent within a few weeks and proficient within a month or two. Focus on learning core mechanics and building a strong foundation.`
      },
    ],
    'how-to-level-up-fast': [
      {
        question: `What is the fastest way to level up in ${gameName}?`,
        answer: `The fastest way to level up is through main story progression, event participation, and using XP boost items strategically. Never let your energy cap out, and complete daily missions every day.`
      },
      {
        question: `How can I get more XP in ${gameName}?`,
        answer: `Maximize XP by completing all daily and weekly missions, participating in events, using XP boost items during efficient farming sessions, and focusing on high-XP activities like main story content.`
      },
      {
        question: `Do ${gameName} promo codes give XP?`,
        answer: `Some promo codes include XP items or boosts as rewards. Check our codes page for current codes that offer XP-related rewards. Many codes also give resources that indirectly help you level faster.`
      },
    ],
    'best-strategies': [
      {
        question: `What is the best strategy for ${gameName}?`,
        answer: `The best strategy focuses on team synergy, proper role coverage, resource management, and adapting to different situations. Build a balanced team with damage dealers, tanks, and support characters.`
      },
      {
        question: `What is the current meta in ${gameName}?`,
        answer: `The meta in ${gameName} for ${monthYear} emphasizes synergy and efficiency over raw power. Stay updated with patch notes and community discussions to adapt to meta shifts.`
      },
      {
        question: `How do I build the best team in ${gameName}?`,
        answer: `Build the best team by focusing on character synergy rather than individual power. Ensure you have proper role coverage with damage dealers, tanks/defenders, support/healers, and utility characters.`
      },
    ],
  }
  
  return baseFaqs[pageType] || []
}
