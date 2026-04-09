import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Gift, Gamepad2, Users, Star, Sparkles, Trophy } from "lucide-react"

type BadgeVariant = "free-rewards" | "working-codes" | "new-player" | "gameplay" | "characters" | "featured"

interface GameSectionImageProps {
  src: string
  alt: string
  badge?: BadgeVariant
  customBadge?: string
  title?: string
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "portrait"
  priority?: boolean
}

const badgeConfig: Record<BadgeVariant, { label: string; icon: React.ReactNode; className: string }> = {
  "free-rewards": {
    label: "Free Rewards",
    icon: <Gift className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-green-600 text-white",
  },
  "working-codes": {
    label: "Working Codes",
    icon: <Star className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-amber-500 text-white",
  },
  "new-player": {
    label: "New Player Bonuses",
    icon: <Sparkles className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-purple-600 text-white",
  },
  "gameplay": {
    label: "Gameplay",
    icon: <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-blue-600 text-white",
  },
  "characters": {
    label: "Champions",
    icon: <Users className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-pink-600 text-white",
  },
  "featured": {
    label: "Featured",
    icon: <Trophy className="h-3.5 w-3.5 mr-1.5" />,
    className: "bg-primary text-primary-foreground",
  },
}

const aspectRatioClasses: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[2/1]",
  portrait: "aspect-[3/4]",
}

export function GameSectionImage({
  src,
  alt,
  badge,
  customBadge,
  title,
  className = "",
  aspectRatio = "video",
  priority = false,
}: GameSectionImageProps) {
  const badgeInfo = badge ? badgeConfig[badge] : null

  return (
    <div className={`relative w-full overflow-hidden rounded-xl group ${className}`}>
      <div className={`relative w-full ${aspectRatioClasses[aspectRatio]}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
        
        {/* NO OVERLAY - Clean image */}
        
        {/* Badge with shadow for contrast */}
        {(badgeInfo || customBadge) && (
          <div className="absolute top-3 left-3">
            <Badge className={`font-semibold shadow-xl text-sm px-3 py-1 ${badgeInfo?.className || "bg-primary text-primary-foreground"}`}>
              {badgeInfo?.icon}
              {badgeInfo?.label || customBadge}
            </Badge>
          </div>
        )}
        
        {/* Title with text shadow only (no background overlay) */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {title}
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}
