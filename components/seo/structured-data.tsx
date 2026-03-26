// Reusable structured data components for SEO
import type { Deal } from '@/lib/deal-types'

interface StructuredDataProps {
  data: Record<string, unknown>
}

// Generic JSON-LD component
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Product schema for deal pages
interface ProductSchemaProps {
  deal: Deal
  url: string
}

export function ProductSchema({ deal, url }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.description,
    image: deal.image_url,
    brand: {
      "@type": "Brand",
      name: deal.brand || deal.store,
    },
    offers: {
      "@type": "Offer",
      url: url,
      price: deal.deal_price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: deal.store,
      },
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  }

  return <StructuredData data={schema} />
}

// BlogPosting schema
interface BlogPostingSchemaProps {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
}

export function BlogPostingSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = "SaveSmart Team",
  image,
}: BlogPostingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "SaveSmart",
      logo: {
        "@type": "ImageObject",
        url: "https://savesmart.bio/logo.png",
      },
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return <StructuredData data={schema} />
}

// Breadcrumb schema
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  }

  return <StructuredData data={schema} />
}

// FAQ schema
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
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

  return <StructuredData data={schema} />
}

// Collection/ItemList schema for category pages
interface CollectionSchemaProps {
  name: string
  description: string
  url: string
  itemCount: number
  items?: Array<{
    name: string
    url: string
    price?: number
  }>
}

export function CollectionSchema({ name, description, url, itemCount, items }: CollectionSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemCount,
      ...(items && items.length > 0 && {
        itemListElement: items.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
        })),
      }),
    },
  }

  return <StructuredData data={schema} />
}

// Store schema
interface StoreSchemaProps {
  name: string
  url: string
  dealCount: number
  rating?: number
  reviewCount?: number
}

export function StoreSchema({ name, url, dealCount, rating, reviewCount }: StoreSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    ...(rating && reviewCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: reviewCount,
      },
    }),
    offers: {
      "@type": "AggregateOffer",
      offerCount: dealCount,
      priceCurrency: "USD",
    },
  }

  return <StructuredData data={schema} />
}

// HowTo schema for guides
interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
}

export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: step.image,
        },
      }),
    })),
  }

  return <StructuredData data={schema} />
}
