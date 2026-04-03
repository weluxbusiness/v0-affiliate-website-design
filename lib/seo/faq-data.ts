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

export const trendingDealsFAQs: FAQItem[] = [
  {
    question: "How are trending deals selected?",
    answer: "Trending deals are selected based on popularity, discount percentage, and user engagement. We track which deals are getting the most clicks and purchases, then surface the hottest items. Deals with 40%+ discounts and high conversion rates typically rank highest.",
  },
  {
    question: "How often are trending deals updated?",
    answer: "Trending deals are updated every 5 minutes based on real-time data. As deals sell out or expire, new trending items take their place. The most popular deals during sales events can change rapidly, so check back frequently.",
  },
  {
    question: "Why do trending deals sell out quickly?",
    answer: "Trending deals often feature limited-quantity items or flash sales with time restrictions. When thousands of shoppers see the same great deal, inventory can disappear within hours. We recommend acting fast when you see a deal you like.",
  },
  {
    question: "Can I get alerts for trending deals?",
    answer: "Yes! Sign up for SaveSmart deal alerts to receive instant notifications when hot deals go live. You can customize alerts by category, store, or price range so you only hear about deals that matter to you.",
  },
  {
    question: "Are trending deals available in my area?",
    answer: "Most trending deals are available nationwide through major online retailers. Some deals may have geographic restrictions or varying shipping costs. Check the retailer's site for specific availability in your area.",
  },
]

export const latestDealsFAQs: FAQItem[] = [
  {
    question: "How quickly are new deals added?",
    answer: "New deals are added throughout the day as we discover them. On average, we add 50-100 new deals daily. During major sales events like Black Friday or Prime Day, we may add hundreds of new deals per hour.",
  },
  {
    question: "Are the latest deals verified before posting?",
    answer: "Yes, every deal goes through our verification process before being listed. We confirm the discount is accurate, check that the product is in stock, and verify the retailer is legitimate. This typically takes 5-15 minutes from discovery to posting.",
  },
  {
    question: "Why should I check latest deals instead of trending?",
    answer: "Latest deals give you first access to new discounts before they become popular. By shopping latest deals, you can grab items before they sell out and find unique savings that haven't gone viral yet. Early birds often get the best selection.",
  },
  {
    question: "Can I filter latest deals by category or store?",
    answer: "Yes, use the category and store filters on our main deals page to narrow down latest additions. You can also use our AI Deal Finder to search for specific products and see the most recent matches.",
  },
  {
    question: "How do I know when a deal was added?",
    answer: "Each deal shows a 'New' badge when recently added. Our latest deals page is sorted by discovery time, so the newest deals always appear first. Deals typically stay in the 'latest' section for 24-48 hours before moving to category pages.",
  },
]

export const gamingDealsFAQs: FAQItem[] = [
  {
    question: "How do I redeem gaming promo codes?",
    answer: "Each game has a specific redemption process. Generally, you'll copy the code from our site, then paste it into the game's redemption page or in-game code entry section. We provide step-by-step instructions for each game on their dedicated pages.",
  },
  {
    question: "Why isn't my promo code working?",
    answer: "Codes may not work if they've expired, reached their redemption limit, or are region-restricted. Make sure you're entering the code exactly as shown (codes are case-sensitive). If a code doesn't work, check our page for updated codes.",
  },
  {
    question: "How often are gaming codes updated?",
    answer: "We update gaming codes daily and verify them before posting. When developers release new codes (often via social media or livestreams), we add them within hours. Expired codes are removed promptly to avoid confusion.",
  },
  {
    question: "Can I use multiple promo codes on one account?",
    answer: "Yes, most games allow you to redeem multiple different promo codes on the same account. However, each code can typically only be used once per account. Take advantage of all active codes to maximize your free rewards.",
  },
  {
    question: "Are these codes safe to use?",
    answer: "Absolutely! All codes on SaveSmart are official promotional codes released by game developers. We never share unofficial, hacked, or third-party codes. Using our verified codes won't put your account at risk.",
  },
]

export const blogFAQs: FAQItem[] = [
  {
    question: "How can your shopping guides help me save money?",
    answer: "Our guides provide expert strategies for maximizing savings, including when to shop, how to stack discounts, which browser extensions work best, and insider tips from deal experts. Following our advice can help you save 20-50% more on purchases.",
  },
  {
    question: "How often do you publish new content?",
    answer: "We publish 2-3 new articles weekly covering shopping tips, deal alerts, and savings strategies. During major sales events, we increase coverage with real-time deal roundups and buying guides.",
  },
  {
    question: "Can I suggest topics for future articles?",
    answer: "We love hearing from readers! Contact us through our help center with topic suggestions. Popular reader requests often become featured articles. We especially appreciate feedback on what savings strategies you'd like to learn more about.",
  },
  {
    question: "Are your product recommendations unbiased?",
    answer: "Yes, our editorial team independently researches and recommends products based on value, quality, and user reviews. While we may earn commissions on some links, this never influences our recommendations. We only feature deals we'd recommend to friends and family.",
  },
]

export const compareFAQs: FAQItem[] = [
  {
    question: "How does SaveSmart compare prices across stores?",
    answer: "We track prices from 30,000+ online retailers in real-time. When you view a product comparison, you're seeing current prices from all major stores that carry that item. Prices are verified and updated multiple times daily.",
  },
  {
    question: "Does the comparison include shipping costs?",
    answer: "Our listed prices are product prices before shipping. However, we note which retailers offer free shipping and factor that into our deal rankings. Many retailers offer free shipping on orders over a certain amount.",
  },
  {
    question: "How accurate are the price comparisons?",
    answer: "Our price data is highly accurate and updated hourly. However, prices can change quickly, especially during sales. We recommend clicking through to verify the final price before purchasing. Our accuracy rate is over 98%.",
  },
  {
    question: "Can I compare prices for specific product variants?",
    answer: "Yes, we track prices for specific colors, sizes, and configurations when available. Use the product filters to narrow down to your exact desired variant and see accurate price comparisons across all retailers.",
  },
]
