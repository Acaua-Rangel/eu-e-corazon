import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import HeroSection from './components/HeroSection';
import StoryTimeline from './components/StoryTimeline';
import ClosingSection from './components/ClosingSection';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  const handleStartStory = () => {
    const timelineEl = document.getElementById('story-timeline');
    if (timelineEl) {
      timelineEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadComplete = () => {
    window.scrollTo(0, 0);
    setLoading(false);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  return (
    <>
      {loading && <Loader onLoadComplete={handleLoadComplete} />}
      <main className="min-h-screen w-full bg-[#0c0a09] text-white selection:bg-rose-500 selection:text-white">
        <HeroSection isReady={!loading} onStartStory={handleStartStory} />
        <StoryTimeline />
        <ClosingSection />
      </main>
    </>
  );
}

