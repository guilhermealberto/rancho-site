"use client";

import React, { useState, useEffect } from "react";
import { trackEvent } from "@/lib/fb-events";

// --- Componentes Reutilizáveis ---

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem = ({ question, answer, isOpen, onClick }: AccordionItemProps) => {
  return (
    <div className="border-b border-stone-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className={`text-lg font-serif transition-colors ${isOpen ? 'text-emerald-800' : 'text-stone-600 group-hover:text-emerald-700'}`}>
          {question}
        </span>
        <span className={`ml-6 flex-shrink-0 text-emerald-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-stone-500 leading-relaxed text-sm md:text-base pr-4 font-light">
          {answer}
        </p>
      </div>
    </div>
  );
};

// --- Página Principal ---

export default function LuxuryRealEstate() {
  const whatsappNumber = "5516997206578";
  const whatsappLinkBase = `https://wa.me/${whatsappNumber}?text=Olá,%20vi%20o%20site%20da%20Empreendimento%20em%20Capitólio%20e%20gostaria%20de%20detalhes.`;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 1. Rastreio de Rolagem da Página
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // 2. DISPARO DO EVENTO VIEWCONTENT (Pixel + API de Conversões)
    const fireViewContent = () => {
      if (typeof window !== 'undefined' && 'fbq' in window && typeof window.fbq === 'function') {
        trackEvent('ViewContent', {
          content_name: 'Landing Page Rancho Capitólio',
          content_category: 'Real Estate Luxury',
          value: 3300000.00,
          currency: 'BRL'
        });
        return true;
      }
      return false;
    };

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const onPixelReady = () => {
      if (fireViewContent() && intervalId) clearInterval(intervalId);
    };
    window.addEventListener('fbq:ready', onPixelReady);

    if (!fireViewContent()) {
      intervalId = setInterval(() => {
        if (fireViewContent() && intervalId) clearInterval(intervalId);
      }, 200);
      setTimeout(() => { if (intervalId) clearInterval(intervalId); }, 5000);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('fbq:ready', onPixelReady);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleActionClick = (location: string, isNav: boolean = false) => {
    // Removido o 'true' para evitar o erro ts(2554)
    trackEvent('ButtonClick', { button_location: location });
    
    if (!isNav) {
      window.location.href = "/obrigado";
    }
  };

  return (
    <>
      <div className="bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
        
        {/* --- HEADER --- */}
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled
              ? "bg-white/90 backdrop-blur-md border-b border-stone-200 py-4 shadow-sm"
              : "bg-transparent py-6"
          }`}
        >
          <nav className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-serif font-bold tracking-tight ${scrolled ? 'text-emerald-900' : 'text-white'}`}>
                COLINAS<span className={scrolled ? "text-emerald-600" : "text-emerald-400"}>.</span>LAGO
              </span>
            </div>

            <div className={`hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide ${scrolled ? 'text-stone-600' : 'text-white/90'}`}>
              <a href="#leisure" onClick={() => handleActionClick('Menu: A Propriedade', false)} className="hover:text-emerald-500 transition-colors">A Propriedade</a>
              <a href="#infra" onClick={() => handleActionClick('Menu: Infraestrutura', false)} className="hover:text-emerald-500 transition-colors">Infraestrutura</a>
              <a href="#investment" onClick={() => handleActionClick('Menu: Investimento', false)} className="hover:text-emerald-500 transition-colors">Investimento</a>
            </div>

            <button
              onClick={() => handleActionClick("Header: Agendar Visita")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg ${
                scrolled 
                ? "bg-emerald-900 text-white hover:bg-emerald-800" 
                : "bg-white text-emerald-900 hover:bg-stone-100"
              }`}
            >
              Agendar Visita
            </button>
          </nav>
        </header>

        <main>
          {/* --- HERO SECTION --- */}
          <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="/assets/vista-hero.png" 
                alt="Vista para o Lago" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-stone-900/90"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center text-white mt-20">
              <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase mb-6 animate-fade-in-up">
                Oportunidade de Investimento
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-6 leading-tight tracking-tight">
              Invista no Melhor Ponto <br/> de Capitólio.
              </h1>
              <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                Uma obra-prima de 589m² no Condomínio Colinas do Lago. 
                <br className="hidden md:block"/>
                12 Suítes projetadas. Lazer completo pronto. O potencial de um Resort Privado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => handleActionClick("Hero: Receber Informações")}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3"
                >
                  Receber Informações
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
            </div>
          </section>

          {/* --- NUMBERS --- */}
          <section className="py-12 bg-stone-900 border-b border-stone-800">
             <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-stone-800/50">
                   <div>
                      <p className="text-3xl md:text-4xl font-serif text-white mb-1">4.000<span className="text-emerald-500 text-2xl">m²</span></p>
                      <p className="text-stone-500 text-xs uppercase tracking-widest">Terreno Total</p>
                   </div>
                   <div>
                      <p className="text-3xl md:text-4xl font-serif text-white mb-1">589<span className="text-emerald-500 text-2xl">m²</span></p>
                      <p className="text-stone-500 text-xs uppercase tracking-widest">Área Construída</p>
                   </div>
                   <div>
                      <p className="text-3xl md:text-4xl font-serif text-white mb-1">12</p>
                      <p className="text-stone-500 text-xs uppercase tracking-widest">Suítes Projetadas</p>
                   </div>
                   <div>
                      <p className="text-3xl md:text-4xl font-serif text-white mb-1">Heliponto</p>
                      <p className="text-stone-500 text-xs uppercase tracking-widest">Acesso Aéreo</p>
                   </div>
                </div>
             </div>
          </section>

          {/* --- O LAZER --- */}
          <section id="leisure" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                  <div className="max-w-2xl w-full text-left">
                     <span className="text-emerald-700 font-bold tracking-widest uppercase text-xs mb-3 block">
                        O que já está pronto?
                     </span>
                     <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                        A parte mais complexa <br/> 
                        <span className="italic text-stone-500">já foi entregue.</span>
                     </h2>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <div className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
                     <img src="/assets/piscina.png" alt="Piscina" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                     <div className="absolute bottom-0 left-0 p-8">
                        <h3 className="text-white font-serif text-2xl mb-2">Piscina Infinita</h3>
                        <p className="text-stone-300 text-sm leading-relaxed">Instalada e operante.</p>
                     </div>
                  </div>

                  <div className="group relative h-[500px] rounded-2xl overflow-hidden md:-mt-12 shadow-lg">
                     <img src="/assets/deck.jpeg" alt="Deck" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                     <div className="absolute bottom-0 left-0 p-8">
                        <h3 className="text-white font-serif text-2xl mb-2">Deck Sólido</h3>
                        <p className="text-stone-300 text-sm leading-relaxed">Construção em alvenaria.</p>
                     </div>
                  </div>

                  <div className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
                     <img src="/assets/paisagismo.png" alt="Paisagismo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                     <div className="absolute bottom-0 left-0 p-8">
                        <h3 className="text-white font-serif text-2xl mb-2">Paisagismo</h3>
                        <p className="text-stone-300 text-sm leading-relaxed">Palmeiras adultas integradas.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* --- VÍDEO CINEMATIC --- */}
          <section className="relative h-[60vh] md:h-[80vh] bg-black overflow-hidden flex items-center justify-center">
             <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
                <source src="/assets/rancho-demonstrativo.mp4" type="video/mp4" />
             </video>
             
             <div className="relative z-10 text-center px-6">
                <span className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-sm mb-4 block animate-pulse">
                   Cinematic Experience
                </span>
                <h2 className="font-serif text-4xl md:text-6xl text-white mb-8">
                   Sinta a grandiosidade <br/> do lugar.
                </h2>
                <button 
                  onClick={() => handleActionClick("Video: Solicitar Vídeo Completo")} 
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all font-medium"
                >
                   Solicitar Vídeo Completo no WhatsApp
                </button>
             </div>
          </section>

          {/* --- INFRAESTRUTURA --- */}
          <section id="infra" className="py-24 bg-white">
             <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                   <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Infraestrutura de Elite</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[600px]">
                   <div className="relative rounded-2xl overflow-hidden group h-[300px] md:h-full">
                      <img src="/assets/portaria.png" alt="Portaria" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold">Portaria 24h</div>
                   </div>

                   <div className="grid grid-rows-2 gap-4 h-[600px] md:h-full">
                      <div className="relative rounded-2xl overflow-hidden group">
                         <img src="/assets/heliponto.png" alt="Heliponto" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold">Heliponto Homologado</div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden group">
                         <img src="/assets/asfalto.jpeg" alt="Asfalto" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold">Infraestrutura Completa</div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* --- INVESTMENT THESIS --- */}
          <section id="investment" className="py-24 bg-stone-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 leading-tight">Equity Imediato:<br/>+R$ 2.2 Milhões.</h2>
                  <p className="text-stone-400 text-lg leading-relaxed mb-8 font-light">
                    Ao adquirir por R$ 3.3M e finalizar a obra, o investidor captura o "Gap de Equity" do mercado de luxo de Capitólio.
                  </p>
                  <button 
                    onClick={() => handleActionClick("Investment: Ver Planilha")} 
                    className="text-emerald-400 font-bold border-b border-emerald-500/30 hover:text-emerald-300 hover:border-emerald-300 transition-colors pb-1 inline-block"
                  >
                    Ver Planilha de Rentabilidade &rarr;
                  </button>
                </div>

                <div className="relative">
                  <div className="bg-stone-800/50 backdrop-blur-xl border border-stone-700 rounded-3xl p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-12 border-b border-stone-700 pb-6">
                      <h3 className="text-3xl font-serif text-white">Gap de Equity</h3>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold text-2xl">+67%</p>
                        <p className="text-stone-500 text-xs">ROI Estimado</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-6 h-64 w-full">
                      <div className="w-1/2 flex flex-col justify-end h-full">
                        <div className="mb-4 text-center"><span className="text-2xl font-bold text-emerald-400 block">R$ 3.3M</span></div>
                        <div className="w-full bg-stone-700 rounded-t-xl h-[60%]"></div>
                      </div>
                      <div className="w-1/2 flex flex-col justify-end h-full">
                        <div className="mb-4 text-center"><span className="text-3xl font-bold text-white block">R$ 5.5M</span></div>
                        <div className="w-full bg-emerald-600 rounded-t-xl h-[100%] shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- CTA FINAL --- */}
          <section className="py-24 bg-stone-900 text-center px-6">
             <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-8">
                   Compre o <span className="text-emerald-400">estilo de vida.</span>
                </h2>
                <button
                   onClick={() => handleActionClick("CTA Final: Falar com Proprietário")}
                   className="inline-flex items-center gap-3 bg-white text-stone-900 px-10 py-5 rounded-full font-bold hover:bg-emerald-50 transition-all transform hover:-translate-y-1 shadow-lg text-lg"
                >
                   Falar com Proprietário
                </button>
             </div>
          </section>

        </main>

        <footer className="bg-stone-950 text-stone-600 py-12 border-t border-stone-900 text-sm">
           <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                 <p className="text-stone-500 font-serif text-lg text-white mb-2">COLINAS.LAGO</p>
                 <p>Capitólio, Minas Gerais</p>
              </div>
              <div className="text-right">
                 <p>Contato Direto:</p>
                 <button onClick={() => handleActionClick("Footer: Telefone")} className="text-white hover:text-emerald-500 transition-colors">+55 (16) 99720-6578</button>
              </div>
           </div>
        </footer>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        :root { --font-serif: 'Playfair Display', serif; --font-sans: 'Lato', sans-serif; }
        .font-serif { font-family: var(--font-serif); }
        .font-sans { font-family: var(--font-sans); }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}