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
  CheckCircle2,
  Gamepad2,
  Gift,
  ExternalLink,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Calendar,
  Zap,
  Star,
  Trophy,
  Users,
  BookOpen,
  Copy,
  Smartphone,
  Monitor,
  AlertCircle
} from "lucide-react"
import { 
  getGameBySlug,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getRelatedGames,
  getBestPromoCode,
  getPlayAffiliateUrl
} from "@/lib/gaming-data"
import type { GameReward } from "@/lib/gaming-data"
import { 
  parseSeoSlug, 
  parseBlogSlug,
  parseLowValueSlug,
  generateAllSeoSlugs, 
  generateAllBlogSlugs,
  getSeoUrl,
  getBlogUrl,
  shouldNoindex,
  type SeoPageType,
  type BlogPageType,
  type LowValuePageType,
  BLOG_PAGE_TYPES,
  LOW_VALUE_PAGE_TYPES
} from "@/lib/seo-routes"
import { PageTypeLinks, RelatedGamesLinks, PopularGamesLinks } from "@/components/gaming/cross-links"
import { BlogPageContent } from "@/components/gaming/blog-page-content"

export const revalidate = 600 // 10 minutes

export async function generateStaticParams() {
  // Generate both SEO (promo code) and blog page slugs
  return [...generateAllSeoSlugs(), ...generateAllBlogSlugs()]
}

interface PageProps {
  params: Promise<{ slug: string }>
}

// Blog page configuration
interface BlogPageConfig {
  title: string
  headingPrefix: string
  color: string
  keywords: string[]
}

const BLOG_CONFIG: Record<BlogPageType, BlogPageConfig> = {
  'how-to-get-free-rewards': {
    title: 'How to Get Free Rewards',
    headingPrefix: 'Free Rewards Guide',
    color: 'text-emerald-500',
    keywords: ['free rewards', 'free gems', 'free items', 'no cost'],
  },
  'tips-and-tricks': {
    title: 'Tips and Tricks',
    headingPrefix: 'Pro Tips',
    color: 'text-yellow-500',
    keywords: ['tips', 'tricks', 'secrets', 'hacks'],
  },
  'beginner-guide': {
    title: 'Beginner Guide',
    headingPrefix: 'Getting Started',
    color: 'text-blue-500',
    keywords: ['beginner', 'starter', 'new player', 'guide'],
  },
  'how-to-level-up-fast': {
    title: 'How to Level Up Fast',
    headingPrefix: 'Fast Leveling',
    color: 'text-purple-500',
    keywords: ['level up', 'fast', 'quick', 'XP'],
  },
  'best-strategies': {
    title: 'Best Strategies',
    headingPrefix: 'Top Strategies',
    color: 'text-amber-500',
    keywords: ['strategy', 'meta', 'best', 'optimal'],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  // Try parsing as SEO page first, then blog page
  const seoParsed = parseSeoSlug(slug)
  const blogParsed = parseBlogSlug(slug)
  
  if (!seoParsed && !blogParsed) {
    return { title: "Page Not Found | SaveSmart" }
  }
  
  const gameSlug = seoParsed?.gameSlug || blogParsed?.gameSlug
  const game = getGameBySlug(gameSlug!)
  if (!game) {
    return { title: "Game Not Found | SaveSmart Gaming" }
  }
  
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const shortMonth = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  
  // Handle blog pages
  if (blogParsed) {
    const config = BLOG_CONFIG[blogParsed.pageType]
    
    const titleByType: Record<BlogPageType, string> = {
      'how-to-get-free-rewards': `${game.shortName || game.name} Free Rewards Guide (${shortMonth}) – Pro Guide`,
      'tips-and-tricks': `${game.shortName || game.name} Tips & Tricks (${shortMonth}) – Pro Guide`,
      'beginner-guide': `${game.shortName || game.name} Beginner Guide (${shortMonth}) – Start Strong`,
      'how-to-level-up-fast': `${game.shortName || game.name} Level Up Fast (${shortMonth}) – XP Guide`,
      'best-strategies': `${game.shortName || game.name} Best Strategies (${shortMonth}) – Win More`,
    }
    
    const descriptionByType: Record<BlogPageType, string> = {
      'how-to-get-free-rewards': `Complete guide to get free rewards in ${game.name}. Learn how to earn free gems, items, and bonuses without spending money. Updated ${monthYear}.`,
      'tips-and-tricks': `Master ${game.name} with our expert tips and tricks. Pro secrets, hidden features, and advanced techniques. Updated ${monthYear}.`,
      'beginner-guide': `New to ${game.name}? Our beginner guide covers everything you need to know to start strong. Tips, strategies, and mistakes to avoid. Updated ${monthYear}.`,
      'how-to-level-up-fast': `Level up quickly in ${game.name} with our fast XP guide. Best methods, shortcuts, and pro strategies for rapid progression. Updated ${monthYear}.`,
      'best-strategies': `Dominate ${game.name} with the best strategies and meta builds. Win more matches with proven tactics. Updated ${monthYear}.`,
    }
    
    return {
      title: titleByType[blogParsed.pageType],
      description: descriptionByType[blogParsed.pageType],
      keywords: [
        `${game.name} ${config.title.toLowerCase()}`,
        ...config.keywords.map(k => `${game.name} ${k}`),
        `${game.name} guide`,
        `${game.name} ${monthYear}`,
      ],
      openGraph: {
        title: titleByType[blogParsed.pageType],
        description: descriptionByType[blogParsed.pageType],
        type: 'article',
        publishedTime: game.lastUpdated,
        modifiedTime: new Date().toISOString(),
      },
      alternates: {
        canonical: `https://savesmart.bio/${slug}`,
      },
      // NOINDEX blog pages - thin content / index bloat
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    }
  }
  
  // Handle SEO (promo code) pages
  const { pageType } = seoParsed!
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const rewardCount = game.rewards.length
  
  // Get primary reward type for game-specific benefits
  const primaryReward = game.promoCodes[0]?.rewardType || 'Rewards'
  const rewardBenefits: Record<string, string> = {
    'Primogems': 'Free Primogems',
    'Gems': 'Free Gems',
    'V-Bucks': 'Free V-Bucks',
    'Robux': 'Free Robux',
    'Coins': 'Free Coins',
    'Skins': 'Free Skins',
    'Currency': 'Free Currency',
    'CP': 'Free CP',
    'Items': 'Free Items',
    'Packs': 'Free Packs',
    'Characters': 'Free Characters',
    'XP': 'Free XP',
    'Other': 'Free Rewards',
    'Rewards': 'Free Rewards',
  }
  const benefit = rewardBenefits[primaryReward] || 'Free Rewards'
  
  const metaByType: Record<SeoPageType, { title: string; description: string; keywords: string[] }> = {
    // PRIMARY page type - targets "[game] codes" searches (highest volume)
    'codes': {
      title: `${game.shortName || game.name} Codes (${shortMonth}) – ${codeCount}+ FREE ${benefit}`,
      description: `All ${codeCount}+ working ${game.name} promo codes for ${monthYear}. Get FREE gems, skins, items & exclusive rewards. Verified and updated daily!`,
      keywords: [
        `${game.name} codes`,
        `${game.name} promo codes`,
        `${game.name} codes ${monthYear.toLowerCase()}`,
        `${game.name} redeem codes`,
        `free ${game.name} codes`,
      ],
    },
    'redeem-codes': {
      // Target: "how to redeem [game] codes" - guide + working codes
      title: `How to Redeem ${game.shortName || game.name} Codes – ${codeCount}+ Working (${shortMonth})`,
      description: `Complete guide to redeem ${game.name} promo codes. Step-by-step instructions for all platforms. ${codeCount}+ working codes inside!`,
      keywords: [
        `how to redeem ${game.name} codes`,
        `${game.name} redeem codes`,
        `${game.name} code redemption`,
        `${game.name} redeem guide`,
      ],
    },
  }
  
  const meta = metaByType[seoParsed!.pageType]
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://savesmart.bio/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/${slug}`,
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

// Helper components for free-rewards page
function getRewardIcon(type: GameReward['type']) {
  switch (type) {
    case 'Daily': return Calendar
    case 'New Player': return Zap
    case 'Event': return Star
    case 'Achievement': return Trophy
    case 'Referral': return Users
    case 'Free':
    default: return Gift
  }
}

function getRewardColor(type: GameReward['type']): string {
  switch (type) {
    case 'Daily': return 'bg-blue-500/10 text-blue-600 border-blue-500/30'
    case 'New Player': return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
    case 'Event': return 'bg-pink-500/10 text-pink-600 border-pink-500/30'
    case 'Achievement': return 'bg-green-500/10 text-green-600 border-green-500/30'
    case 'Referral': return 'bg-purple-500/10 text-purple-600 border-purple-500/30'
    case 'Free':
    default: return 'bg-secondary/10 text-secondary border-secondary/30'
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
              <h3 className="font-semibold text-foreground truncate">{reward.title}</h3>
              <Badge variant="outline" className={`${colorClass} shrink-0`}>{reward.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{reward.description}</p>
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

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params
  
  // Try parsing as SEO page first, then low-value page, then blog page
  const seoParsed = parseSeoSlug(slug)
  const lowValueParsed = parseLowValueSlug(slug)
  const blogParsed = parseBlogSlug(slug)
  
  if (!seoParsed && !lowValueParsed && !blogParsed) {
    notFound()
  }
  
  const gameSlug = seoParsed?.gameSlug || lowValueParsed?.gameSlug || blogParsed?.gameSlug
  const game = getGameBySlug(gameSlug!)
  if (!game) {
    notFound()
  }
  
  // Handle low-value pages - redirect to main codes page via 301
  // These pages cause index bloat and thin content issues
  if (lowValueParsed) {
    const { redirect } = await import('next/navigation')
    redirect(`/${game.slug}-codes`)
  }
  
  // Handle blog pages (noindexed but still accessible)
  if (blogParsed) {
    return <BlogPageContent game={game} pageType={blogParsed.pageType} slug={slug} />
  }
  
  const { pageType } = seoParsed!
  
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const verifiedCodes = activeCodes.filter(code => code.isVerified)
  const bestCode = getBestPromoCode(game.promoCodes)
  const relatedGames = getRelatedGames(game, 6)
  
  // Calculate values
  const totalRewardValue = activeCodes.reduce((sum, code) => sum + (code.rewardValue || 0), 0)
  
  // Filter codes by recency for new-codes page
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const newThisWeek = activeCodes.filter(code => new Date(code.addedAt) >= oneWeekAgo)
  const newThisMonth = activeCodes.filter(code => 
    new Date(code.addedAt) >= oneMonthAgo && new Date(code.addedAt) < oneWeekAgo
  )
  const olderCodes = activeCodes.filter(code => new Date(code.addedAt) < oneMonthAgo)
  
  // Group rewards by type for free-rewards page
  const rewardsByType = {
    daily: game.rewards.filter(r => r.type === 'Daily'),
    free: game.rewards.filter(r => r.type === 'Free'),
    newPlayer: game.rewards.filter(r => r.type === 'New Player'),
    event: game.rewards.filter(r => r.type === 'Event'),
    achievement: game.rewards.filter(r => r.type === 'Achievement'),
    referral: game.rewards.filter(r => r.type === 'Referral'),
  }
  
  // Platform detection for redeem-codes
  const hasMobile = game.platforms.some(p => ['Mobile', 'iOS', 'Android'].includes(p))
  const hasPC = game.platforms.some(p => ['PC', 'Windows', 'Mac'].includes(p))
  const hasConsole = game.platforms.some(p => ['PlayStation', 'Xbox', 'Nintendo Switch', 'Console'].includes(p))
  
  // Page configuration by type (only high-value pages)
  const pageConfig: Record<SeoPageType, {
    heroGradient: string
    icon: typeof Tag
    badge: string
    headingPrefix: string
  }> = {
    'codes': {
      heroGradient: 'from-green-600 to-emerald-700',
      icon: Tag,
      badge: 'All Codes',
      headingPrefix: 'Promo Codes',
    },
    'redeem-codes': {
      heroGradient: 'from-emerald-600 to-teal-700',
      icon: BookOpen,
      badge: 'Step-by-Step Guide',
      headingPrefix: 'How to Redeem Codes',
    },
  }
  
  const config = pageConfig[pageType]
  const HeroIcon = config.icon
  
  // FAQs by page type
  const getFaqs = () => {
    switch (pageType) {
      case 'working-codes':
        return [
          {
            question: `How do you verify ${game.name} codes are working?`,
            answer: `Our team tests every ${game.name} code directly in the game before adding it to our list. We check codes multiple times daily and immediately remove any that stop working.`,
          },
          {
            question: `Why might a code show as working but not work for me?`,
            answer: `You may have already redeemed the code, the code may be region-restricted, some codes are only for new players, or the code may have just expired.`,
          },
          {
            question: `How often do you update the ${game.name} working codes list?`,
            answer: `We update our ${game.name} codes list multiple times per day. Our automated system checks code validity every 10 minutes.`,
          },
        ]
      case 'new-codes':
        return [
          {
            question: `When does ${game.name} release new codes?`,
            answer: `${game.name} typically releases new promo codes during game updates, special events, holidays, livestreams, and milestone celebrations.`,
          },
          {
            question: `How can I be first to know about new ${game.name} codes?`,
            answer: `Bookmark this page and check back regularly! We update our ${game.name} codes list within minutes of new codes being released.`,
          },
          {
            question: `Do new ${game.name} codes expire quickly?`,
            answer: `Some new ${game.name} codes have short expiration windows, especially event codes. We recommend redeeming new codes as soon as you see them.`,
          },
        ]
      case 'free-rewards':
        return [
          {
            question: `How do I get free rewards in ${game.name}?`,
            answer: `Redeem promo codes, log in daily for login rewards, complete achievements, participate in events, and refer friends.`,
          },
          {
            question: `Are ${game.name} promo codes really free?`,
            answer: `Yes! All ${game.name} promo codes listed on SaveSmart are 100% free to use. Simply copy the code and redeem it in-game.`,
          },
          {
            question: `Do I need to spend money to get ${game.name} rewards?`,
            answer: `No! You can earn substantial rewards completely free through promo codes, daily logins, achievements, and events.`,
          },
        ]
      case 'redeem-codes':
        return [
          {
            question: `Where do I enter ${game.name} promo codes?`,
            answer: `In ${game.name}, you can redeem codes through the in-game settings menu or the official redemption website. Look for a "Redeem Code" or "Gift Code" option.`,
          },
          {
            question: `Why isn't my ${game.name} code working?`,
            answer: `The code may have expired, reached its redemption limit, you've already redeemed it, it's region-restricted, or you entered it incorrectly.`,
          },
          {
            question: `Can I use ${game.name} codes on multiple accounts?`,
            answer: `Most codes can only be redeemed once per account. However, you can use the same code on different accounts.`,
          },
        ]
      default:
        return [
          {
            question: `How often are ${game.name} codes updated?`,
            answer: `We update our ${game.name} codes list multiple times per day to ensure you always have access to the latest working codes.`,
          },
          {
            question: `Are all ${game.name} codes free?`,
            answer: `Yes! All promo codes listed on SaveSmart are 100% free to use. Simply copy and redeem in-game.`,
          },
        ]
    }
  }
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": pageType === 'redeem-codes' ? "HowTo" : "ItemList",
    name: `${game.name} ${config.headingPrefix} ${monthYear}`,
    description: `${config.headingPrefix} for ${game.name} - ${monthYear}`,
    numberOfItems: activeCodes.length,
    dateModified: today.toISOString(),
    ...(pageType !== 'redeem-codes' && {
      itemListElement: activeCodes.slice(0, 20).map((code, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: code.code,
          description: code.reward,
        }
      }))
    }),
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${config.heroGradient} text-white py-12 md:py-16 overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <div className="relative z-10 mb-6">
            <BreadcrumbNav 
              items={generateGamingBreadcrumbs(game.slug, game.shortName || game.name, pageType)}
              className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-0">
              <HeroIcon className="h-3 w-3 mr-1" />
              {config.badge}
            </Badge>
            {pageType === 'working-codes' && (
              <Badge className="bg-emerald-400/20 text-emerald-100 border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {verifiedCodes.length} Tested Today
              </Badge>
            )}
            {pageType === 'new-codes' && (
              <Badge className="bg-amber-300/20 text-amber-100 border-0">
                <Zap className="h-3 w-3 mr-1" />
                {newThisWeek.length} Added This Week
              </Badge>
            )}
            {pageType === 'free-rewards' && (
              <Badge className="bg-pink-300/20 text-pink-100 border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {activeCodes.length + game.rewards.length}+ Rewards
              </Badge>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Updated {timeStr}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {game.name} {config.headingPrefix} ({monthYear})
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            {pageType === 'codes-today' && `All working ${game.name} promo codes for ${dateStr}. We check and verify codes every hour.`}
            {pageType === 'working-codes' && `Every code on this page has been verified and tested by our team. We check ${game.name} codes multiple times daily.`}
            {pageType === 'new-codes' && `The latest ${game.name} promo codes released this month. We update this list daily so you never miss a new code.`}
            {pageType === 'free-rewards' && `Every way to get free rewards in ${game.name}! All working promo codes, daily bonuses, and free items.`}
            {pageType === 'redeem-codes' && `Complete guide to redeeming ${game.name} promo codes on ${game.platforms.join(', ')}.`}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Tag className="h-5 w-5" />
              <div>
                <p className="text-xs text-white/70">Active Codes</p>
                <p className="text-lg font-bold">{activeCodes.length}</p>
              </div>
            </div>
            {pageType === 'working-codes' && (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-white/70">Verified</p>
                    <p className="text-lg font-bold">{verifiedCodes.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-white/70">Total Value</p>
                    <p className="text-lg font-bold">{totalRewardValue.toLocaleString()}+</p>
                  </div>
                </div>
              </>
            )}
            {pageType === 'free-rewards' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
                <Gift className="h-5 w-5" />
                <div>
                  <p className="text-xs text-white/70">Bonus Rewards</p>
                  <p className="text-lg font-bold">{game.rewards.length}</p>
                </div>
              </div>
            )}
          </div>
          
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <a href={getPlayAffiliateUrl(game)} target="_blank" rel="nofollow sponsored noopener">
              <Gamepad2 className="h-5 w-5" />
              Play {game.shortName || game.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </PageContainer>
      </section>
      
      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {pageType === 'redeem-codes' ? 'Best Code to Try Now' : 'Best Code Right Now'}
              </p>
              <PromoCodeCard code={bestCode} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* Codes Section - varies by page type */}
      {pageType === 'new-codes' ? (
        <>
          {/* New This Week */}
          {newThisWeek.length > 0 && (
            <section className="py-10 md:py-12">
              <PageContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">New This Week ({newThisWeek.length})</h2>
                    <p className="text-sm text-muted-foreground">Fresh codes added in the last 7 days</p>
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {newThisWeek.map((code) => (
                    <PromoCodeCard key={code.id} code={code} />
                  ))}
                </div>
              </PageContainer>
            </section>
          )}
          
          {/* Earlier This Month */}
          {newThisMonth.length > 0 && (
            <section className="py-10 md:py-12 bg-muted/30">
              <PageContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Earlier This Month ({newThisMonth.length})</h2>
                    <p className="text-sm text-muted-foreground">Codes added 1-4 weeks ago - still working!</p>
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {newThisMonth.map((code) => (
                    <PromoCodeCard key={code.id} code={code} />
                  ))}
                </div>
              </PageContainer>
            </section>
          )}
          
          {/* Older Active Codes */}
          {olderCodes.length > 0 && (
            <section className="py-10 md:py-12">
              <PageContainer>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Still Working ({olderCodes.length})</h2>
                    <p className="text-sm text-muted-foreground">Older codes that are still active</p>
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {olderCodes.map((code) => (
                    <PromoCodeCard key={code.id} code={code} />
                  ))}
                </div>
              </PageContainer>
            </section>
          )}
        </>
      ) : pageType === 'free-rewards' ? (
        <>
          {/* Free Promo Codes */}
          <section className="py-10 md:py-12">
            <PageContainer>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Free Promo Codes ({activeCodes.length})</h2>
                  <p className="text-sm text-muted-foreground">Redeem these codes for instant free rewards</p>
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
                    <h3 className="text-lg font-semibold text-foreground mb-2">No promo codes available</h3>
                    <p className="text-sm text-muted-foreground">Check back soon for new codes!</p>
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
        </>
      ) : pageType === 'redeem-codes' ? (
        /* Redeem Guide Step-by-Step */
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Step-by-Step: How to Redeem {game.name} Codes</h2>
                  <p className="text-sm text-muted-foreground">Follow these 5 simple steps to claim your free rewards</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Copy className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold text-foreground text-lg">Copy the Code</h3>
                        </div>
                        <p className="text-muted-foreground">
                          Browse our list of working {game.name} codes below. Click on any code to automatically copy it to your clipboard.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Step 2 */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gamepad2 className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold text-foreground text-lg">Open {game.shortName || game.name}</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Launch {game.name} on your device and make sure you&apos;re logged into the correct account.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {hasMobile && <Badge variant="outline" className="gap-1"><Smartphone className="h-3 w-3" />Mobile</Badge>}
                          {hasPC && <Badge variant="outline" className="gap-1"><Monitor className="h-3 w-3" />PC</Badge>}
                          {hasConsole && <Badge variant="outline" className="gap-1"><Gamepad2 className="h-3 w-3" />Console</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Step 3 */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold text-foreground text-lg">Find the Redemption Section</h3>
                        </div>
                        <p className="text-muted-foreground mb-3">Navigate to the code redemption area:</p>
                        <ul className="text-muted-foreground space-y-1 list-disc list-inside text-sm">
                          <li>Settings Menu → Redeem Code</li>
                          <li>Profile → Gift Code</li>
                          <li>Official website redemption page</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Step 4 */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 bg-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">4</span>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold text-foreground text-lg">Paste and Redeem</h3>
                        </div>
                        <p className="text-muted-foreground">
                          Paste the code into the redemption field exactly as copied. Tap &quot;Confirm&quot; or &quot;Redeem&quot; to claim your rewards.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Step 5 */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-shrink-0 w-16 bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-foreground text-lg">Collect Your Rewards!</h3>
                        </div>
                        <p className="text-muted-foreground">
                          Your rewards will be sent to your in-game mailbox or added directly to your inventory.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tips Box */}
              <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Important Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Codes are <strong>case-sensitive</strong> - enter them exactly as shown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Each code can only be redeemed <strong>once per account</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>Some codes <strong>expire quickly</strong> - redeem as soon as possible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      ) : (
        /* Default codes list for codes-today and working-codes */
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {pageType === 'codes-today' ? `All Codes for Today (${activeCodes.length})` : `All Working Codes (${activeCodes.length})`}
                </h2>
                <p className="text-sm text-muted-foreground">Verified and tested as of {dateStr}</p>
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
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No working codes available right now</h3>
                  <p className="text-muted-foreground mb-4">Check back soon - we update codes every 10 minutes!</p>
                  <Button asChild>
                    <Link href={`/gaming/${game.slug}`}>View All {game.name} Content</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </PageContainer>
        </section>
      )}
      
      {/* All Codes Section for redeem-codes page */}
      {pageType === 'redeem-codes' && activeCodes.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Working Codes ({activeCodes.length})</h2>
                <p className="text-sm text-muted-foreground">Copy any code and follow the steps above</p>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          </PageContainer>
        </section>
      )}
      
      {/* FAQ Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <FAQSection 
            faqs={getFaqs()}
            title={`${game.name} ${config.headingPrefix} FAQ`}
          />
        </PageContainer>
      </section>
      
      {/* Cross-links to other page types for same game */}
      <PageTypeLinks game={game} currentPageType={pageType} />
      
      {/* Related games with same page type */}
      <RelatedGamesLinks currentGame={game} pageType={pageType} limit={8} />
      
      {/* Popular games section */}
      <PopularGamesLinks currentGame={game} limit={12} />
      
      <Footer />
    </div>
  )
}
