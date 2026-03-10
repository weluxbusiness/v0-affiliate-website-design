import { Instagram, Twitter, Facebook } from "lucide-react"
import { cn } from "@/lib/utils"

export const SOCIAL_LINKS = [
  { 
    name: "Instagram", 
    href: "https://www.instagram.com/savesmart.bio/", 
    icon: Instagram,
    ariaLabel: "Follow SaveSmart on Instagram"
  },
  { 
    name: "Twitter", 
    href: "https://twitter.com/savesmartdeals", 
    icon: Twitter,
    ariaLabel: "Follow SaveSmart on Twitter"
  },
  { 
    name: "Facebook", 
    href: "https://facebook.com/savesmartdeals", 
    icon: Facebook,
    ariaLabel: "Follow SaveSmart on Facebook"
  },
] as const

interface SocialLinksProps {
  /** Visual variant */
  variant?: "default" | "compact" | "minimal"
  /** Show labels next to icons */
  showLabels?: boolean
  /** Additional class names */
  className?: string
  /** Icon size */
  iconSize?: "sm" | "md" | "lg"
}

export function SocialLinks({ 
  variant = "default", 
  showLabels = false,
  className,
  iconSize = "md"
}: SocialLinksProps) {
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }
  
  const buttonSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10"
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <social.icon className={iconSizes[iconSize]} aria-hidden="true" />
            {showLabels && <span className="ml-2 text-sm">{social.name}</span>}
          </a>
        ))}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className={cn(
              "flex items-center justify-center rounded-md bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              buttonSizes[iconSize]
            )}
          >
            <social.icon className={iconSizes[iconSize]} aria-hidden="true" />
          </a>
        ))}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel}
          className={cn(
            "flex items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
            buttonSizes[iconSize],
            showLabels && "w-auto px-3 gap-2"
          )}
        >
          <social.icon className={iconSizes[iconSize]} aria-hidden="true" />
          {showLabels && <span className="text-sm font-medium">{social.name}</span>}
        </a>
      ))}
    </div>
  )
}

/** Trust element with Instagram CTA */
export function SocialTrustElement({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span>Follow SaveSmart for daily deals and shopping tips</span>
      <a
        href="https://www.instagram.com/savesmart.bio/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow SaveSmart on Instagram"
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
      >
        <Instagram className="h-4 w-4" aria-hidden="true" />
        <span className="font-medium">@savesmart.bio</span>
      </a>
    </div>
  )
}
