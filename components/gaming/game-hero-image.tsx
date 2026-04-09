import Image from "next/image"
import { CheckCircle2, Calendar } from "lucide-react"

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
  month,
  year,
  codeCount,
  title,
  subtitle,
  showUpdatedBadge = true,
  overlay = true,
  className = "",
  priority = true,
}: GameHeroImageProps) {
  // Default to current month/year if not provided
  const displayMonth = month || new Date().toLocaleString('default', { month: 'short' })
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
        
        {/* Subtle overlay gradient - only at bottom for any text */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        )}
        
        {/* Small subtle badge - top right corner */}
        {showUpdatedBadge && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {/* Updated badge */}
            <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              {displayMonth} {displayYear}
            </span>
            
            {/* Code count badge - only if provided */}
            {codeCount !== undefined && codeCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                {codeCount} Working
              </span>
            )}
          </div>
        )}
        
        {/* Bottom title overlay (for pages that need it) */}
        {(title || subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            {title && (
              <h2 className="text-lg md:text-2xl font-bold text-white mb-0.5 drop-shadow-lg text-balance">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/90 text-sm md:text-base drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
