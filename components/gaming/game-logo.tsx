"use client"

import Image from "next/image"
import { useState } from "react"
import { Gamepad2, Zap, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameLogoProps {
  src?: string
  alt: string
  gameName?: string
  category?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showFallbackIcon?: boolean
}

const sizeMap = {
  sm: { container: "h-8 w-8", image: 32, icon: "h-4 w-4", text: "text-[10px]" },
  md: { container: "h-10 w-10", image: 40, icon: "h-5 w-5", text: "text-sm" },
  lg: { container: "h-12 w-12", image: 48, icon: "h-6 w-6", text: "text-base" },
  xl: { container: "h-14 w-14", image: 56, icon: "h-7 w-7", text: "text-lg" },
}

// Category-based gradient backgrounds for visual distinction
const categoryGradients: Record<string, string> = {
  "RPG": "from-purple-600 to-indigo-700",
  "Strategy": "from-blue-600 to-cyan-700",
  "Action": "from-red-600 to-orange-700",
  "Puzzle": "from-green-600 to-emerald-700",
  "Simulation": "from-teal-600 to-green-700",
  "Gacha": "from-pink-600 to-purple-700",
  "Card": "from-amber-600 to-yellow-700",
  "Battle Royale": "from-slate-600 to-zinc-700",
  "default": "from-primary to-primary/80",
}

export function GameLogo({ 
  src, 
  alt, 
  gameName,
  category,
  size = "md", 
  className,
  showFallbackIcon = true 
}: GameLogoProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { container, image, icon, text } = sizeMap[size]
  
  // Get initials from game name or alt text
  const displayName = gameName || alt
  const initials = displayName
    .split(/[\s-:]+/)
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  const gradient = categoryGradients[category || "default"] || categoryGradients.default

  // If no src or error, show enhanced fallback with initials
  if (!src || error) {
    return (
      <div 
        className={cn(
          container,
          `shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br ${gradient} ring-1 ring-white/20 relative overflow-hidden`,
          className
        )}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <Zap className="absolute top-0.5 right-0.5 h-2 w-2 text-white" />
          <Gift className="absolute bottom-0.5 left-0.5 h-2 w-2 text-white" />
        </div>
        
        {showFallbackIcon && initials.length >= 2 ? (
          <span className={cn("font-bold text-white z-10", text)}>
            {initials}
          </span>
        ) : (
          <Gamepad2 className={cn(icon, "text-white z-10")} />
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        container,
        "shrink-0 relative rounded-lg overflow-hidden ring-1 ring-border/50 bg-muted/50",
        !loaded && "animate-pulse",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={image}
        height={image}
        className={cn(
          "rounded-lg object-cover transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  )
}

// Larger version for featured sections
export function GameLogoLarge({ 
  src, 
  alt,
  gameName,
  category,
  className 
}: { 
  src?: string
  alt: string
  gameName?: string
  category?: string
  className?: string
}) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const displayName = gameName || alt
  const initials = displayName
    .split(/[\s-:]+/)
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  const gradient = categoryGradients[category || "default"] || categoryGradients.default

  if (!src || error) {
    return (
      <div 
        className={cn(
          `h-16 w-16 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} ring-2 ring-white/20 relative overflow-hidden shadow-md`,
          className
        )}
      >
        <div className="absolute inset-0 opacity-20">
          <Zap className="absolute top-1 right-1 h-3 w-3 text-white" />
          <Gift className="absolute bottom-1 left-1 h-3 w-3 text-white" />
        </div>
        {initials.length >= 2 ? (
          <span className="font-bold text-white text-xl z-10">{initials}</span>
        ) : (
          <Gamepad2 className="h-8 w-8 text-white z-10" />
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "h-16 w-16 shrink-0 relative rounded-xl overflow-hidden ring-2 ring-border/50 bg-muted/50 shadow-md",
        !loaded && "animate-pulse",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        className={cn(
          "rounded-xl object-cover transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  )
}
