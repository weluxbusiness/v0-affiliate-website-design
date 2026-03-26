export async function register() {
  // Only initialize Sentry if DSN is provided
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) {
    console.log('Sentry DSN not configured, skipping initialization')
    return
  }

  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./sentry.server.config")
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("./sentry.edge.config")
    }
  } catch (error) {
    console.warn('Failed to initialize Sentry:', error)
  }
}

// Capture errors from Server Components, middleware, and API routes
export async function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string
    method: string
    headers: { [key: string]: string }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource: 'react-server-components' | 'react-server-components-payload' | 'server-rendering'
    revalidateReason: 'on-demand' | 'stale' | undefined
    renderType: 'dynamic' | 'dynamic-resume'
  }
) {
  try {
    const Sentry = await import("@sentry/nextjs")
    Sentry.captureRequestError(error, request, context)
  } catch {
    // Sentry not available, log to console
    console.error('Request error:', error.message, request.path)
  }
}
