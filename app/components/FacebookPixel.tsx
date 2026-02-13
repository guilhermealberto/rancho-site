"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/fb-events";

interface FacebookPixelFn {
  (...args: any[]): void;
  queue?: any[];
  version?: string;
  loaded?: boolean;
  callMethod?: (...args: any[]) => void;
  push?: (...args: any[]) => void;
}

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "734991552819814";

export default function FacebookPixel() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.fbq) {
      const fbq: FacebookPixelFn = function (...args: any[]) {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          (fbq.queue ||= []).push(args);
        }
      };

      fbq.queue = [];
      fbq.version = "2.0";
      fbq.loaded = true;

      window.fbq = fbq;
      window._fbq = fbq;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";

      const firstScript = document.getElementsByTagName("script")[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    }

    window.fbq("init", PIXEL_ID);
    trackEvent("PageView"); // Pixel + API de Conversões

    window.dispatchEvent(new CustomEvent("fbq:ready"));
  }, []);

  return null;
}
