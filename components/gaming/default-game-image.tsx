"use client"

import { Gamepad2, Gift, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DefaultGameImageProps {
  gameName: string
  category?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showOverlay?: boolean
}

// Category-based color schemes
const categoryColors: Record<string, { bg: string; accent: string }> = {
  "RPG": { bg: "from-purple-900 to-indigo-900", accent: "text-purple-400" },
  "Strategy": { bg: "from-blue-900 to-cyan-900", accent: "text-cyan-400" },
  "Action": { bg: "from-red-900 to-orange-900", accent: "text-orange-400" },
  "Puzzle": { bg: "from-green-900 to-emerald-900", accent: "text-emerald-400" },
  "Simulation": { bg: "from-teal-900 to-green-900", accent: "text-teal-400" },
  "Gacha": { bg: "from-pink-900 to-purple-900", accent: "text-pink-400" },
  "Card": { bg: "from-amber-900 to-yellow-900", accent: "text-amber-400" },
  "Battle Royale": { bg: "from-slate-900 to-zinc-900", accent: "text-zinc-400" },
  "default": { bg: "from-slate-900 to-slate-800", accent: "text-slate-400" },
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14", 
  lg: "h-20 w-20",
  xl: "h-28 w-28",
}

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
}

export function DefaultGameImage({
  gameName,
  category = "default",
  className = "",
  size = "md",
  showOverlay = false,
}: DefaultGameImageProps) {
  const colors = categoryColors[category] || categoryColors.default
  
  // Get initials from game name (max 2 characters)
  const initials = gameName
    .split(/[\s-]+/)
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl flex items-center justify-center",
        `bg-gradient-to-br ${colors.bg}`,
        sizeClasses[size],
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1 right-1">
          <Zap className={cn("opacity-30", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
        </div>
        <div className="absolute bottom-1 left-1">
          <Gift className={cn("opacity-30", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
        </div>
      </div>
      
      {/* Main content - either initials or icon */}
      {initials.length >= 2 ? (
        <span className={cn(
          "font-bold text-white/90 z-10",
          size === "sm" && "text-xs",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl",
          size === "xl" && "text-3xl",
        )}>
          {initials}
        </span>
      ) : (
        <Gamepad2 className={cn("text-white/80 z-10", iconSizes[size])} />
      )}
      
      {/* Overlay for CTR (on larger sizes) */}
      {showOverlay && size !== "sm" && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
          <span className={cn(
            "text-white font-bold uppercase tracking-wider",
            size === "md" && "text-[8px]",
            size === "lg" && "text-[10px]",
            size === "xl" && "text-xs",
          )}>
            Codes
          </span>
        </div>
      )}
    </div>
  )
}
