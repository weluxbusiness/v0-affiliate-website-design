"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Quote, 
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Tag,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Tip Box Component
interface TipBoxProps {
  children: ReactNode
  variant?: "tip" | "warning" | "success" | "info"
  title?: string
}

export function TipBox({ children, variant = "tip", title }: TipBoxProps) {
  const variants = {
    tip: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      icon: <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      defaultTitle: "Pro Tip",
      titleColor: "text-amber-800 dark:text-amber-300",
    },
    warning: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      defaultTitle: "Warning",
      titleColor: "text-red-800 dark:text-red-300",
    },
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      defaultTitle: "Success",
      titleColor: "text-emerald-800 dark:text-emerald-300",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      defaultTitle: "Note",
      titleColor: "text-blue-800 dark:text-blue-300",
    },
  }

  const config = variants[variant]

  return (
    <div className={cn("my-6 rounded-xl border p-5", config.bg, config.border)}>
      <div className="flex gap-3">
        <div className="shrink-0 pt-0.5">{config.icon}</div>
        <div className="min-w-0 flex-1">
          <p className={cn("font-semibold mb-2", config.titleColor)}>
            {title || config.defaultTitle}
          </p>
          <div className="text-sm leading-relaxed text-foreground/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Callout Card Component
interface CalloutCardProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
}

export function CalloutCard({ children, title, icon }: CalloutCardProps) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 shadow-sm">
      {(title || icon) && (
        <div className="mb-3 flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title && <h4 className="font-bold text-lg text-foreground">{title}</h4>}
        </div>
      )}
      <div className="text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  )
}

// Quote Block Component
interface QuoteBlockProps {
  children: ReactNode
  author?: string
  role?: string
}

export function QuoteBlock({ children, author, role }: QuoteBlockProps) {
  return (
    <blockquote className="my-8 relative pl-6 border-l-4 border-primary/30">
      <Quote className="absolute -left-3 -top-2 h-6 w-6 text-primary/20" />
      <p className="text-xl italic leading-relaxed text-foreground/80">
        {children}
      </p>
      {(author || role) && (
        <footer className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          {author && <span className="font-semibold">{author}</span>}
          {author && role && <span>-</span>}
          {role && <span>{role}</span>}
        </footer>
      )}
    </blockquote>
  )
}

// Divider Component
export function Divider() {
  return (
    <div className="my-12 flex items-center justify-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
    </div>
  )
}

// Table of Contents Component
interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <nav className="my-8 rounded-xl border border-border bg-muted/30 p-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-semibold text-foreground"
      >
        <span>Table of Contents</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block text-sm text-muted-foreground hover:text-primary transition-colors",
                  item.level === 2 && "font-medium",
                  item.level === 3 && "pl-4"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

// Recommended Deal Component
interface RecommendedDealProps {
  title: string
  originalPrice: number
  dealPrice: number
  discount: number
  store: string
  imageUrl?: string
  affiliateLink: string
  couponCode?: string
}

export function RecommendedDeal({
  title,
  originalPrice,
  dealPrice,
  discount,
  store,
  imageUrl,
  affiliateLink,
  couponCode,
}: RecommendedDealProps) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="bg-primary/10 px-5 py-3">
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          <Tag className="mr-1.5 h-3 w-3" />
          Recommended Deal
        </Badge>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {imageUrl && (
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-foreground line-clamp-2">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{store}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${dealPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              {discount}% OFF
            </Badge>
          </div>
          {couponCode && (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Use code: </span>
              <code className="rounded bg-muted px-2 py-0.5 font-mono text-primary">
                {couponCode}
              </code>
            </p>
          )}
        </div>
        <Button asChild className="shrink-0 gap-2">
          <a href={affiliateLink} target="_blank" rel="noopener sponsored">
            View Deal
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

// Extension CTA Component
export function ExtensionCTA() {
  return (
    <div className="my-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-lg">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <svg
            className="h-10 w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold">Start Saving Automatically</h3>
          <p className="mt-2 text-primary-foreground/80">
            Install the free SaveSmart extension and save up to 30% on your purchases. 
            Works on 25,000+ stores with automatic coupon codes.
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              Free forever
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              No credit card
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              Privacy focused
            </li>
          </ul>
        </div>
        <Button 
          size="lg" 
          variant="secondary" 
          className="shrink-0 gap-2 bg-white text-primary hover:bg-white/90"
        >
          Add Free Extension
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Article Image Component
interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
}

export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl shadow-md">
        <img
          src={src}
          alt={alt}
          className="w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Numbered Section Component
interface NumberedSectionProps {
  number: number
  title: string
  children: ReactNode
}

export function NumberedSection({ number, title, children }: NumberedSectionProps) {
  return (
    <div className="my-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {number}
        </span>
        <div className="min-w-0 flex-1 pt-1.5">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <div className="mt-3 text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Share Buttons Component
interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Share on Twitter"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Share on Facebook"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          aria-label="Share on LinkedIn"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

// Newsletter Signup Component
export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed")
      }

      setStatus("success")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-6">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-bold text-lg">You&apos;re subscribed!</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for subscribing. Check your inbox for confirmation.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-6">
      <h3 className="font-bold text-lg text-foreground">Get Savings Tips Weekly</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Join 50,000+ subscribers and receive the best deals and money-saving tips directly in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm disabled:opacity-50"
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
