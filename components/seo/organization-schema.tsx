// Organization JSON-LD schema for global site-wide SEO
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://savesmart.bio/#organization",
    name: "SaveSmart",
    url: "https://savesmart.bio",
    logo: {
      "@type": "ImageObject",
      url: "https://savesmart.bio/logo.png",
      width: 512,
      height: 512,
    },
    description: "Free browser extension that finds coupons, compares prices and helps you save money at thousands of online stores automatically.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/savesmart",
      "https://facebook.com/savesmart",
      "https://instagram.com/savesmart",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://savesmart.bio/help-center",
      availableLanguage: ["English"],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite schema with SearchAction for sitelinks search box
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://savesmart.bio/#website",
    url: "https://savesmart.bio",
    name: "SaveSmart",
    description: "Find the best deals, coupons, and discounts from thousands of online stores.",
    publisher: {
      "@id": "https://savesmart.bio/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://savesmart.bio/deal-finder?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
