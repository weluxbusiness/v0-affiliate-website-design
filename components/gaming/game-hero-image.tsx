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
      {/* Image */}
      <div className="relative aspect-[21/9] w-full">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {badge && (
            <Badge className="bg-green-600 text-white font-bold shadow-lg text-sm px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {badge}
            </Badge>
          )}
          {showUpdatedBadge && (
            <Badge className="bg-amber-500 text-white font-semibold shadow-lg text-sm px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Updated Daily
            </Badge>
          )}
        </div>
        
        {/* HIGH IMPACT OVERLAY TEXT - CTR Optimized */}
        {showOverlayText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {/* WORKING CODES - Primary headline */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-2 bg-green-600/90 text-white font-black text-lg md:text-2xl lg:text-3xl px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-2xl uppercase tracking-wide">
                <Zap className="h-5 w-5 md:h-7 md:w-7 fill-current" />
                Working Codes
                <Zap className="h-5 w-5 md:h-7 md:w-7 fill-current" />
              </span>
            </div>
            
            {/* Month Year */}
            <div className="mb-3">
              <span className="text-white font-bold text-xl md:text-3xl lg:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-wider">
                {displayMonth} {displayYear}
              </span>
            </div>
            
            {/* FREE REWARDS */}
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
              <span className="text-amber-400 font-bold text-base md:text-xl lg:text-2xl drop-shadow-lg uppercase">
                Free Rewards
              </span>
              <Gift className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
            </div>
            
            {/* Code count if available */}
            {codeCount && codeCount > 0 && (
              <div className="mt-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-4 py-1.5">
                  {codeCount}+ Active Codes
                </Badge>
              </div>
            )}
          </div>
        )}
        
        {/* Bottom title overlay (legacy support) */}
        {(title || subtitle) && !showOverlayText && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {title && (
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg text-balance">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/90 text-lg md:text-xl drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
