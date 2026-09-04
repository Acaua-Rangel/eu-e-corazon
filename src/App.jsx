import React, { useState } from 'react';
import Loader from './components/Loader';
import HeroSection from './components/HeroSection';
import StoryTimeline from './components/StoryTimeline';
import ClosingSection from './components/ClosingSection';

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleStartStory = () => {
    const timelineEl = document.getElementById('story-timeline');
    if (timelineEl) {
      timelineEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {loading && <Loader onLoadComplete={() => setLoading(false)} />}
      <main className="min-h-screen w-full bg-[#0c0a09] text-white selection:bg-rose-500 selection:text-white">
        <HeroSection isReady={!loading} onStartStory={handleStartStory} />
        <StoryTimeline />
        <ClosingSection />
      </main>
    </>
  );
}
