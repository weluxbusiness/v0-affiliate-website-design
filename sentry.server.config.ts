import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  // Capture 100% in dev, 20% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,

  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: false,

  // Capture unhandled promise rejections
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    // Network errors
    'Failed to fetch',
    'NetworkError',
    'Load failed',
    // Browser extensions
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
  ],

  // Environment tagging
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'local',

  // Adds request headers and IP for users
  sendDefaultPii: true,
})
