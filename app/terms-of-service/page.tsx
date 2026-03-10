import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | SaveSmart",
  description: "Read the terms and conditions that govern your use of SaveSmart's browser extension and services.",
  openGraph: {
    title: "Terms of Service | SaveSmart",
    description: "Terms and conditions for using SaveSmart services.",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: March 1, 2026
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Agreement to Terms</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                By accessing or using the SaveSmart browser extension, website, and related services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Your continued use of the Service after any changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Description of Service</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SaveSmart provides a browser extension and related services that help users find and apply coupon codes, compare prices, and save money while shopping online. Our Service includes:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Automatic coupon code discovery and application</li>
                <li>Price comparison across multiple retailers</li>
                <li>Price tracking and drop alerts</li>
                <li>Deal and discount notifications</li>
                <li>Savings history and analytics</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">User Accounts</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Some features of our Service may require you to create an account. When creating an account, you agree to:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update your account information as needed</li>
                <li>Accept responsibility for all activity under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Acceptable Use</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Attempt to circumvent any security measures or access unauthorized areas</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems or bots to access the Service</li>
                <li>Harvest or collect user information without consent</li>
                <li>Transmit malware, viruses, or other harmful code</li>
                <li>Impersonate any person or entity</li>
                <li>Use the Service for any commercial purpose without authorization</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                The Service and its original content, features, and functionality are owned by SaveSmart and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                You may not copy, modify, distribute, sell, or lease any part of our Service without explicit written permission from SaveSmart.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Third-Party Links and Services</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or services that are not owned or controlled by SaveSmart. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Your interactions with third-party retailers, including purchases and use of coupons, are solely between you and the retailer. SaveSmart is not responsible for any disputes arising from such interactions.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Disclaimer of Warranties</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Implied warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the accuracy or reliability of coupon codes or deals</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We do not guarantee that any coupon code will work or that you will achieve any specific savings. Coupon availability and validity are determined by third-party retailers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAVESMART SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Loss of profits, revenue, or data</li>
                <li>Cost of substitute products or services</li>
                <li>Any damages resulting from unauthorized access to your account</li>
                <li>Any damages resulting from third-party content or services</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                In no event shall our total liability exceed the amount you have paid to SaveSmart in the past twelve months, or $100, whichever is greater.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Indemnification</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless SaveSmart and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, or expenses (including reasonable attorney fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Termination</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your right to use the Service will immediately cease</li>
                <li>We may delete your account and associated data</li>
                <li>Provisions that by their nature should survive termination will remain in effect</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Governing Law</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in San Francisco County, California.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-6">
                <p className="text-foreground font-medium">SaveSmart Support Team</p>
                <p className="mt-2 text-muted-foreground">
                  Email: <a href="mailto:support@savesmart.bio" className="text-primary hover:underline">support@savesmart.bio</a>
                </p>
                <p className="text-muted-foreground">Address: 123 Tech Street, San Francisco, CA 94102</p>
              </div>
            </section>
          </div>

          <footer className="mt-12 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              Related policies:{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
              {" • "}
              <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
              {" • "}
              <Link href="/affiliate-disclosure" className="text-primary hover:underline">Affiliate Disclosure</Link>
            </p>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
