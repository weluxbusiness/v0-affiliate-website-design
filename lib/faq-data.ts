// Server-safe FAQ data and schema generation
// NO "use client" - this file is used in Server Components

export interface FAQItem {
  question: string
  answer: string
}

// Generate FAQ Schema JSON-LD (server-safe, no hooks or browser APIs)
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Pre-built FAQ sets for common pages
export const dealsFAQs: FAQItem[] = [
  {
    question: "How do I use a coupon code?",
    answer: "Click the 'Copy Code' button next to any deal, then paste it at checkout on the retailer's website. The discount will be applied to your order automatically."
  },
  {
    question: "Are these deals verified?",
    answer: "Yes! Our team verifies deals daily. Look for the 'Verified' badge to see codes that have been recently tested and confirmed working."
  },
  {
    question: "How often are new deals added?",
    answer: "We update our deals database multiple times per day. Check the 'Today's Deals' section for the freshest offers, or browse trending deals for the most popular savings."
  },
  {
    question: "Can I combine multiple coupon codes?",
    answer: "Most retailers only allow one coupon code per order. However, you can often stack a coupon with sale prices or cashback offers for maximum savings."
  },
  {
    question: "What if a code doesn't work?",
    answer: "Codes can expire or have specific restrictions. Try another code from our list, or check the deal's terms. We appreciate when users report expired codes so we can keep our database current."
  }
]

export const gamingFAQs: FAQItem[] = [
  {
    question: "How do I redeem gaming promo codes?",
    answer: "Each game has a different redemption process. Usually, you'll find a 'Redeem Code' option in the game's settings or store menu. We provide specific instructions for each game on their dedicated page."
  },
  {
    question: "Are these codes safe to use?",
    answer: "All codes on SaveSmart are from official sources or verified community discoveries. We never share codes that could compromise your account security."
  },
  {
    question: "Do promo codes expire?",
    answer: "Yes, most gaming promo codes have expiration dates. We show the remaining time for each code and prioritize displaying codes that are expiring soon so you don't miss out."
  },
  {
    question: "How often are new gaming codes added?",
    answer: "We update gaming codes daily, often multiple times per day for popular games. New codes are typically released during updates, events, or promotional periods."
  },
  {
    question: "What rewards can I get from these codes?",
    answer: "Rewards vary by game but commonly include in-game currency, exclusive items, character skins, experience boosts, and other valuable bonuses."
  }
]

export const storeFAQs = (storeName: string): FAQItem[] => [
  {
    question: `How do I find the best ${storeName} deals?`,
    answer: `Browse our curated list of ${storeName} deals above, sorted by discount percentage and popularity. We update this page daily with the latest offers.`
  },
  {
    question: `Does ${storeName} offer free shipping?`,
    answer: `${storeName} shipping policies vary. Look for deals tagged with 'Free Shipping' or check the minimum order threshold on the retailer's website.`
  },
  {
    question: `How do I apply a ${storeName} coupon code?`,
    answer: `Copy the code from our site, add items to your ${storeName} cart, and paste the code in the promo code field at checkout. The discount will be applied before payment.`
  },
  {
    question: `When does ${storeName} have sales?`,
    answer: `${storeName} typically offers major sales during Black Friday, Cyber Monday, Prime Day, and seasonal events. We track all sales and update our deals in real-time.`
  }
]

export const categoryFAQs = (categoryName: string): FAQItem[] => [
  {
    question: `How do I find the best ${categoryName} deals?`,
    answer: `Browse our curated list of ${categoryName} deals above, filtered by discount and sorted by popularity. Use the store and brand filters to narrow your search.`
  },
  {
    question: `Are these ${categoryName} deals legitimate?`,
    answer: `Yes! We only feature deals from authorized retailers. Each deal is verified by our team before being listed on SaveSmart.`
  },
  {
    question: `How much can I save on ${categoryName}?`,
    answer: `Savings vary, but we regularly feature ${categoryName} deals with 20-70% off. Sign up for deal alerts to be notified of exceptional discounts.`
  },
  {
    question: `When is the best time to buy ${categoryName}?`,
    answer: `Major shopping events like Black Friday and Prime Day offer the deepest discounts. However, we find great ${categoryName} deals year-round.`
  }
]
