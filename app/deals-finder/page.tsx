import { redirect } from "next/navigation"

// 301 redirect from /deals-finder to /deal-finder to resolve duplicate content
export default function DealsFinderRedirectPage() {
  redirect("/deal-finder")
}
