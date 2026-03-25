"use client"

import Image from "next/image"
import { useState } from "react"
import { Gamepad2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DEFAULT_GAME_LOGO } from "@/lib/gaming-data"

interface GameLogoProps {
  src?: string
  alt: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showFallbackIcon?: boolean
}

const sizeMap = {
  sm: { container: "h-8 w-8", image: 32, icon: "h-4 w-4" },
  md: { container: "h-10 w-10", image: 40, icon: "h-5 w-5" },
  lg: { container: "h-12 w-12", image: 48, icon: "h-6 w-6" },
  xl: { container: "h-14 w-14", image: 56, icon: "h-7 w-7" },
}

export function GameLogo({ 
  src, 
  alt, 
  size = "md", 
  className,
  showFallbackIcon = true 
}: GameLogoProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { container, image, icon } = sizeMap[size]

  // If no src or error, show fallback
  if (!src || error) {
    return (
      <div 
        className={cn(
          container,
          "shrink-0 flex items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20",
          className
        )}
      >
        {showFallbackIcon ? (
          <Gamepad2 className={cn(icon, "text-primary")} />
        ) : (
          <Image
            src={DEFAULT_GAME_LOGO}
            alt={alt}
            width={image}
            height={image}
            className="rounded-lg object-cover"
          />
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
  className 
}: { 
  src?: string
  alt: string
  className?: string
}) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || error) {
    return (
      <div 
        className={cn(
          "h-16 w-16 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20",
          className
        )}
      >
        <Gamepad2 className="h-8 w-8 text-primary" />
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
