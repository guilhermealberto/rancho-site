"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/fb-events";

export default function ObrigadoRedirect() {
  const whatsappLink = "https://wa.me/5516997206578?text=Olá,%20vi%20o%20site%20do%20Rancho%20em%20Capitólio%20e%20gostaria%20de%20detalhes.";

  useEffect(() => {
    // 1. Verifica se o Pixel está carregado no navegador
    if (typeof window !== 'undefined' && window.fbq) {
      console.log("Disparando eventos para o Pixel Rancho...");

      // 2. Dispara PageView primeiro (essencial para a Meta aceitar o Lead)
      window.fbq('track', 'PageView');

      // 3. Dispara o evento de Conversão (Contact)
      trackEvent('Contact', {
        content_name: 'Lead Qualificado - Rancho Capitólio',
        value: 3300000.00,
        currency: 'BRL'
      });
    }

    // 4. Aumentamos para 3500ms (3.5 segundos)
    // Isso garante que o rastro "bata" no servidor da Meta antes da página fechar
    const timer = setTimeout(() => {
      console.log("Redirecionando para WhatsApp...");
      window.location.href = whatsappLink;
    }, 3500); 

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