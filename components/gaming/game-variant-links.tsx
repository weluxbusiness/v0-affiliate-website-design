import Link from "next/link"
import { 
  Tag, 
  Clock, 
  Sparkles, 
  Gift, 
  BookOpen, 
  Gamepad2,
  Calendar,
  CheckCircle2
} from "lucide-react"
import type { Game } from "@/lib/gaming-data"
import { getActivePromoCodes } from "@/lib/gaming-data"

interface GameVariantLinksProps {
  game: Game
  currentVariant?: string
  showGuides?: boolean
}

// Links to all long-tail SEO variant pages for a game
export function GameVariantLinks({ 
  game, 
  currentVariant,
  showGuides = true 
}: GameVariantLinksProps) {
  const codeCount = getActivePromoCodes(game.promoCodes).length
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' }).toLowerCase()
  const currentYear = new Date().getFullYear()
  
  const variants = [
    {
      href: `/gaming/${game.slug}`,
      label: "All Codes",
      icon: Tag,
      color: "text-primary",
      variant: "main"
    },
    {
      href: `/gaming/${game.slug}/codes-today`,
      label: "Codes Today",
      icon: Clock,
      color: "text-blue-500",
      variant: "codes-today"
    },
    {
      href: `/gaming/${game.slug}/working-codes`,
      label: "Working Codes",
      icon: CheckCircle2,
      color: "text-green-600",
      variant: "working-codes"
    },
    {
      href: `/gaming/${game.slug}/new-codes`,
      label: "New Codes",
      icon: Sparkles,
      color: "text-amber-500",
      variant: "new-codes"
    },
    {
      href: `/gaming/${game.slug}/free-rewards`,
      label: "Free Rewards",
      icon: Gift,
      color: "text-purple-500",
      variant: "free-rewards"
    },
    {
      href: `/gaming/${game.slug}/redeem-codes`,
      label: "How to Redeem",
      icon: BookOpen,
      color: "text-emerald-500",
      variant: "redeem-codes"
    },
    {
      href: `/gaming/${game.slug}/codes-${currentMonth}-${currentYear}`,
      label: `${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ${currentYear}`,
      icon: Calendar,
      color: "text-indigo-500",
      variant: `codes-${currentMonth}-${currentYear}`
    },
  ]
  
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {variants.map((item) => {
        const Icon = item.icon
        const isActive = currentVariant === item.variant
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors text-center
              ${isActive 
                ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            <Icon className={`h-6 w-6 ${item.color}`} />
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

// Compact horizontal links for breadcrumb-adjacent placement
export function GameVariantLinksCompact({ 
  game, 
  currentVariant 
}: Omit<GameVariantLinksProps, 'showGuides'>) {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' }).toLowerCase()
  const currentYear = new Date().getFullYear()
  
  const variants = [
    { href: `/gaming/${game.slug}`, label: "All Codes", variant: "main" },
    { href: `/gaming/${game.slug}/codes-today`, label: "Today", variant: "codes-today" },
    { href: `/gaming/${game.slug}/working-codes`, label: "Working", variant: "working-codes" },
    { href: `/gaming/${game.slug}/new-codes`, label: "New", variant: "new-codes" },
    { href: `/gaming/${game.slug}/free-rewards`, label: "Rewards", variant: "free-rewards" },
    { href: `/gaming/${game.slug}/redeem-codes`, label: "Redeem", variant: "redeem-codes" },
  ]
  
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((item) => {
        const isActive = currentVariant === item.variant
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

// Related games with same variant
export function RelatedGamesVariant({ 
  games, 
  variant,
  title = "Similar Games"
}: { 
  games: Game[]
  variant: string 
  title?: string
}) {
  if (games.length === 0) return null
  
  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold text-foreground mb-4">{title}</h4>
      <div className="flex flex-wrap gap-3">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/gaming/${game.slug}/${variant}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
          >
            {game.shortName || game.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
