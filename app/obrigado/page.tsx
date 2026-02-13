"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/fb-events";

export default function ObrigadoRedirect() {
  const whatsappLink = "https://wa.me/5516997206578?text=Olá,%20vi%20o%20site%20do%20Rancho%20em%20Capitólio%20e%20gostaria%20de%20detalhes.";

  useEffect(() => {
    // Garante que o PageView rode antes do Contact
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    trackEvent('Contact', {
      content_name: 'Lead Qualificado - Redirect Automático',
      value: 3300000.00,
      currency: 'BRL'
    });

    const timer = setTimeout(() => {
      window.location.href = whatsappLink;
    }, 2500); // Aumentei um pouco para garantir o envio

    return () => clearTimeout(timer);
  }, [whatsappLink]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-stone-900 text-white font-sans">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
      <h1 className="font-serif text-2xl">Conectando ao proprietário...</h1>
      <p className="text-stone-400 mt-2 text-sm font-light">Você será redirecionado para o WhatsApp em instantes.</p>
    </div>
  );
}