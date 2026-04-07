import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"

interface GameHeroImageProps {
  src: string
  alt: string
  title?: string
  subtitle?: string
  badge?: string
  showUpdatedBadge?: boolean
  overlay?: boolean
  className?: string
  priority?: boolean
}

export function GameHeroImage({
  src,
  alt,
  title,
  subtitle,
  badge,
  showUpdatedBadge = true,
  overlay = true,
  className = "",
  priority = true,
}: GameHeroImageProps) {
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
        
        {/* Overlay gradient */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {badge && (
            <Badge className="bg-green-600 text-white font-bold shadow-lg text-sm px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {badge}
            </Badge>
          )}
          {showUpdatedBadge && (
            <Badge className="bg-amber-500 text-white font-semibold shadow-lg text-sm px-3 py-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Updated Daily
            </Badge>
          )}
        </div>
        
        {/* Title overlay */}
        {(title || subtitle) && (
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
