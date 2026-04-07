import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Gift, Zap } from "lucide-react"

interface GameHeroImageProps {
  src: string
  alt: string
  gameName?: string
  month?: string
  year?: number
  codeCount?: number
  title?: string
  subtitle?: string
  badge?: string
  showUpdatedBadge?: boolean
  showOverlayText?: boolean
  overlay?: boolean
  className?: string
  priority?: boolean
}

export function GameHeroImage({
  src,
  alt,
  gameName,
  month,
  year,
  codeCount,
  title,
  subtitle,
  badge,
  showUpdatedBadge = true,
  showOverlayText = true,
  overlay = true,
  className = "",
  priority = true,
}: GameHeroImageProps) {
  // Default to current month/year if not provided
  const displayMonth = month || new Date().toLocaleString('default', { month: 'long' })
  const displayYear = year || new Date().getFullYear()
  
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${className}`}>
      {/* Image - Mobile: max 180px height, Desktop: full aspect ratio */}
      <div className="relative h-[160px] md:h-auto md:aspect-[21/9] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
        
        {/* Overlay gradient - stronger for text readability */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 pointer-events-none" />
        )}
        
        {/* HIGH IMPACT OVERLAY TEXT - Mobile optimized, simplified */}
        {showOverlayText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 pointer-events-none">
            {/* WORKING CODES - Primary headline */}
            <span className="inline-flex items-center gap-1.5 bg-green-600 text-white font-black text-sm md:text-2xl lg:text-3xl px-3 md:px-6 py-1.5 md:py-3 rounded-lg shadow-xl uppercase tracking-wide mb-1 md:mb-2">
              <Zap className="h-4 w-4 md:h-7 md:w-7 fill-current" />
              Working Codes
              <Zap className="h-4 w-4 md:h-7 md:w-7 fill-current" />
            </span>
            
            {/* Month Year */}
            <span className="text-white font-bold text-base md:text-3xl lg:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider mb-1 md:mb-3">
              {displayMonth} {displayYear}
            </span>
            
            {/* FREE REWARDS */}
            <div className="flex items-center gap-1.5">
              <Gift className="h-4 w-4 md:h-6 md:w-6 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm md:text-xl lg:text-2xl drop-shadow-lg uppercase">
                Free Rewards
              </span>
              <Gift className="h-4 w-4 md:h-6 md:w-6 text-amber-400" />
            </div>
          </div>
        )}
        
        {/* Bottom title overlay (legacy support) */}
        {(title || subtitle) && !showOverlayText && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            {title && (
              <h2 className="text-xl md:text-4xl font-bold text-white mb-1 drop-shadow-lg text-balance">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/90 text-base md:text-xl drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
