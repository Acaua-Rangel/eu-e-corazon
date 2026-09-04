import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaHeart, FaChevronDown } from 'react-icons/fa';

export default function HeroSection({ onStartStory }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1 }
      )
        .fromTo(
          '.hero-title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=0.6'
        )
        .fromTo(
          '.hero-subtitle',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          '.hero-scroll-indicator',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-[#0c0a09] via-[#1c1218] to-[#0c0a09]"
    >
      {/* Background glow effects */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating subtle hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/6 text-rose-400 animate-float text-xl">❤️</div>
        <div className="absolute top-1/3 right-1/5 text-pink-400 animate-float text-2xl" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute bottom-1/4 left-1/4 text-rose-300 animate-float text-lg" style={{ animationDelay: '2.8s' }}>💖</div>
        <div className="absolute bottom-1/3 right-1/4 text-rose-500 animate-float text-xl" style={{ animationDelay: '0.8s' }}>❤️</div>
      </div>

      <div className="max-w-3xl z-10 flex flex-col items-center">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6">
          <FaHeart className="w-3 h-3 text-rose-500 animate-pulse" />
          Nossa Linha do Tempo
        </div>

        <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
          Cada momento com você vale a pena <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 font-serif italic">lembrar</span>.
        </h1>

        <p className="hero-subtitle text-white/70 text-base sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl font-light">
          Desde aquele primeiro story no dia 13 de junho até cada risada, trilha e sorvete divididos... eu reuni todas as nossas memórias em um só lugar.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onStartStory}
            className="px-8 py-3.5 rounded-full text-base font-semibold bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl shadow-rose-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Iniciar Nossa Viagem</span>
            <FaChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Mouse scroll indicator inspired by Folio-React */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-white/40">Role para reviver</span>
        <svg
          className="w-5 h-8 text-white/60"
          viewBox="0 0 24 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="22"
            height="38"
            rx="11"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            className="animate-scroll-mouse"
            cx="12"
            cy="12"
            r="3"
            fill="#f43f5e"
          />
        </svg>
      </div>
    </section>
  );
}
