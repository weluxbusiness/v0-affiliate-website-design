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
      name: deal.store,
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

// ============================================
// GAMING-SPECIFIC SCHEMAS
// ============================================

// VideoGame schema for game pages
interface VideoGameSchemaProps {
  name: string
  description: string
  url: string
  publisher: string
  developer: string
  platforms: string[]
  genres: string[]
  image?: string
  datePublished?: string
}

export function VideoGameSchema({
  name,
  description,
  url,
  publisher,
  developer,
  platforms,
  genres,
  image,
  datePublished,
}: VideoGameSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name,
    description,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    publisher: {
      "@type": "Organization",
      name: publisher,
    },
    developer: {
      "@type": "Organization",
      name: developer,
    },
    gamePlatform: platforms,
    genre: genres,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
      },
    }),
    ...(datePublished && { datePublished }),
  }

  return <StructuredData data={schema} />
}

// PromoCode/Offer list schema for gaming pages
interface PromoCodeListSchemaProps {
  gameName: string
  url: string
  codes: Array<{
    code: string
    reward: string
    isVerified: boolean
  }>
}

export function PromoCodeListSchema({ gameName, url, codes }: PromoCodeListSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${gameName} Promo Codes`,
    description: `Active promo codes and rewards for ${gameName}`,
    numberOfItems: codes.length,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    itemListElement: codes.slice(0, 10).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        availability: "https://schema.org/InStock",
        ...(code.isVerified && {
          validFrom: new Date().toISOString().split('T')[0],
        }),
      },
    })),
  }

  return <StructuredData data={schema} />
}

// ============================================
// DEALS-SPECIFIC SCHEMAS
// ============================================

// AggregateOffer schema for category/store pages with multiple deals
interface AggregateOfferSchemaProps {
  name: string
  description: string
  url: string
  offerCount: number
  lowPrice?: number
  highPrice?: number
  priceCurrency?: string
}

export function AggregateOfferSchema({
  name,
  description,
  url,
  offerCount,
  lowPrice,
  highPrice,
  priceCurrency = "USD",
}: AggregateOfferSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    mainEntity: {
      "@type": "AggregateOffer",
      offerCount,
      priceCurrency,
      ...(lowPrice !== undefined && { lowPrice }),
      ...(highPrice !== undefined && { highPrice }),
    },
  }

  return <StructuredData data={schema} />
}

// Enhanced Product schema with more offer details
interface EnhancedProductSchemaProps {
  name: string
  description: string
  image?: string
  brand: string
  url: string
  originalPrice?: number
  salePrice: number
  priceCurrency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
  seller: string
  validUntil?: string
  sku?: string
}

export function EnhancedProductSchema({
  name,
  description,
  image,
  brand,
  url,
  originalPrice,
  salePrice,
  priceCurrency = "USD",
  availability = 'InStock',
  condition = 'NewCondition',
  seller,
  validUntil,
  sku,
}: EnhancedProductSchemaProps) {
  const baseUrl = "https://savesmart.bio"
  const priceValidUntil = validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(image && {
      image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    }),
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(sku && { sku }),
    offers: {
      "@type": "Offer",
      url: url.startsWith('http') ? url : `${baseUrl}${url}`,
      price: salePrice,
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      itemCondition: `https://schema.org/${condition}`,
      priceValidUntil,
      seller: {
        "@type": "Organization",
        name: seller,
      },
      ...(originalPrice && originalPrice > salePrice && {
        priceSpecification: {
          "@type": "PriceSpecification",
          price: salePrice,
          priceCurrency,
          valueAddedTaxIncluded: true,
        },
      }),
    },
  }

  return <StructuredData data={schema} />
}

// ============================================
// HELPER FUNCTIONS FOR GENERATING SCHEMAS
// ============================================

/**
 * Generate a complete schema object for a deals category page
 */
export function generateDealsPageSchema({
  categoryName,
  url,
  dealCount,
  description,
}: {
  categoryName: string
  url: string
  dealCount: number
  description?: string
}) {
  const baseUrl = "https://savesmart.bio"
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals ${currentMonth} ${year}`,
    description: description || `${dealCount}+ verified ${categoryName.toLowerCase()} deals from top retailers. Updated hourly.`,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: dealCount,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    },
    dateModified: new Date().toISOString(),
  }
}

/**
 * Generate a complete schema object for a gaming page
 */
export function generateGamingPageSchema({
  gameName,
  gameSlug,
  description,
  publisher,
  developer,
  platforms,
  genres,
  codeCount,
  faqs,
}: {
  gameName: string
  gameSlug: string
  description: string
  publisher: string
  developer: string
  platforms: string[]
  genres: string[]
  codeCount: number
  faqs?: Array<{ question: string; answer: string }>
}) {
  const baseUrl = "https://savesmart.bio"
  const pageUrl = `${baseUrl}/gaming/${gameSlug}`
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()
  
  const schemas = []
  
  // WebPage schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${gameName} Codes (${currentMonth} ${year}) - ${codeCount} Working Codes`,
    description,
    url: pageUrl,
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "VideoGame",
      name: gameName,
      description,
      gamePlatform: platforms,
      genre: genres,
      publisher: { "@type": "Organization", name: publisher },
      developer: { "@type": "Organization", name: developer },
    },
  })
  
  // Breadcrumb schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Gaming", item: `${baseUrl}/gaming` },
      { "@type": "ListItem", position: 3, name: gameName, item: pageUrl },
    ],
  })
  
  // FAQ schema if FAQs provided
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    })
  }
  
  return schemas
}
