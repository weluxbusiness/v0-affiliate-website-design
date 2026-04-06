"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Gift, 
  BookOpen,
  ChevronRight,
  Gamepad2,
  Tag,
  Lightbulb,
  Trophy,
  TrendingUp
} from "lucide-react"
import { getSeoUrl, getBlogUrl, type BlogPageType } from "@/lib/seo-routes"
import type { Game } from "@/lib/gaming-data"
import { getActivePromoCodes, getRelatedGames } from "@/lib/gaming-data"

interface PageTypeLinkProps {
  game: Game
  currentPageType: string
}

// SIMPLIFIED Cross-links - only high-value pages (codes + redeem-codes)
// Max 2 internal links to avoid spammy linking patterns
export function PageTypeLinks({ game, currentPageType }: PageTypeLinkProps) {
  const codeCount = getActivePromoCodes(game.promoCodes).length
  
  // Only 2 high-value page types to reduce link bloat
  const pageTypes = [
    {
      type: 'codes',
      label: 'All Codes',
      shortLabel: 'Codes',
      icon: Tag,
      description: `${codeCount}+ verified codes`,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
    },
    {
      type: 'redeem-codes',
      label: 'How to Redeem',
      shortLabel: 'Guide',
      icon: BookOpen,
      description: 'Step-by-step guide',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-600',
    },
  ]

  const otherPages = pageTypes.filter(p => p.type !== currentPageType)
  
  // Don't show if only 1 or 0 other pages
  if (otherPages.length === 0) return null

  return (
    <section className="py-8 md:py-10 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-foreground">More {game.shortName || game.name} Pages</h2>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          {otherPages.map((page) => {
            const Icon = page.icon
            return (
              <Link 
                key={page.type}
                href={getSeoUrl(game.slug, page.type as 'codes' | 'redeem-codes')}
                className="group"
              >
                <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${page.bgColor}`}>
                        <Icon className={`h-4 w-4 ${page.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {page.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface RelatedGamesLinksProps {
  currentGame: Game
  pageType: string
  limit?: number
}

// SIMPLIFIED - Max 4 related games to reduce link spam
// Only links to main codes page for each game
export function RelatedGamesLinks({ currentGame, pageType, limit = 4 }: RelatedGamesLinksProps) {
  const relatedGames = getRelatedGames(currentGame, limit)
  
  if (relatedGames.length === 0) return null

  return (
    <section className="py-8 md:py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Similar Games</h2>
        
        <div className="flex gap-3 flex-wrap">
          {relatedGames.map((game) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            return (
              <Link 
                key={game.id}
                href={getSeoUrl(game.slug, 'codes')}
                className="group"
              >
                <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {game.shortName || game.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {codeCount} codes
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface PopularGamesLinksProps {
  currentGame?: Game
  limit?: number
}

// SIMPLIFIED - Max 6 popular games to reduce link spam
export function PopularGamesLinks({ currentGame, limit = 6 }: PopularGamesLinksProps) {
  // Import dynamically to avoid circular dependency
  const { getPopularGames } = require('@/lib/gaming-data')
  const popularGames = getPopularGames(limit + 1).filter((g: Game) => g.id !== currentGame?.id).slice(0, limit)
  
  if (popularGames.length === 0) return null

  return (
    <section className="py-8 md:py-10 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Popular Games</h2>
        
        <div className="flex flex-wrap gap-2">
          {popularGames.map((game: Game) => (
            <Link 
              key={game.id}
              href={`/${game.slug}-codes`}
              className="group"
            >
              <Badge 
                variant="outline" 
                className="px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                {game.shortName || game.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

interface BlogLinksProps {
  game: Game
  currentBlogType?: BlogPageType
}

// REMOVED - Blog pages are noindexed, don't link to them
// Return null to prevent internal linking to low-value pages
export function BlogLinksSection({ game, currentBlogType }: BlogLinksProps) {
  return null
}

// REMOVED - Don't link to noindexed blog pages
export function BlogQuickLinks({ game }: { game: Game }) {
  return null
}

interface QuickLinksGridProps {
  currentGame: Game
  currentPageType: string
}

// SIMPLIFIED - Only 2 high-value page types
export function QuickLinksGrid({ currentGame, currentPageType }: QuickLinksGridProps) {
  const pageTypes = [
    { type: 'codes', label: 'All Codes', icon: Tag },
    { type: 'redeem-codes', label: 'Redeem Guide', icon: BookOpen },
  ]

  const otherPages = pageTypes.filter(p => p.type !== currentPageType)
  if (otherPages.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {otherPages.map((page) => {
        const Icon = page.icon
        return (
          <Link 
            key={page.type}
            href={getSeoUrl(currentGame.slug, page.type as 'codes' | 'redeem-codes')}
          >
            <Badge 
              variant="outline"
              className="px-3 py-1.5 gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
            >
              <Icon className="h-3.5 w-3.5" />
              {page.label}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}
