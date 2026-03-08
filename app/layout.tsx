import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: 'SaveSmart - Save Money Automatically While Shopping Online',
    template: '%s | SaveSmart',
  },
  description: 'Free browser extension that finds coupons, compares prices and helps you save money at thousands of online stores automatically. Trusted by 2M+ shoppers.',
  keywords: ['coupons', 'deals', 'discounts', 'shopping', 'savings', 'browser extension', 'coupon codes', 'online shopping'],
  authors: [{ name: 'SaveSmart' }],
  creator: 'SaveSmart',
  publisher: 'SaveSmart',
  metadataBase: new URL('https://savesmart.bio'),
  verification: {
    google: 'sYNwb2WK56t7Yf3o_QcS11nlDc7SJaLzYzqxEnXZd28',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://savesmart.bio',
    title: 'SaveSmart - Save Money Automatically While Shopping Online',
    description: 'Free browser extension that finds coupons, compares prices and helps you save money at thousands of online stores automatically.',
    siteName: 'SaveSmart',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SaveSmart - Save Money While Shopping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaveSmart - Save Money Automatically While Shopping Online',
    description: 'Free browser extension that finds coupons and helps you save money at thousands of online stores.',
    images: ['/og-image.png'],
    creator: '@savesmart',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground pt-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
