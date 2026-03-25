'use client'

import { useCallback } from 'react'

interface TrackEventParams {
  event_type: 'code_copy' | 'code_click' | 'page_view' | 'affiliate_click'
  game_id?: string
  promo_code_id?: string
  code?: string
  page_slug?: string
}

export function useGamingAnalytics() {
  const trackEvent = useCallback(async (params: TrackEventParams) => {
    try {
      // Fire and forget - don't await or block the UI
      fetch('/api/analytics/gaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).catch(() => {
        // Silently fail - analytics shouldn't break UX
      })
    } catch {
      // Silently fail
    }
  }, [])

  const trackCodeCopy = useCallback((params: {
    game_id?: string
    promo_code_id?: string
    code: string
    page_slug?: string
  }) => {
    trackEvent({
      event_type: 'code_copy',
      ...params,
    })
  }, [trackEvent])

  const trackCodeClick = useCallback((params: {
    game_id?: string
    promo_code_id?: string
    code?: string
    page_slug?: string
  }) => {
    trackEvent({
      event_type: 'code_click',
      ...params,
    })
  }, [trackEvent])

  const trackPageView = useCallback((page_slug: string, game_id?: string) => {
    trackEvent({
      event_type: 'page_view',
      page_slug,
      game_id,
    })
  }, [trackEvent])

  const trackAffiliateClick = useCallback((params: {
    game_id?: string
    page_slug?: string
  }) => {
    trackEvent({
      event_type: 'affiliate_click',
      ...params,
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackCodeCopy,
    trackCodeClick,
    trackPageView,
    trackAffiliateClick,
  }
}
