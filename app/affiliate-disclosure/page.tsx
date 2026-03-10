import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Affiliate Disclosure | SaveSmart",
  description: "Transparency about how SaveSmart earns money through affiliate partnerships while helping you save on your purchases.",
  openGraph: {
    title: "Affiliate Disclosure | SaveSmart",
    description: "Learn how SaveSmart earns money through affiliate partnerships.",
  },
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Affiliate Disclosure
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: March 1, 2026
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Prominent Disclosure Box */}
            <div className="mb-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
              <h2 className="text-xl font-semibold text-foreground">Important Disclosure</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                SaveSmart is a free service that earns money through affiliate partnerships with retailers. When you use our extension to find deals or apply coupons and make a purchase, we may receive a commission from the retailer at no additional cost to you.
              </p>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">How SaveSmart Works</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SaveSmart is a free browser extension that helps you save money by automatically finding and applying coupon codes, comparing prices, and alerting you to deals. We believe in transparency about how we operate and how we generate revenue.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our mission is to help you save as much money as possible on your online purchases. To keep our service free for users, we participate in affiliate marketing programs with various online retailers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">What Are Affiliate Commissions?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                When you click on a deal, use a coupon code, or make a purchase through SaveSmart, we may receive a small commission from the retailer. This is called affiliate marketing or performance-based advertising.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Key points to understand:</strong>
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">No Extra Cost to You:</strong> Affiliate commissions are paid by the retailer, not by you. The price you pay is the same whether you use SaveSmart or not.
                </li>
                <li>
                  <strong className="text-foreground">You Still Save Money:</strong> Even though we earn a commission, you still get the full discount from the coupon code or deal. Our commission is separate from your savings.
                </li>
                <li>
                  <strong className="text-foreground">Commission Amounts Vary:</strong> Different retailers pay different commission rates, typically ranging from 1% to 15% of the purchase amount.
                </li>
                <li>
                  <strong className="text-foreground">Not All Purchases Generate Commissions:</strong> We don&apos;t receive commissions on every purchase. Some stores aren&apos;t part of affiliate programs, and some purchases don&apos;t qualify.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Our Affiliate Relationships</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We have affiliate relationships with thousands of online retailers. These include major retailers like:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Amazon</li>
                <li>Walmart</li>
                <li>Target</li>
                <li>Best Buy</li>
                <li>Macy&apos;s</li>
                <li>And many more...</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We work with various affiliate networks and programs including:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Amazon Associates</li>
                <li>Commission Junction (CJ)</li>
                <li>ShareASale</li>
                <li>Rakuten Advertising</li>
                <li>Impact</li>
                <li>Direct retailer affiliate programs</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Our Commitment to You</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Despite earning affiliate commissions, we are committed to:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Finding You the Best Deals:</strong> We prioritize finding you the biggest savings, not the highest commission for us. If a store offers a 30% off coupon but no commission, we&apos;ll still show it to you.
                </li>
                <li>
                  <strong className="text-foreground">Honest Recommendations:</strong> We never promote a deal solely because it pays us more. Our algorithms are designed to maximize your savings, not our revenue.
                </li>
                <li>
                  <strong className="text-foreground">Transparency:</strong> We clearly disclose our affiliate relationships and how we make money. We believe you have the right to know.
                </li>
                <li>
                  <strong className="text-foreground">Keeping SaveSmart Free:</strong> Affiliate commissions allow us to offer SaveSmart completely free to users. No subscription fees, no premium tiers.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Editorial Independence</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our editorial content, including blog posts, deal rankings, and store reviews, is not influenced by affiliate relationships. We maintain strict editorial independence and base our recommendations on:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Actual savings potential for users</li>
                <li>Coupon code validity and success rates</li>
                <li>User reviews and feedback</li>
                <li>Store reputation and reliability</li>
                <li>Quality of products and customer service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">FTC Compliance</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                This disclosure is provided in compliance with the Federal Trade Commission&apos;s (FTC) guidelines on endorsements and testimonials. The FTC requires that we disclose any material connection between SaveSmart and the retailers we promote.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We are committed to following all applicable laws and regulations regarding affiliate marketing and consumer protection.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Questions?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                If you have any questions about our affiliate relationships or this disclosure, please don&apos;t hesitate to contact us:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-6">
                <p className="text-foreground font-medium">SaveSmart Support Team</p>
                <p className="mt-2 text-muted-foreground">
                  Email: <a href="mailto:support@savesmart.bio" className="text-primary hover:underline">support@savesmart.bio</a>
                </p>
                <p className="text-muted-foreground">Address: 123 Tech Street, San Francisco, CA 94102</p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Summary</h2>
              <div className="mt-4 rounded-xl border border-border bg-muted/50 p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>SaveSmart is free to use - always</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>We earn commissions from retailers, not from you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>You pay the same price whether using SaveSmart or not</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>We prioritize your savings over our commissions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Our content and recommendations are editorially independent</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <footer className="mt-12 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              Related policies:{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
              {" • "}
              <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
              {" • "}
              <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
            </p>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
