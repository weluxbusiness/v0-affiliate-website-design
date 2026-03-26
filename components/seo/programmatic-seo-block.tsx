"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SEOContentBlock } from "@/lib/seo/programmatic-seo-content"

interface ProgrammaticSEOBlockProps {
  content: SEOContentBlock
  className?: string
}

export function ProgrammaticSEOBlock({ content, className }: ProgrammaticSEOBlockProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className={cn("space-y-12", className)}>
      {/* Introduction */}
      <section className="prose prose-lg max-w-none">
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
          {content.intro}
        </p>
      </section>

      {/* Content Sections */}
      <div className="grid gap-8">
        {content.sections.map((section, index) => (
          <section key={index} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                {index + 1}
              </span>
              {section.title}
            </h2>
            <div className="pl-11">
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          {content.faq.map((item, index) => (
            <div 
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">
                  {item.question}
                </span>
                {expandedFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              {expandedFaq === index && (
                <div className="px-4 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Related Pages
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {content.internalLinks.map((link, index) => (
            <Link
              key={index}
              href={link}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {formatLinkLabel(link)}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

/**
 * Format internal link path into readable label
 */
function formatLinkLabel(path: string): string {
  // Remove leading slash and split
  const parts = path.slice(1).split('/')
  
  // Get the last meaningful segment
  const lastPart = parts[parts.length - 1]
  
  // Handle specific patterns
  if (parts[0] === 'deals' && parts[1] === 'price') {
    return lastPart.replace(/-/g, ' ').replace(/under/i, 'Under $')
  }
  
  if (parts[0] === 'deals' && (parts[1] === 'cheap' || parts[1] === 'top')) {
    return `${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)} ${lastPart.replace(/-/g, ' ')}`
  }
  
  if (parts[0] === 'gaming') {
    return lastPart.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }
  
  if (parts[0] === 'guides') {
    return lastPart.replace(/^best-/, 'Best ').replace(/-/g, ' ')
  }
  
  if (parts[0] === 'compare') {
    return lastPart.replace(/-vs-/i, ' vs ').replace(/\b\w/g, c => c.toUpperCase())
  }
  
  // Default: capitalize and replace hyphens
  return lastPart.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Compact version for sidebars or smaller spaces
 */
export function CompactSEOBlock({ content, className }: ProgrammaticSEOBlockProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
        {content.intro}
      </p>
      
      <div className="space-y-2">
        {content.internalLinks.slice(0, 3).map((link, index) => (
          <Link
            key={index}
            href={link}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {formatLinkLabel(link)}
          </Link>
        ))}
      </div>
    </div>
  )
}
