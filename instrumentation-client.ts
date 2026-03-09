import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  // Capture 100% in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay
  // Capture 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: false,

  integrations: [
    // Session replay for debugging
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: false,
    }),
    // Capture console errors
    Sentry.captureConsoleIntegration({
      levels: ['error'],
    }),
    // Browser tracing for performance
    Sentry.browserTracingIntegration(),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    // Browser/Network errors
    'Failed to fetch',
    'NetworkError',
    'Load failed',
    'ResizeObserver loop',
    'Non-Error promise rejection',
    // Browser extensions
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    // Third-party scripts
    /^Script error\.?$/,
  ],

  // Only send errors from our domain
  allowUrls: [
    /https?:\/\/savesmart\.bio/,
    /https?:\/\/.*\.vercel\.app/,
    /localhost/,
  ],

  // Environment tagging
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local',

  // Adds request headers and IP for users
  sendDefaultPii: true,
})

// Export for router transition tracking
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
