import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

// 301 redirect from /deals-finder/[slug] to /deal-finder/[slug] to resolve duplicate content
export default async function DealsFinderSlugRedirectPage({ params }: PageProps) {
  const { slug } = await params
  redirect(`/deal-finder/${slug}`)
}
