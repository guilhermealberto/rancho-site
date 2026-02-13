// lib/fb-events.ts

export function sendToConversionsAPI(
  eventName: string,
  customData?: any,
  eventId?: string
): void {
  const id = eventId || `fb_${Date.now()}`;
  
  // Pegar cookies para melhor rastreio
  const cookies = typeof document !== 'undefined' ? document.cookie.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=');
    acc[k] = v;
    return acc;
  }, {} as any) : {};

  // URL CORRIGIDA PARA O ENDPOINT DO NEXT.JS
  fetch('/api/fb-events', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: eventName,
      eventId: id,
      userData: { 
        fbp: cookies._fbp, 
        fbc: cookies._fbc 
      },
      customData: customData || {},
      url: window.location.href,
    }),
  }).catch((err) => console.error("Erro na API de Conversões:", err));
}

export function trackEvent(
  eventName: string, 
  customData?: Record<string, any>, 
  isCustom: boolean = false // O terceiro argumento opcional aqui
) {
  if (typeof window === 'undefined') return;

  if (window.fbq) {
    const method = isCustom ? 'trackCustom' : 'track';
    window.fbq(method, eventName, customData);
  }
}