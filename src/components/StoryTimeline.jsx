import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { storySlides } from '../data/storyData';
import { FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';

gsap.registerPlugin(Observer);

export default function StoryTimeline() {
  const containerRef = useRef(null);
  const totalSlides = storySlides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const observerRef = useRef(null);

  const goToSlide = useCallback((toIndex) => {
    if (isAnimating.current || toIndex === currentIndex.current) return;
    if (toIndex < 0 || toIndex >= totalSlides) return;

    isAnimating.current = true;
    const fromIndex = currentIndex.current;
    const direction = toIndex > fromIndex ? 1 : -1;

    const fromSlide = containerRef.current?.querySelector(`[data-slide="${fromIndex}"]`);
    const toSlide = containerRef.current?.querySelector(`[data-slide="${toIndex}"]`);
    const fromText = containerRef.current?.querySelector(`[data-text="${fromIndex}"]`);
    const toText = containerRef.current?.querySelector(`[data-text="${toIndex}"]`);

    if (fromSlide) fromSlide.style.zIndex = '10';
    if (toSlide) toSlide.style.zIndex = '20';

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        currentIndex.current = toIndex;
        setActiveIndex(toIndex);
        // Cool-down buffer to absorb fast wheel momentum
        setTimeout(() => {
          isAnimating.current = false;
        }, 220);
      },
    });

    // 1. Fade out current text
    if (fromText) {
      tl.to(
        fromText,
        {
          opacity: 0,
          y: direction * -20,
          duration: 0.28,
          ease: 'power2.in',
        },
        0
      );
    }

    // 2. Crossfade images
    if (fromSlide) {
      tl.to(
        fromSlide,
        {
          opacity: 0,
          scale: 0.98,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        0.05
      );
    }

    if (toSlide) {
      tl.fromTo(
        toSlide,
        {
          opacity: 0,
          scale: 1.03,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.08
      );
    }

    // 3. Fade in new text
    if (toText) {
      tl.fromTo(
        toText,
        {
          opacity: 0,
          y: direction * 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
        },
        0.22
      );
    }
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    if (isAnimating.current) return;
    if (currentIndex.current < totalSlides - 1) {
      goToSlide(currentIndex.current + 1);
    } else {
      // Last slide reached: proceed to closing section
      const closingEl = document.getElementById('closing-section');
      if (closingEl) {
        observerRef.current?.disable();
        closingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [goToSlide, totalSlides]);

  const handlePrev = useCallback(() => {
    if (isAnimating.current) return;
    if (currentIndex.current > 0) {
      goToSlide(currentIndex.current - 1);
    } else {
      // First slide: return to hero section
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        observerRef.current?.disable();
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [goToSlide]);

  useLayoutEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    // Create GSAP Observer for strictly discrete slide steps (1 step per gesture)
    const obs = Observer.create({
      target,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 15,
      preventDefault: true,
      onDown: () => handleNext(),
      onUp: () => handlePrev(),
    });

    observerRef.current = obs;

    return () => {
      obs.kill();
    };
  }, [handleNext, handlePrev]);

  // Activate/Deactivate observer when section is in view
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            observerRef.current?.enable();
          } else {
            observerRef.current?.disable();
          }
        });
      },
      { threshold: [0.1, 0.45, 0.8] }
    );

    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = containerRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      if (!inView) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section id="story-timeline" className="relative w-full h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-[#0c0a09] select-none"
      >
        {/* Images Layer */}
        {storySlides.map((slide, i) => (
          <div
            key={slide.id}
            data-slide={i}
            className="absolute inset-0 w-full h-full transition-opacity duration-300"
            style={{
              opacity: i === 0 ? 1 : 0,
              zIndex: i === 0 ? 20 : 10,
              pointerEvents: i === activeIndex ? 'auto' : 'none',
            }}
          >
            {/* Blurred backdrop for portrait images */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-2xl scale-110 opacity-35"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent z-10" />

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 z-10">
              <img
                src={slide.image}
                alt={slide.title}
                className="max-h-[82vh] max-w-[92vw] md:max-w-[72vw] object-contain rounded-2xl shadow-2xl shadow-black/80 border border-white/10"
                loading="eager"
              />
            </div>
          </div>
        ))}

        {/* Narrative Texts Layer directly over the photo */}
        {storySlides.map((slide, i) => (
          <div
            key={`text-${slide.id}`}
            data-text={i}
            className="absolute bottom-0 left-0 right-0 z-40 px-6 sm:px-12 md:px-20 pb-10 sm:pb-14 pointer-events-none"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-400 tracking-wider uppercase">
                  <FaCalendarAlt className="w-3.5 h-3.5" />
                  {slide.date}
                </span>
                <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
                  • {slide.tagline}
                </span>
              </div>

              <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
                {slide.title}
              </h2>

              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-2xl">
                {slide.description}
              </p>

              {slide.highlight && (
                <div className="flex items-start gap-2 text-rose-300 text-xs sm:text-sm italic font-serif drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <FaQuoteLeft className="w-3 h-3 shrink-0 text-rose-400 mt-0.5" />
                  <span>{slide.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vertical Dot Navigation Indicator */}
        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-auto max-h-[70vh] overflow-y-auto py-2 opacity-50 hover:opacity-100 transition-opacity">
          {storySlides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => goToSlide(i)}
              className="w-2.5 h-2.5 rounded-full border transition-all duration-300 cursor-pointer hover:border-rose-400 hover:scale-125"
              style={{
                backgroundColor: i === activeIndex ? '#f43f5e' : 'transparent',
                borderColor: i === activeIndex ? '#fda4af' : 'rgba(255, 255, 255, 0.35)',
                transform: i === activeIndex ? 'scale(1.35)' : 'scale(1)',
              }}
              title={`Momento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
