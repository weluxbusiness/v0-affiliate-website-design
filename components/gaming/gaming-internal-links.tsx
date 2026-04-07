import Link from "next/link"
import Image from "next/image"
import { 
  Gamepad2, 
  Tag, 
  Gift, 
  Zap, 
  ArrowRight,
  Calendar,
  Flame,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Game, GameCategory } from "@/lib/gaming-data"
import { getGameLogoUrl, getPlayAffiliateUrl } from "@/lib/gaming-data"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play } from "lucide-react"

// ============================================
// GAMING INTERNAL LINKS COMPONENT
// ============================================

interface GamingInternalLinksProps {
  type: 'games' | 'categories' | 'rewards' | 'mixed'
  currentSlug?: string
  title?: string
  items: { slug: string; label: string; count?: number }[]
  maxItems?: number
}

export function GamingInternalLinks({ 
  type, 
  currentSlug, 
  title, 
  items, 
  maxItems = 12 
}: GamingInternalLinksProps) {
  const filteredItems = items
    .filter(item => item.slug !== currentSlug)
    .slice(0, maxItems)
  
  if (filteredItems.length === 0) return null

  const getLink = (slug: string) => {
    switch (type) {
      case 'games':
        return `/gaming/${slug}`
      case 'categories':
        return `/gaming?category=${slug}`
      case 'rewards':
        return `/gaming/${slug}/rewards`
      default:
        return `/gaming/${slug}`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'games':
        return <Gamepad2 className="h-4 w-4" />
      case 'categories':
        return <Tag className="h-4 w-4" />
      case 'rewards':
        return <Gift className="h-4 w-4" />
      default:
        return <ArrowRight className="h-4 w-4" />
    }
  }

  const defaultTitle = type === 'games' 
    ? 'More Games with Codes' 
    : type === 'categories' 
    ? 'Browse by Category' 
    : 'More Rewards'

  return (
    <section className="py-10 md:py-12 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {title || defaultTitle}
        </h2>
        <div className="flex flex-wrap gap-3">
          {filteredItems.map((item) => (
            <Link
              key={item.slug}
              href={getLink(item.slug)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
            >
              {getIcon()}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({item.count})
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// GAMING CROSS LINKS COMPONENT
// ============================================

interface GamingCrossLinksProps {
  currentGame: Game
  relatedGames: Game[]
  categoryGames: Game[]
}

export function GamingCrossLinks({
  currentGame,
  relatedGames,
  categoryGames,
}: GamingCrossLinksProps) {
  const category = currentGame.categories[0]

  return (
    <div className="py-10 md:py-12 border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Related Games */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Similar {category} Games
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedGames
                .filter(g => g.id !== currentGame.id)
                .slice(0, 8)
                .map(game => (
                  <Link
                    key={game.id}
                    href={`/gaming/${game.slug}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
                  >
                    {game.shortName || game.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Codes for this game */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              {currentGame.shortName || currentGame.name} Pages
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/gaming/${currentGame.slug}/codes`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
              >
                All Codes
              </Link>
              <Link
                href={`/gaming/${currentGame.slug}/rewards`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
              >
                Free Rewards
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              href="/gaming/promo-codes"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Tag className="h-4 w-4" />
              All Gaming Promo Codes
            </Link>
            <Link 
              href="/gaming/free-rewards"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Gift className="h-4 w-4" />
              Free Gaming Rewards
            </Link>
            <Link 
              href="/gaming/new-player-deals"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Zap className="h-4 w-4" />
              New Player Deals
            </Link>
            <Link 
              href="/gaming/today"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              Today&apos;s Codes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// GAMING CATEGORY FILTER
// ============================================

interface CategoryFilterProps {
  categories: GameCategory[]
  selectedCategory?: GameCategory
  basePath?: string
}

export function GamingCategoryFilter({
  categories,
  selectedCategory,
  basePath = '/gaming'
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={basePath}
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80 text-foreground'
        }`}
      >
        All Games
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`${basePath}?category=${category.toLowerCase()}`}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  )
}

// ============================================
// GAME CARD COMPACT - With Logo
// ============================================

interface GameCardCompactProps {
  game: Game
  codeCount: number
  showBadge?: boolean
}

export function GameCardCompact({ game, codeCount, showBadge = false }: GameCardCompactProps) {
  const logoUrl = getGameLogoUrl(game)
  const hasLogo = game.logoUrl
  const affiliateUrl = getPlayAffiliateUrl(game)

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-muted/50 hover:shadow-md transition-all duration-200 group">
      {/* Game Logo - Links to game page */}
      <Link href={`/gaming/${game.slug}`} className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden ring-1 ring-border/50 bg-muted/50 shadow-sm hover:ring-primary/50 transition-all">
        {hasLogo ? (
          <Image
            src={logoUrl}
            alt={game.name}
            width={48}
            height={48}
            className="rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
        )}
      </Link>

      {/* Game Info - Links to game page */}
      <Link href={`/gaming/${game.slug}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {game.shortName || game.name}
          </h3>
          {showBadge && codeCount > 3 && (
            <Badge variant="secondary" className="text-xs shrink-0">
              <Flame className="h-3 w-3 mr-1 text-orange-500" />
              Hot
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {codeCount} codes
          </span>
          <span className="text-border">|</span>
          <span>{game.categories[0]}</span>
        </div>
      </Link>

      {/* Play Now CTA - Falconix affiliate network */}
      {affiliateUrl && (
        <Button 
          asChild 
          size="sm"
          className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <a 
            href={affiliateUrl} 
            target="_blank"
            rel="nofollow sponsored noopener"
          >
            <Play className="h-4 w-4 mr-1 fill-current" />
            Play
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      )}
    </div>
  )
}

// ============================================
// TRENDING CODE ITEM - With Logo
// ============================================

interface TrendingCodeItemProps {
  game: Game
  code: string
  reward: string
  isVerified: boolean
}

export function TrendingCodeItem({ game, code, reward, isVerified }: TrendingCodeItemProps) {
  const logoUrl = getGameLogoUrl(game)
  const hasLogo = game.logoUrl
  const affiliateUrl = getPlayAffiliateUrl(game)

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-green-500/30 hover:shadow-md transition-all duration-200 group">
      {/* Game Logo - Links to game page */}
      <Link href={`/gaming/${game.slug}`} className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden ring-1 ring-border/50 bg-muted/50 shadow-sm hover:ring-primary/50 transition-all">
        {hasLogo ? (
          <Image
            src={logoUrl}
            alt={game.name}
            width={40}
            height={40}
            className="rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            <Gamepad2 className="h-5 w-5 text-primary" />
          </div>
        )}
      </Link>

      {/* Code Info - Links to game page */}
      <Link href={`/gaming/${game.slug}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <code className="font-mono font-semibold text-primary text-sm">
            {code}
          </code>
          {isVerified && (
            <Badge variant="outline" className="text-xs text-secondary border-secondary/50">
              <Star className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium text-foreground truncate">{reward}</p>
        <p className="text-xs text-muted-foreground mt-1">{game.shortName || game.name}</p>
      </Link>

      {/* Play Now CTA - Falconix affiliate network */}
      {affiliateUrl && (
        <Button 
          asChild 
          size="sm"
          className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <a 
            href={affiliateUrl} 
            target="_blank"
            rel="nofollow sponsored noopener"
          >
            <Play className="h-4 w-4 mr-1 fill-current" />
            Play
          </a>
        </Button>
      )}
    </div>
  )
}
