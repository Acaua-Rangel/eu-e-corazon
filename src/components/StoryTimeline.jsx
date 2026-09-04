import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { storySlides } from '../data/storyData';
import { FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function StoryTimeline() {
  const containerRef = useRef(null);
  const totalSlides = storySlides.length;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Sensibilidade calibrada por slide
      const scrollPerSlide = 220;
      const totalScrollDistance = (totalSlides - 1) * scrollPerSlide;
      const segmentDuration = 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'story-scroll-trigger',
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScrollDistance}px`,
          pin: true,
          pinSpacing: true,
          scrub: 0.2,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const activeIndex = Math.min(
              Math.floor(progress * totalSlides),
              totalSlides - 1
            );

            // Update dots with lightweight inline style
            const dots = containerRef.current?.querySelectorAll('[data-dot]');
            dots?.forEach((dot, j) => {
              if (j === activeIndex) {
                dot.style.backgroundColor = '#f43f5e';
                dot.style.borderColor = '#fda4af';
                dot.style.transform = 'scale(1.35)';
                dot.style.boxShadow = '0 0 8px rgba(244, 63, 94, 0.7)';
              } else {
                dot.style.backgroundColor = 'transparent';
                dot.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = 'none';
              }
            });
          },
        },
      });

      // Build lightweight hardware-accelerated crossfade & text transitions
      for (let i = 1; i < totalSlides; i++) {
        const slideEl = containerRef.current?.querySelector(`[data-slide="${i}"]`);
        const textEl = containerRef.current?.querySelector(`[data-text="${i}"]`);
        const prevTextEl = containerRef.current?.querySelector(`[data-text="${i - 1}"]`);
        const pos = (i - 1) * segmentDuration;

        // Fade out previous text
        if (prevTextEl) {
          tl.to(
            prevTextEl,
            {
              opacity: 0,
              y: -20,
              duration: segmentDuration * 0.35,
              ease: 'power1.in',
              force3D: true,
            },
            pos
          );
        }

        // Crossfade media (hardware accelerated)
        if (slideEl) {
          tl.to(
            slideEl,
            {
              opacity: 1,
              duration: segmentDuration * 0.6,
              ease: 'none',
              force3D: true,
            },
            pos + segmentDuration * 0.15
          );
        }

        // Fade in new text
        if (textEl) {
          tl.fromTo(
            textEl,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: segmentDuration * 0.38,
              ease: 'power1.out',
              force3D: true,
            },
            pos + segmentDuration * 0.55
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [totalSlides]);

  const scrollToSlideIndex = (index) => {
    const trigger = ScrollTrigger.getById('story-scroll-trigger');
    if (!trigger) return;
    const target = trigger.start + (index / (totalSlides - 1)) * (trigger.end - trigger.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Touch Swipe (1 slide per swipe gesture, YouTube Shorts style)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;
    let startX = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isSwiping = true;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping || e.touches.length !== 1) return;
      const diffY = e.touches[0].clientY - startY;
      const diffX = e.touches[0].clientX - startX;

      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 8) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping) return;
      isSwiping = false;

      const trigger = ScrollTrigger.getById('story-scroll-trigger');
      if (!trigger) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const diffY = endY - startY;
      const diffX = endX - startX;

      if (Math.abs(diffY) > 35 && Math.abs(diffY) > Math.abs(diffX)) {
        const progress = trigger.progress;
        const currentSlide = Math.min(
          Math.max(Math.round(progress * (totalSlides - 1)), 0),
          totalSlides - 1
        );

        if (diffY < -35) {
          if (currentSlide < totalSlides - 1) {
            scrollToSlideIndex(currentSlide + 1);
          } else {
            const closingEl = document.getElementById('closing-section');
            closingEl?.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (diffY > 35) {
          if (currentSlide > 0) {
            scrollToSlideIndex(currentSlide - 1);
          } else {
            const heroEl = document.getElementById('hero-section');
            heroEl?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [totalSlides]);

  return (
    <section id="story-timeline" className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-screen h-screen overflow-hidden bg-[#0c0a09] select-none"
      >
        {/* Images / Videos Layer (GPU Accelerated) */}
        {storySlides.map((slide, i) => (
          <div
            key={slide.id}
            data-slide={i}
            className="absolute inset-0 w-full h-full gpu-accelerated"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i }}
          >
            {/* Ambient Lighting Backdrop (0% GPU cost vs heavy 40px Gaussian blur) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/60 via-[#150a10]/40 to-[#0c0a09]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-rose-950/20 rounded-full blur-[90px] pointer-events-none" />

            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent z-10 pointer-events-none" />

            {/* Main Media (Image or Video) */}
            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 z-10">
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[82vh] max-w-[92vw] md:max-w-[72vw] object-contain rounded-2xl shadow-xl shadow-black/70 border border-white/10 gpu-accelerated"
                />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-[82vh] max-w-[92vw] md:max-w-[72vw] object-contain rounded-2xl shadow-xl shadow-black/70 border border-white/10 gpu-accelerated"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          </div>
        ))}

        {/* Narrative Texts Layer directly over the photo (GPU Accelerated) */}
        {storySlides.map((slide, i) => (
          <div
            key={`text-${slide.id}`}
            data-text={i}
            className="absolute bottom-0 left-0 right-0 z-40 px-6 sm:px-12 md:px-20 pb-10 sm:pb-14 pointer-events-none gpu-accelerated"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 tracking-wider uppercase">
                  <FaCalendarAlt className="w-3.5 h-3.5" />
                  {slide.date}
                </span>
                <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
                  • {slide.tagline}
                </span>
              </div>

              <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {slide.title}
              </h2>

              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-2xl">
                {slide.description}
              </p>

              {slide.highlight && (
                <div className="flex items-start gap-2 text-rose-300 text-xs sm:text-sm italic font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  <FaQuoteLeft className="w-3 h-3 shrink-0 text-rose-400 mt-0.5" />
                  <span>{slide.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vertical Dot Navigation Indicator (Zero clipping with proper padding) */}
        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2.5 pointer-events-auto max-h-[75vh] py-3 px-3 overflow-visible opacity-55 hover:opacity-100 transition-opacity">
          {storySlides.map((_, i) => (
            <div key={`dot-wrapper-${i}`} className="flex items-center justify-center w-4 h-4">
              <button
                data-dot={i}
                onClick={() => scrollToSlideIndex(i)}
                className="w-2.5 h-2.5 rounded-full border border-white/40 transition-all duration-300 cursor-pointer hover:border-rose-400 hover:scale-125"
                style={{
                  backgroundColor: i === 0 ? '#f43f5e' : 'transparent',
                  borderColor: i === 0 ? '#fda4af' : 'rgba(255, 255, 255, 0.35)',
                  boxShadow: i === 0 ? '0 0 8px rgba(244, 63, 94, 0.7)' : 'none',
                }}
                title={`Momento ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
