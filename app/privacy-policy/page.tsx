import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | SaveSmart",
  description: "Learn how SaveSmart collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  openGraph: {
    title: "Privacy Policy | SaveSmart",
    description: "Learn how SaveSmart collects, uses, and protects your personal information.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: March 1, 2026
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                SaveSmart (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our browser extension and website (collectively, the &quot;Service&quot;).
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Please read this Privacy Policy carefully. By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              
              <h3 className="mt-6 text-xl font-medium text-foreground">Information You Provide</h3>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address (if you create an account or subscribe to updates)</li>
                <li>Account preferences and settings</li>
                <li>Feedback, support requests, or communications you send to us</li>
              </ul>

              <h3 className="mt-6 text-xl font-medium text-foreground">Information Collected Automatically</h3>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Browser type and version</li>
                <li>Websites where you use our extension (limited to shopping-related activity)</li>
                <li>Coupon codes applied and savings achieved</li>
                <li>Device information and IP address</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our Service</li>
                <li>To find and apply coupon codes at checkout</li>
                <li>To compare prices and find better deals</li>
                <li>To improve and personalize your experience</li>
                <li>To communicate with you about updates and offers</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Data Sharing and Disclosure</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Service Providers:</strong> We may share data with third-party vendors who assist us in operating our Service</li>
                <li><strong className="text-foreground">Affiliate Partners:</strong> We share limited information with retail partners to track commissions (no personally identifiable information)</li>
                <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage practices</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Your Rights and Choices</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                You have the following rights regarding your personal information:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Access:</strong> Request a copy of the information we hold about you</li>
                <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate information</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-foreground">Data Portability:</strong> Request a copy of your data in a portable format</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                To exercise these rights, please contact us at <a href="mailto:support@savesmart.bio" className="text-primary hover:underline">support@savesmart.bio</a>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Cookies and Tracking</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience. For detailed information about our cookie practices, please see our{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Children&apos;s Privacy</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">International Data Transfers</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
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
              <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
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
