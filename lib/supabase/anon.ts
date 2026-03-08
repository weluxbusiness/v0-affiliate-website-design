import "server-only"
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Anonymous Supabase client for server-side queries that don't need authentication.
 * This client doesn't use cookies, making it safe for:
 * - Static generation (generateStaticParams)
 * - ISR (Incremental Static Regeneration)
 * - Cached pages (revalidate)
 * - generateMetadata
 * 
 * Use this for public read operations like fetching deals, products, blog posts.
 * For authenticated operations, use the regular server client from './server.ts'
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
