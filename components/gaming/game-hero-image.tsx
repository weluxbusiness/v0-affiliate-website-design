import Image from "next/image"
import { CheckCircle2, Calendar } from "lucide-react"

interface GameHeroImageProps {
  src: string
  alt: string
  month?: string
  year?: number
  codeCount?: number
  showUpdatedBadge?: boolean
  className?: string
  priority?: boolean
}

export function GameHeroImage({
  src,
  alt,
  month,
  year,
  codeCount,
  showUpdatedBadge = true,
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
        
        {/* NO OVERLAY - Clean image only */}
        
        {/* Small badges with shadow - top right corner */}
        {showUpdatedBadge && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {/* Date badge with shadow for contrast */}
            <span className="inline-flex items-center gap-1 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              <Calendar className="h-3 w-3" />
              {displayMonth} {displayYear}
            </span>
            
            {/* Code count badge - only if provided */}
            {codeCount !== undefined && codeCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                <CheckCircle2 className="h-3 w-3" />
                {codeCount} Working
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
