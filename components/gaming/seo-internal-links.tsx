import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Calendar, 
  ChevronRight,
  Flame,
  Star,
  TrendingUp
} from "lucide-react"

// Top 10 Popular Games for internal linking
const POPULAR_GAMES = [
  { slug: 'raid-shadow-legends', name: 'RAID', codes: 15 },
  { slug: 'genshin-impact', name: 'Genshin Impact', codes: 12 },
  { slug: 'honkai-star-rail', name: 'Honkai Star Rail', codes: 10 },
  { slug: 'fortnite', name: 'Fortnite', codes: 8 },
  { slug: 'roblox', name: 'Roblox', codes: 25 },
  { slug: 'call-of-duty-mobile', name: 'COD Mobile', codes: 6 },
  { slug: 'clash-of-clans', name: 'Clash of Clans', codes: 5 },
  { slug: 'pokemon-go', name: 'Pokemon GO', codes: 8 },
  { slug: 'apex-legends', name: 'Apex Legends', codes: 4 },
  { slug: 'valorant', name: 'VALORANT', codes: 3 },
]

// Available months for navigation
const AVAILABLE_MONTHS = [
  { slug: 'april-2026', label: 'April 2026' },
  { slug: 'may-2026', label: 'May 2026' },
  { slug: 'june-2026', label: 'June 2026' },
  { slug: 'july-2026', label: 'July 2026' },
  { slug: 'august-2026', label: 'August 2026' },
  { slug: 'september-2026', label: 'September 2026' },
  { slug: 'october-2026', label: 'October 2026' },
  { slug: 'november-2026', label: 'November 2026' },
  { slug: 'december-2026', label: 'December 2026' },
]

interface SEOInternalLinksProps {
  currentGameSlug?: string
  currentMonth?: string
  showPopularGames?: boolean
  showLatestCodes?: boolean
  showMonthlyNav?: boolean
  variant?: 'full' | 'compact'
}

export function SEOInternalLinks({
  currentGameSlug,
  currentMonth,
  showPopularGames = true,
  showLatestCodes = true,
  showMonthlyNav = true,
  variant = 'full'
}: SEOInternalLinksProps) {
  // Filter out current game from popular games
  const popularGames = POPULAR_GAMES.filter(g => g.slug !== currentGameSlug)
  
  // Filter out current month from navigation
  const otherMonths = AVAILABLE_MONTHS.filter(m => m.slug !== currentMonth)

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {/* Compact Popular Games */}
        {showPopularGames && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Popular:</span>
            {popularGames.slice(0, 6).map((game) => (
              <Link 
                key={game.slug}
                href={`/gaming/${game.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {game.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="py-8 bg-muted/30 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Popular Games Section */}
          {showPopularGames && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Popular Games
              </h3>
              <div className="space-y-2">
                {popularGames.slice(0, 10).map((game) => (
                  <Link 
                    key={game.slug}
                    href={`/gaming/${game.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {game.name} Codes
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {game.codes}+
                    </Badge>
                  </Link>
                ))}
              </div>
              <Link 
                href="/gaming/all-games"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
              >
                View all games
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Latest Codes Section */}
          {showLatestCodes && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Latest Codes
              </h3>
              <div className="space-y-2">
                {popularGames.slice(0, 8).map((game) => (
                  <Link 
                    key={game.slug}
                    href={`/gaming/${game.slug}/codes-today`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {game.name} Today
                    </span>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-500/50">
                      New
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Navigation */}
          {showMonthlyNav && currentGameSlug && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Monthly Codes
              </h3>
              <div className="space-y-2">
                {otherMonths.slice(0, 6).map((month) => (
                  <Link 
                    key={month.slug}
                    href={`/gaming/${currentGameSlug}/codes-${month.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {month.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Games Link when no monthly nav */}
          {showMonthlyNav && !currentGameSlug && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Browse All
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/gaming/all-games"
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">All Games</p>
                    <p className="text-xs text-muted-foreground">50+ games with codes</p>
                  </div>
                </Link>
                <Link 
                  href="/gaming"
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Gaming Hub</p>
                    <p className="text-xs text-muted-foreground">All deals & codes</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Compact footer links for all pages
export function SEOFooterLinks({ currentGameSlug }: { currentGameSlug?: string }) {
  const games = POPULAR_GAMES.filter(g => g.slug !== currentGameSlug).slice(0, 8)
  
  return (
    <div className="py-6 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-3">More game codes:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {games.map((game) => (
            <Link 
              key={game.slug}
              href={`/gaming/${game.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {game.name}
            </Link>
          ))}
          <Link 
            href="/gaming/all-games"
            className="text-sm text-primary hover:underline font-medium"
          >
            All Games →
          </Link>
        </div>
      </div>
    </div>
  )
}
