const BASE_URL = "https://savesmart.bio"

// ==================== COLLECTION PAGE SCHEMA ====================

export function generateCollectionPageSchema(
  name: string,
  url: string,
  itemCount: number,
  description?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}${url}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemCount,
    },
  }
}

// ==================== CITY COLLECTION SCHEMA ====================

export function generateCityCollectionSchema(
  categoryName: string,
  cityName: string,
  categorySlug: string,
  citySlug: string,
  itemCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals in ${cityName}`,
    description: `Find the best ${categoryName.toLowerCase()} deals in ${cityName}`,
    url: `${BASE_URL}/deals/${categorySlug}/${citySlug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemCount,
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
  }
}

// ==================== FAQ SCHEMA ====================

interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
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
}

// ==================== CATEGORY FAQ SCHEMA ====================

export function generateCategoryFAQSchema(categoryName: string, dealCount: number) {
  return generateFAQSchema([
    {
      question: `What are the best ${categoryName.toLowerCase()} deals today?`,
      answer: `We currently have ${dealCount} active ${categoryName.toLowerCase()} deals from top retailers like Amazon, Best Buy, Target and more. Our deals are sorted by discount percentage, so the best savings appear first. Check back often as new deals are added throughout the day.`,
    },
    {
      question: "How often are deals updated?",
      answer:
        "Our deals are refreshed every hour to ensure you see the most current prices and discounts. Each listing shows when it was last verified, so you know you're getting up-to-date information.",
    },
    {
      question: `Which stores offer the biggest ${categoryName.toLowerCase()} discounts?`,
      answer: `For ${categoryName.toLowerCase()}, we track deals from Amazon, Best Buy, Target, Walmart, and specialty retailers. Discount percentages vary by store and product, but we highlight the best savings so you can compare easily.`,
    },
    {
      question: "How do I know if a deal is legitimate?",
      answer:
        "All deals on SaveSmart are verified against retailer websites. We show the original price, sale price, and discount percentage for transparency. Click any deal to be taken directly to the retailer's product page where you can confirm pricing.",
    },
  ])
}

// ==================== CITY FAQ SCHEMA ====================

export function generateCityFAQSchema(
  categoryName: string,
  cityName: string
) {
  return generateFAQSchema([
    {
      question: `Where can I find the best ${categoryName.toLowerCase()} deals in ${cityName}?`,
      answer: `SaveSmart tracks ${categoryName.toLowerCase()} deals from major retailers like Amazon, Best Buy, Target, and Walmart that ship to ${cityName}. We compare prices across all these stores to find you the best discounts, typically ranging from 10-50% off retail prices.`,
    },
    {
      question: `Do these ${categoryName.toLowerCase()} deals ship to ${cityName}?`,
      answer: `Yes! All deals listed here are from major national retailers that offer shipping to ${cityName}. Many also offer in-store pickup options at local stores in the ${cityName} area.`,
    },
    {
      question: `How often are ${categoryName.toLowerCase()} deals updated for ${cityName}?`,
      answer: `We update our ${categoryName.toLowerCase()} deals for ${cityName} hourly to ensure you always see the most current prices and discounts. Check back frequently as new deals are added throughout the day.`,
    },
  ])
}

// ==================== BRAND FAQ SCHEMA ====================

export function generateBrandFAQSchema(brandName: string, dealCount: number) {
  const currentYear = new Date().getFullYear()
  return generateFAQSchema([
    {
      question: `What are the best ${brandName} deals in ${currentYear}?`,
      answer: `We track ${dealCount}+ ${brandName} deals across major retailers including Amazon, Best Buy, and authorized dealers. Our deals are verified and updated hourly to ensure accuracy.`,
    },
    {
      question: `Where can I find ${brandName} products on sale?`,
      answer: `The best ${brandName} deals are typically found at Amazon, Best Buy, Target, and the official ${brandName} store. SaveSmart compares prices across all retailers so you can find the lowest price.`,
    },
    {
      question: `When is the best time to buy ${brandName} products?`,
      answer: `${brandName} products often see the biggest discounts during Black Friday, Prime Day, and when new models are released. However, we find deals year-round - check back regularly for flash sales.`,
    },
    {
      question: `Are ${brandName} deals on SaveSmart verified?`,
      answer: `Yes, all ${brandName} deals are verified against retailer websites. We show original prices, sale prices, and discount percentages for full transparency.`,
    },
  ])
}

// ==================== STORE SCHEMA ====================

export function generateStoreSchema(
  storeName: string,
  storeSlug: string,
  dealCount: number,
  rating?: number,
  reviewCount?: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeName,
    url: `${BASE_URL}/stores/${storeSlug}`,
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
}

// ==================== BRAND SCHEMA ====================

export function generateBrandSchema(
  brandName: string,
  brandSlug: string,
  dealCount: number,
  description?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brandName,
    url: `${BASE_URL}/brands/${brandSlug}`,
    description: description || `Shop ${brandName} deals and find the best prices on ${brandName} products.`,
    offers: {
      "@type": "AggregateOffer",
      offerCount: dealCount,
      priceCurrency: "USD",
    },
  }
}

// ==================== BREADCRUMB SCHEMA ====================

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}
