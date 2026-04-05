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
  Tag
} from "lucide-react"
import { getSeoUrl } from "@/lib/seo-routes"
import type { Game } from "@/lib/gaming-data"
import { getActivePromoCodes, getRelatedGames } from "@/lib/gaming-data"

interface PageTypeLinkProps {
  game: Game
  currentPageType: string
}

// Cross-links between different page types for the same game
export function PageTypeLinks({ game, currentPageType }: PageTypeLinkProps) {
  const codeCount = getActivePromoCodes(game.promoCodes).length
  
  const pageTypes = [
    {
      type: 'codes-today',
      label: 'Codes Today',
      shortLabel: 'Today',
      icon: Clock,
      description: `${codeCount}+ codes verified today`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
    },
    {
      type: 'working-codes',
      label: 'Working Codes',
      shortLabel: 'Working',
      icon: CheckCircle2,
      description: 'All tested & verified',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
    },
    {
      type: 'new-codes',
      label: 'New Codes',
      shortLabel: 'New',
      icon: Zap,
      description: 'Latest releases this week',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
    },
    {
      type: 'free-rewards',
      label: 'Free Rewards',
      shortLabel: 'Rewards',
      icon: Gift,
      description: 'Codes + daily bonuses',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-600',
    },
    {
      type: 'redeem-codes',
      label: 'How to Redeem',
      shortLabel: 'Guide',
      icon: BookOpen,
      description: 'Step-by-step guide',
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-600',
    },
  ]

  const otherPages = pageTypes.filter(p => p.type !== currentPageType)

  return (
    <section className="py-10 md:py-12 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">More {game.shortName || game.name} Codes</h2>
            <p className="text-sm text-muted-foreground">Explore all our {game.name} code pages</p>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {otherPages.map((page) => {
            const Icon = page.icon
            return (
              <Link 
                key={page.type}
                href={getSeoUrl(game.slug, page.type as 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards' | 'redeem-codes')}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${page.bgColor}`}>
                        <Icon className={`h-5 w-5 ${page.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {page.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {page.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
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

// Cross-links to the same page type for related games
export function RelatedGamesLinks({ currentGame, pageType, limit = 8 }: RelatedGamesLinksProps) {
  const relatedGames = getRelatedGames(currentGame, limit)
  
  if (relatedGames.length === 0) return null

  const getPageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'codes-today': 'Codes Today',
      'working-codes': 'Working Codes',
      'new-codes': 'New Codes',
      'free-rewards': 'Free Rewards',
      'redeem-codes': 'Redeem Guide',
    }
    return labels[type] || 'Codes'
  }

  return (
    <section className="py-10 md:py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Gamepad2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Similar Games</h2>
            <p className="text-sm text-muted-foreground">{getPageTypeLabel(pageType)} for games like {currentGame.shortName || currentGame.name}</p>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {relatedGames.map((game) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            return (
              <Link 
                key={game.id}
                href={getSeoUrl(game.slug, pageType as 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards' | 'redeem-codes')}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {game.shortName || game.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {codeCount} codes
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {game.categories.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/gaming"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All Games
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

interface PopularGamesLinksProps {
  currentGame?: Game
  limit?: number
}

// Explore popular games section (for footer area)
export function PopularGamesLinks({ currentGame, limit = 12 }: PopularGamesLinksProps) {
  // Import dynamically to avoid circular dependency
  const { getPopularGames } = require('@/lib/gaming-data')
  const popularGames = getPopularGames(limit + 1).filter((g: Game) => g.id !== currentGame?.id).slice(0, limit)
  
  if (popularGames.length === 0) return null

  return (
    <section className="py-10 md:py-12 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Popular Games</h2>
            <p className="text-sm text-muted-foreground">Get codes for the most popular games</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {popularGames.map((game: Game) => (
            <Link 
              key={game.id}
              href={`/gaming/${game.slug}`}
              className="group"
            >
              <Badge 
                variant="outline" 
                className="px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                {game.shortName || game.name}
                <span className="ml-1.5 text-xs opacity-70">
                  ({getActivePromoCodes(game.promoCodes).length})
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

interface QuickLinksGridProps {
  currentGame: Game
  currentPageType: string
}

// Compact inline cross-links for embedding in content
export function QuickLinksGrid({ currentGame, currentPageType }: QuickLinksGridProps) {
  const pageTypes = [
    { type: 'codes-today', label: 'Today', icon: Clock },
    { type: 'working-codes', label: 'Working', icon: CheckCircle2 },
    { type: 'new-codes', label: 'New', icon: Zap },
    { type: 'free-rewards', label: 'Rewards', icon: Gift },
    { type: 'redeem-codes', label: 'Guide', icon: BookOpen },
  ]

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {pageTypes.map((page) => {
        const Icon = page.icon
        const isActive = page.type === currentPageType
        return (
          <Link 
            key={page.type}
            href={getSeoUrl(currentGame.slug, page.type as 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards' | 'redeem-codes')}
          >
            <Badge 
              variant={isActive ? "default" : "outline"}
              className={`px-3 py-1.5 gap-1.5 ${!isActive && 'hover:bg-primary hover:text-primary-foreground hover:border-primary'} transition-colors cursor-pointer`}
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
