"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  faqs: FAQItem[]
  className?: string
  schemaId?: string
}

export function FAQSection({ 
  title = "Frequently Asked Questions",
  subtitle,
  faqs, 
  className,
  schemaId = "faq-schema"
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Generate FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <script
        id={schemaId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pre-built FAQ sets for different page types
export const homepageFAQs: FAQItem[] = [
  {
    question: "What is SaveSmart and how does it work?",
    answer: "SaveSmart is a free deal-finding platform that helps you save money while shopping online. We automatically scan thousands of retailers to find the best deals, discounts, and coupon codes. Simply browse our curated deals or use our AI Deal Finder to search for specific products. When you find a deal you like, click through to the retailer to complete your purchase at the discounted price.",
  },
  {
    question: "Is SaveSmart really free to use?",
    answer: "Yes, SaveSmart is 100% free for shoppers. We earn a small commission from retailers when you make a purchase through our links, but this never affects the price you pay. In fact, our deals often include exclusive discounts you won't find elsewhere.",
  },
  {
    question: "How often are deals updated?",
    answer: "Our deals are updated multiple times per hour. We use automated systems to monitor prices across hundreds of retailers, so you always see the most current discounts. Time-sensitive deals like flash sales and limited-time offers are added as soon as we discover them.",
  },
  {
    question: "Which stores does SaveSmart cover?",
    answer: "We track deals from over 30,000 online stores including Amazon, Best Buy, Target, Walmart, Nike, Apple, Costco, Home Depot, and many more. Whether you're shopping for electronics, fashion, home goods, or groceries, we've got you covered.",
  },
  {
    question: "How do I know if a deal is legitimate?",
    answer: "Every deal on SaveSmart is verified before being published. We check that the discount is real by comparing it to the retailer's regular price and historical pricing data. We also display the original price, sale price, and exact discount percentage so you can see exactly how much you're saving.",
  },
  {
    question: "Can I get alerts for specific products or price drops?",
    answer: "Yes! Sign up for our deal alerts to receive notifications when prices drop on products you're interested in. You can set alerts for specific items, categories, or stores. We'll email you as soon as a matching deal goes live.",
  },
]

export const dealsCategoryFAQs = (categoryName: string): FAQItem[] => [
  {
    question: `What are the best ${categoryName.toLowerCase()} deals available right now?`,
    answer: `We currently feature dozens of verified ${categoryName.toLowerCase()} deals from top retailers like Amazon, Best Buy, Target, and Walmart. Our deals are sorted by discount percentage, so the biggest savings appear first. Popular ${categoryName.toLowerCase()} typically see discounts of 20-50% off during sales events.`,
  },
  {
    question: `How often do ${categoryName.toLowerCase()} deals change?`,
    answer: `${categoryName} deals are updated multiple times per hour. Flash sales can appear and expire within hours, while seasonal promotions may last several weeks. We recommend checking back daily and signing up for alerts to catch the best deals before they sell out.`,
  },
  {
    question: `Which stores have the best ${categoryName.toLowerCase()} discounts?`,
    answer: `The best ${categoryName.toLowerCase()} discounts vary by product type. Amazon often has competitive everyday prices, while Best Buy and Target run frequent sales events. Nike and specialty retailers offer the best deals on branded items. We compare prices across all stores so you can find the absolute lowest price.`,
  },
  {
    question: `Are these ${categoryName.toLowerCase()} deals verified?`,
    answer: `Yes, every ${categoryName.toLowerCase()} deal on SaveSmart is verified against the retailer's website. We display the original price, sale price, and discount percentage so you can confirm the savings. Click through to the retailer to see the current price and complete your purchase.`,
  },
]

export const storeFAQs = (storeName: string): FAQItem[] => [
  {
    question: `How do I find the best deals at ${storeName}?`,
    answer: `Browse our curated ${storeName} deals page to see all current discounts sorted by savings. We update ${storeName} deals multiple times per hour, so you're always seeing the freshest offers. You can also use our AI Deal Finder to search for specific products at ${storeName}.`,
  },
  {
    question: `Does ${storeName} offer coupon codes?`,
    answer: `Yes, ${storeName} frequently offers coupon codes and promo codes. Check our ${storeName} coupons page for verified codes that can be stacked with existing sales for additional savings. We test all codes before listing them to ensure they work.`,
  },
  {
    question: `When does ${storeName} have the biggest sales?`,
    answer: `${storeName}'s biggest sales typically occur during Black Friday, Cyber Monday, Prime Day (for Amazon), and seasonal clearance events. We track all ${storeName} sales and feature the best deals prominently so you don't miss out on major savings opportunities.`,
  },
  {
    question: `Can I price match ${storeName} deals at other stores?`,
    answer: `Many retailers offer price matching policies that allow you to get ${storeName}'s prices at competing stores. We recommend checking each retailer's price match policy. SaveSmart makes it easy to compare prices across stores so you can decide whether to price match or buy direct.`,
  },
]
