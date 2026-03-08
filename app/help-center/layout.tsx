import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center | SaveSmart Support",
  description: "Get help with SaveSmart. Find answers to common questions, troubleshooting guides, and contact our support team.",
  openGraph: {
    title: "Help Center | SaveSmart Support",
    description: "Get help with SaveSmart. Find answers to common questions and contact support.",
  },
}

export default function HelpCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
