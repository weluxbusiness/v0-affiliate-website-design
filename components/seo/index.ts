// SEO components index
export { OrganizationSchema, WebSiteSchema } from './organization-schema'
export { 
  StructuredData,
  ProductSchema,
  BlogPostingSchema,
  BreadcrumbSchema,
  FAQSchema,
  CollectionSchema,
  StoreSchema,
  HowToSchema,
} from './structured-data'
export { 
  BreadcrumbNav,
  generateDealsBreadcrumbs,
  generateStoreBreadcrumbs,
  generateBrandBreadcrumbs,
  generateBlogBreadcrumbs,
  generateGamingBreadcrumbs,
} from './breadcrumb-nav'
export { FAQSection } from './faq-section'
// FAQ data is exported from @/lib/seo/faq-data for server component compatibility

// Indexing & Crawl Boost Components
export { TrendingNowSection } from './trending-now-section'
export { InternalLinksWidget, InternalLinksCompact } from './internal-links-widget'
export { LastUpdated, LastUpdatedInline, getCurrentDateISO, getCurrentDateFormatted } from './last-updated'
export { 
  ContextualLinksList, 
  ContextualLinksInline,
  dealContextualLinks,
  gamingContextualLinks,
  brandContextualLinks,
  getContextualLinks,
} from './contextual-links'
