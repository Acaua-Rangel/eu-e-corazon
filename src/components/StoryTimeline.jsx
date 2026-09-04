import React, { useLayoutEffect, useRef } from 'react';
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
      // Sensibilidade calibrada: 240px de scroll por slide
      const scrollPerSlide = 240;
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
          scrub: 0.35,
          onUpdate: (self) => {
            const progress = self.progress;
            const activeIndex = Math.min(
              Math.floor(progress * totalSlides),
              totalSlides - 1
            );

            // Update dots
            const dots = containerRef.current.querySelectorAll('[data-dot]');
            dots.forEach((dot, j) => {
              if (j === activeIndex) {
                dot.style.backgroundColor = '#f43f5e';
                dot.style.borderColor = '#fda4af';
                dot.style.transform = 'scale(1.35)';
              } else {
                dot.style.backgroundColor = 'transparent';
                dot.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                dot.style.transform = 'scale(1)';
              }
            });
          },
        },
      });

      // Build crossfade and text transitions for each slide
      for (let i = 1; i < totalSlides; i++) {
        const slideEl = containerRef.current.querySelector(`[data-slide="${i}"]`);
        const textEl = containerRef.current.querySelector(`[data-text="${i}"]`);
        const prevTextEl = containerRef.current.querySelector(`[data-text="${i - 1}"]`);
        const pos = (i - 1) * segmentDuration;

        // Fade out previous text
        tl.to(
          prevTextEl,
          {
            opacity: 0,
            y: -30,
            duration: segmentDuration * 0.4,
            ease: 'power1.in',
          },
          pos
        );

        // Crossfade image
        tl.to(
          slideEl,
          {
            opacity: 1,
            duration: segmentDuration * 0.6,
            ease: 'none',
          },
          pos + segmentDuration * 0.2
        );

        // Fade in new text
        tl.fromTo(
          textEl,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: segmentDuration * 0.4,
            ease: 'power1.out',
          },
          pos + segmentDuration * 0.6
        );
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

  return (
    <section id="story-timeline" className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-screen h-screen overflow-hidden bg-[#0c0a09]"
      >
        {/* Images Layer */}
        {storySlides.map((slide, i) => (
          <div
            key={slide.id}
            data-slide={i}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i }}
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
              data-dot={i}
              onClick={() => scrollToSlideIndex(i)}
              className="w-2.5 h-2.5 rounded-full border border-white/40 transition-all duration-300 cursor-pointer hover:border-rose-400 hover:scale-125"
              style={{
                backgroundColor: i === 0 ? '#f43f5e' : 'transparent',
                borderColor: i === 0 ? '#fda4af' : 'rgba(255, 255, 255, 0.35)',
              }}
              title={`Momento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
