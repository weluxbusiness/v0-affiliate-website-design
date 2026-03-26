// Server-safe FAQ data functions (no "use client" directive)
// These can be imported in both server and client components

export interface FAQItem {
  question: string
  answer: string
}

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
