import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center | SaveSmart Support",
  description: "Get help with SaveSmart. Find answers to common questions, troubleshooting guides, and contact our support team.",
  keywords: [
    "SaveSmart help",
    "SaveSmart support",
    "SaveSmart FAQ",
    "coupon extension help",
    "SaveSmart troubleshooting",
  ],
  openGraph: {
    title: "Help Center | SaveSmart Support",
    description: "Get help with SaveSmart. Find answers to common questions and contact support.",
    url: "https://savesmart.bio/help-center",
  },
  alternates: {
    canonical: "/help-center",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HelpCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
