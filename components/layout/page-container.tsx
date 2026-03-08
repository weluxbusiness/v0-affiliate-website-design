import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * Remove horizontal padding for full-width sections
   */
  noPadding?: boolean
  /**
   * Use narrow container (max-w-4xl) for content-focused pages
   */
  narrow?: boolean
}

/**
 * Consistent page container with max-width 1280px (max-w-7xl),
 * centered with auto margins, and responsive horizontal padding.
 * 
 * Standard specs:
 * - max-width: 1280px (80rem / max-w-7xl)
 * - padding-x: 16px (mobile), 24px (sm), 32px (lg) - matches header exactly
 * - margin: auto (centered)
 */
export function PageContainer({ 
  children, 
  className,
  noPadding = false,
  narrow = false
}: PageContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto w-full",
        narrow ? "max-w-4xl" : "max-w-7xl",
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  )
}

interface PageSectionProps {
  children: React.ReactNode
  className?: string
  /**
   * Background color/gradient for the section
   */
  background?: "default" | "muted" | "primary" | "gradient"
  /**
   * Vertical padding size
   */
  spacing?: "none" | "sm" | "md" | "lg" | "xl"
}

const spacingClasses = {
  none: "",
  sm: "py-8",
  md: "py-12",
  lg: "py-16 sm:py-20",
  xl: "py-20 sm:py-24",
}

const backgroundClasses = {
  default: "bg-background",
  muted: "bg-muted/30",
  primary: "bg-primary text-primary-foreground",
  gradient: "bg-gradient-to-b from-background to-muted/30",
}

/**
 * Consistent page section wrapper with standardized spacing.
 * 
 * Standard vertical spacing:
 * - sm: 32px (py-8)
 * - md: 48px (py-12)
 * - lg: 64px / 80px responsive (py-16 sm:py-20)
 * - xl: 80px / 96px responsive (py-20 sm:py-24)
 */
export function PageSection({ 
  children, 
  className,
  background = "default",
  spacing = "md"
}: PageSectionProps) {
  return (
    <section 
      className={cn(
        backgroundClasses[background],
        spacingClasses[spacing],
        className
      )}
    >
      <PageContainer>
        {children}
      </PageContainer>
    </section>
  )
}

/**
 * Standard grid for deal cards with consistent responsive breakpoints.
 * 
 * Breakpoints:
 * - Mobile: 1 column
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 3 columns
 * - Large desktop (xl): 4 columns
 * 
 * Gap: 24px (gap-6)
 */
export function DealGrid({ 
  children, 
  className,
  columns = 4
}: { 
  children: React.ReactNode
  className?: string
  columns?: 3 | 4 | 6
}) {
  const columnClasses = {
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  }

  return (
    <div className={cn("grid gap-6", columnClasses[columns], className)}>
      {children}
    </div>
  )
}

/**
 * Section heading with consistent typography.
 */
export function SectionHeading({
  children,
  description,
  className,
  action,
}: {
  children: React.ReactNode
  description?: string
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {children}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
