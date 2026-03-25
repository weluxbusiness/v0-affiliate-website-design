"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import type { FAQItem } from "@/lib/faq-data"

// Re-export type for convenience (types are safe to re-export from client)
export type { FAQItem } from "@/lib/faq-data"

// NOTE: For server-safe functions like generateFAQSchema, dealsFAQs, etc.
// import directly from "@/lib/faq-data" in Server Components

interface FAQSectionProps {
  title?: string
  faqs: FAQItem[]
  className?: string
  showIcon?: boolean
}

export function FAQSection({ 
  title = "Frequently Asked Questions", 
  faqs, 
  className = "",
  showIcon = true 
}: FAQSectionProps) {
  if (faqs.length === 0) return null

  return (
    <section className={`py-10 md:py-12 ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          {showIcon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
