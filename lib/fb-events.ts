/**
 * Helper para enviar eventos ao Pixel (browser) E à API de Conversões (server-side).
 * Usa o mesmo event_id em ambos para desduplicação pela Meta.
 */

function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {}
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=')
    acc[k] = v
    return acc
  }, {} as Record<string, string>)
  return {
    fbp: cookies._fbp,
    fbc: cookies._fbc,
  }
}

function generateEventId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

export type FbEventData = Record<string, unknown>

export function sendToConversionsAPI(
  eventName: string,
  customData?: FbEventData,
  eventId?: string
): void {
  const id = eventId || generateEventId()
  const { fbp, fbc } = getFbCookies()

  fetch('/fb-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId: id,
      userData: { fbp, fbc },
      customData: customData || {},
      url: typeof window !== 'undefined' ? window.location.href : '',
    }),
  }).catch(() => {
    // Silently fail - API de Conversões é complementar ao Pixel
  })
}

/**
 * Dispara evento no Pixel E na API de Conversões com o mesmo event_id (desduplicação).
 */
export function trackEvent(
  eventName: string,
  customData?: FbEventData,
  isCustom = false
): void {
  if (typeof window === 'undefined') return

  const eventId = generateEventId()

  // 1. Envia ao Pixel (browser) com eventID para desduplicação
  if (window.fbq) {
    if (isCustom) {
      window.fbq('trackCustom', eventName, customData, { eventID: eventId })
    } else {
      window.fbq('track', eventName, customData, { eventID: eventId })
    }
  }

  // 2. Envia à API de Conversões (server-side)
  sendToConversionsAPI(eventName, customData, eventId)
}
