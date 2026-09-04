import React, { useLayoutEffect, useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { storySlides } from '../data/storyData';
import { FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile address bar show/hide from causing layout jitter
ScrollTrigger.config({
  ignoreMobileResize: true,
});

export default function StoryTimeline() {
  const containerRef = useRef(null);
  const totalSlides = storySlides.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSlideIndex = useCallback((index) => {
    const trigger = ScrollTrigger.getById('story-scroll-trigger');
    if (!trigger) return;
    const target = trigger.start + (index / (totalSlides - 1)) * (trigger.end - trigger.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, [totalSlides]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
          scrub: 0.25,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.min(
              Math.floor(progress * totalSlides + 0.05),
              totalSlides - 1
            );
            setActiveIndex(newIndex);
          },
        },
      });

      // Build slide and text crossfades
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
              y: -18,
              duration: segmentDuration * 0.35,
              ease: 'power1.in',
            },
            pos
          );
        }

        // Crossfade image/video
        if (slideEl) {
          tl.to(
            slideEl,
            {
              opacity: 1,
              duration: segmentDuration * 0.6,
              ease: 'none',
            },
            pos + segmentDuration * 0.15
          );
        }

        // Fade in current text
        if (textEl) {
          tl.fromTo(
            textEl,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: segmentDuration * 0.38,
              ease: 'power1.out',
            },
            pos + segmentDuration * 0.55
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [totalSlides]);

  // Touch Swipe for mobile (YouTube Shorts 1-swipe gesture)
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

      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
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
          // Swiped up -> next slide
          if (currentSlide < totalSlides - 1) {
            scrollToSlideIndex(currentSlide + 1);
          } else {
            const closingEl = document.getElementById('closing-section');
            closingEl?.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (diffY > 35) {
          // Swiped down -> previous slide
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
  }, [totalSlides, scrollToSlideIndex]);

  return (
    <section id="story-timeline" className="relative w-full h-[100dvh] overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-[#0c0a09] select-none"
      >
        {/* Images / Videos Layer */}
        {storySlides.map((slide, i) => (
          <div
            key={slide.id}
            data-slide={i}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: i === 0 ? 1 : 0,
              zIndex: i,
              pointerEvents: i === activeIndex ? 'auto' : 'none',
            }}
          >
            {/* Ambient Lighting Backdrop (Lightweight, 0% GPU penalty) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/70 via-[#13090e]/50 to-[#0c0a09] pointer-events-none" />

            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent z-10 pointer-events-none" />

            {/* Main Media (Image or Video) */}
            <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-8 md:p-12 z-10">
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[72vh] sm:max-h-[82vh] max-w-[92vw] md:max-w-[72vw] object-contain rounded-2xl shadow-xl shadow-black/70 border border-white/10"
                />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-[72vh] sm:max-h-[82vh] max-w-[92vw] md:max-w-[72vw] object-contain rounded-2xl shadow-xl shadow-black/70 border border-white/10"
                />
              )}
            </div>
          </div>
        ))}

        {/* Narrative Texts Layer directly over the photo */}
        {storySlides.map((slide, i) => (
          <div
            key={`text-${slide.id}`}
            data-text={i}
            className="absolute bottom-0 left-0 right-0 z-40 px-5 sm:px-12 md:px-20 pb-8 sm:pb-12 pointer-events-none"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 tracking-wider uppercase">
                  <FaCalendarAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {slide.date}
                </span>
                <span className="text-white/60 text-xs uppercase tracking-widest font-medium">
                  • {slide.tagline}
                </span>
              </div>

              <h2 className="text-white text-xl sm:text-3xl md:text-5xl font-bold leading-tight mb-2 sm:mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {slide.title}
              </h2>

              <p className="text-white/95 text-xs sm:text-base md:text-lg leading-relaxed mb-2.5 sm:mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-2xl font-light sm:font-normal">
                {slide.description}
              </p>

              {slide.highlight && (
                <div className="flex items-start gap-1.5 text-rose-300 text-xs sm:text-sm italic font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <FaQuoteLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-rose-400 mt-0.5" />
                  <span>{slide.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vertical Dot Navigation Indicator (Synchronized via React State + No Clipping) */}
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 pointer-events-auto max-h-[75vh] py-2 px-2 overflow-visible opacity-70 hover:opacity-100 transition-opacity">
          {storySlides.map((_, i) => (
            <div key={`dot-wrapper-${i}`} className="flex items-center justify-center w-3.5 h-3.5">
              <button
                onClick={() => scrollToSlideIndex(i)}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: i === activeIndex ? '#f43f5e' : 'transparent',
                  borderColor: i === activeIndex ? '#fda4af' : 'rgba(255, 255, 255, 0.4)',
                  transform: i === activeIndex ? 'scale(1.35)' : 'scale(1)',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(244, 63, 94, 0.8)' : 'none',
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
