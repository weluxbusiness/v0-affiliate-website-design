import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Cookie Policy | SaveSmart",
  description: "Learn about how SaveSmart uses cookies and similar technologies to enhance your browsing experience.",
  openGraph: {
    title: "Cookie Policy | SaveSmart",
    description: "Information about cookies and tracking technologies used by SaveSmart.",
  },
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Cookie Policy
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: March 1, 2026
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">What Are Cookies?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                This Cookie Policy explains how SaveSmart (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking technologies when you use our browser extension and visit our website.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Types of Cookies We Use</h2>
              
              <h3 className="mt-6 text-xl font-medium text-foreground">Essential Cookies</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                These cookies are necessary for the website and extension to function properly. They enable core functionality such as security, network management, and account authentication. You cannot opt out of these cookies as the Service would not work without them.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Purpose</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">session_id</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Maintains user session</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">auth_token</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Authentication</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">30 days</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">csrf_token</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Security</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mt-8 text-xl font-medium text-foreground">Functional Cookies</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Purpose</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">preferences</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Stores user preferences</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">language</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Language preference</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">theme</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Dark/light mode</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mt-8 text-xl font-medium text-foreground">Analytics Cookies</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                These cookies help us understand how visitors interact with our website and extension by collecting and reporting information anonymously. This helps us improve our Service.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Purpose</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">_ga</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Google Analytics</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">_gid</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Google Analytics</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mt-8 text-xl font-medium text-foreground">Advertising/Tracking Cookies</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                These cookies are used to track affiliate referrals and may be used to show you relevant advertisements. They track your visits across websites and collect information to provide customized ads.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Cookie</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Purpose</th>
                      <th className="border border-border px-4 py-2 text-left text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">affiliate_id</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Affiliate tracking</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">30 days</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2 text-muted-foreground">referral_source</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">Traffic attribution</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Managing Cookies</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Most web browsers allow you to manage cookies through their settings. You can:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block cookies from being set</li>
                <li>Set your browser to notify you when cookies are being set</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Please note that blocking or deleting cookies may affect the functionality of our Service and your experience.
              </p>

              <h3 className="mt-6 text-xl font-medium text-foreground">Browser-Specific Instructions</h3>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong className="text-foreground">Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong className="text-foreground">Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Third-Party Cookies</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Some cookies are placed by third-party services that appear on our pages. We do not control these third-party cookies and their use is governed by the privacy policies of the respective third parties.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Third parties that may set cookies include:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Google Analytics (for website analytics)</li>
                <li>Affiliate networks (for commission tracking)</li>
                <li>Customer support tools (for chat functionality)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Updates to This Policy</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated policy will be posted on this page with a new &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-6">
                <p className="text-foreground font-medium">SaveSmart Privacy Team</p>
                <p className="mt-2 text-muted-foreground">Email: privacy@savesmart.com</p>
                <p className="text-muted-foreground">Address: 123 Tech Street, San Francisco, CA 94102</p>
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
              <Link href="/affiliate-disclosure" className="text-primary hover:underline">Affiliate Disclosure</Link>
            </p>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  )
}
