/**
 * Trending Games Section for SEO
 * Shows popular games with internal links to boost crawlability
 */

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Flame, Gamepad2, Gift, ArrowRight, Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  getPopularGames, 
  getActivePromoCodes,
  getGameLogoUrl,
  type Game 
} from "@/lib/gaming-data"

interface TrendingGamesSectionProps {
  currentGameSlug?: string
  limit?: number
  className?: string
  variant?: 'default' | 'compact' | 'sidebar'
  title?: string
}

/**
 * Trending Games Section - Shows most popular games
 */
export function TrendingGamesSection({
  currentGameSlug,
  limit = 8,
  className,
  variant = 'default',
  title = "Trending Games",
}: TrendingGamesSectionProps) {
  // Get popular games, excluding current game if provided
  const popularGames = getPopularGames(limit + 1)
    .filter(game => game.slug !== currentGameSlug)
    .slice(0, limit)

  if (variant === 'compact') {
    return (
      <section className={cn("py-6 border-t border-border", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            {title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularGames.map((game) => {
              const codeCount = getActivePromoCodes(game.promoCodes).length
              return (
                <Link
                  key={game.slug}
                  href={`/gaming/${game.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {game.logoUrl ? (
                    <Image
                      src={getGameLogoUrl(game)}
                      alt={game.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  ) : (
                    <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {game.shortName || game.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {codeCount}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn("space-y-3", className)}>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-orange-500" />
          {title}
        </h3>
        <div className="space-y-2">
          {popularGames.slice(0, 5).map((game) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            return (
              <Link
                key={game.slug}
                href={`/gaming/${game.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
              >
                {game.logoUrl ? (
                  <Image
                    src={getGameLogoUrl(game)}
                    alt={game.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {game.shortName || game.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {codeCount} codes
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <Link
          href="/gaming"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all games
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    )
  }

  // Default variant - full grid layout
  return (
    <section className={cn("py-10 md:py-12 border-t border-border", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            {title}
          </h2>
          <Link
            href="/gaming"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            All Games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popularGames.map((game, index) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            const isTopGame = index < 3

            return (
              <Link
                key={game.slug}
                href={`/gaming/${game.slug}`}
                className={cn(
                  "group relative flex flex-col items-center gap-3 p-4 rounded-xl border bg-card transition-all hover:shadow-lg",
                  isTopGame
                    ? "border-orange-500/30 hover:border-orange-500"
                    : "border-border hover:border-primary"
                )}
              >
                {/* Trending Badge for Top 3 */}
                {isTopGame && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-orange-500 text-white text-[10px] px-1.5">
                      <Flame className="h-3 w-3 mr-0.5" />
                      HOT
                    </Badge>
                  </div>
                )}

                {/* Game Logo */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  {game.logoUrl ? (
                    <Image
                      src={getGameLogoUrl(game)}
                      alt={game.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <Gamepad2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                {/* Game Info */}
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {game.shortName || game.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      {codeCount} codes
                    </Badge>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * New Codes Today Section - Shows recently added codes
 */
interface NewCodesTodaySectionProps {
  className?: string
  limit?: number
}

export function NewCodesTodaySection({
  className,
  limit = 6,
}: NewCodesTodaySectionProps) {
  // Get games with recently updated codes
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const gamesWithNewCodes = getPopularGames(20)
    .map(game => {
      const newCodes = game.promoCodes.filter(code => {
        const addedAt = new Date(code.addedAt)
        return addedAt >= oneDayAgo
      })
      return { game, newCodesCount: newCodes.length }
    })
    .filter(item => item.newCodesCount > 0)
    .sort((a, b) => b.newCodesCount - a.newCodesCount)
    .slice(0, limit)

  if (gamesWithNewCodes.length === 0) {
    // Fallback to showing popular games with most codes
    const popularWithCodes = getPopularGames(limit)
      .map(game => ({
        game,
        newCodesCount: getActivePromoCodes(game.promoCodes).length
      }))

    return (
      <section className={cn("py-8 border-t border-border bg-emerald-500/5", className)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            Active Codes Today
          </h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {popularWithCodes.map(({ game, newCodesCount }) => (
              <Link
                key={game.slug}
                href={`/gaming/${game.slug}/codes-today`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
              >
                {game.logoUrl ? (
                  <Image
                    src={getGameLogoUrl(game)}
                    alt={game.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                ) : (
                  <Gamepad2 className="h-6 w-6 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {game.shortName || game.name}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {newCodesCount} codes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-8 border-t border-border bg-emerald-500/5", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-emerald-500" />
          New Codes Today
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {gamesWithNewCodes.map(({ game, newCodesCount }) => (
            <Link
              key={game.slug}
              href={`/gaming/${game.slug}/codes-today`}
              className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/30 bg-card hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors"
            >
              {game.logoUrl ? (
                <Image
                  src={getGameLogoUrl(game)}
                  alt={game.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
              ) : (
                <Gamepad2 className="h-6 w-6 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {game.shortName || game.name}
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  +{newCodesCount} new today
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * All Games Directory Section - For sitemap/SEO
 */
export function AllGamesDirectorySection({
  className,
}: {
  className?: string
}) {
  const allGames = getPopularGames(100) // Get all games sorted by popularity

  return (
    <section className={cn("py-10 md:py-12 border-t border-border", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            All Game Codes Directory
          </h2>
          <p className="text-muted-foreground">
            Browse promo codes for {allGames.length}+ games
          </p>
        </div>

        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {allGames.map((game) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            return (
              <Link
                key={game.slug}
                href={`/gaming/${game.slug}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Gamepad2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {game.shortName || game.name}
                </span>
                {codeCount > 0 && (
                  <Badge variant="outline" className="text-[10px] ml-auto shrink-0">
                    {codeCount}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/gaming/all-games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            View Full Games Directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
