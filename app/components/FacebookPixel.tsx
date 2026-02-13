// components/FacebookPixel.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export default function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // PageView em rotas diferentes (SPA navigation) - ignora carga inicial (já tratada no inline)
  const isFirstMount = useRef(true)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  const handlePixelLoad = () => {
    window.dispatchEvent(new CustomEvent('fbq:ready'))
  }

  if (!PIXEL_ID) return null

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      onLoad={handlePixelLoad}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  )
}