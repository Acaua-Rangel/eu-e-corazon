import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { storySlides } from "../data/storyData";

const LogoSVGLoader = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();

      gsap.fromTo(
        path,
        {
          strokeDasharray: length,
          strokeDashoffset: length,
        },
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
        }
      );
    }
  }, []);

  return (
    <div className="relative flex items-center justify-center mb-8">
      <svg
        width="240"
        height="170"
        viewBox="0 0 106 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-[180px] h-[130px] sm:w-[240px] sm:h-[170px] drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
      >
        <path
          ref={pathRef}
          d="M26.4818 74C31.3653 38.8875 33.2531 -24.9829 47.969 14.4152C61.7465 51.301 69.5188 87.0269 54.6811 68.3235C22.8868 28.2457 -68.3957 27.8893 104 27.8893"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default function Loader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Baixando os dados do site...");
  const loaderRef = useRef(null);

  useEffect(() => {
    const imagesToLoad = storySlides.map((s) => s.image);
    const totalAssets = imagesToLoad.length;
    let loadedCount = 0;

    const handleAssetLoad = () => {
      loadedCount++;
      const currentPercent = Math.min(
        Math.round((loadedCount / totalAssets) * 100),
        100
      );
      setProgress(currentPercent);

      if (currentPercent < 50) {
        setStatusText("Baixando os dados do site...");
      } else if (currentPercent < 90) {
        setStatusText("Carregando cada detalhe...");
      } else if (currentPercent < 100) {
        setStatusText("Finalizando o carregamento...");
      } else {
        setStatusText("Tudo pronto!");
      }

      // Only finish when 100% of all images are loaded into browser cache
      if (loadedCount >= totalAssets) {
        setTimeout(() => {
          if (loaderRef.current) {
            gsap.to(loaderRef.current, {
              opacity: 0,
              scale: 1.04,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: () => {
                if (onLoadComplete) onLoadComplete();
              },
            });
          }
        }, 500);
      }
    };

    // Preload all images
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleAssetLoad;
      img.onerror = handleAssetLoad; // prevent stall if one fails
    });

    if (document.fonts) {
      document.fonts.ready.catch(() => {});
    }
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-rose-950 via-red-900 to-rose-900 px-6 select-none"
    >
      {/* Background glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-white/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm text-center">
        {/* White signature logo */}
        <LogoSVGLoader />

        {/* Progress Bar Container */}
        <div className="w-full h-2.5 bg-black/40 rounded-full border border-white/20 p-0.5 overflow-hidden backdrop-blur-md mb-3 shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,255,255,0.85)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex items-center justify-between w-full px-1 text-xs font-mono text-white/75 mb-2">
          <span>{progress}%</span>
          <span>100%</span>
        </div>

        {/* Message below progress bar */}
        <p className="text-white/85 text-xs sm:text-sm tracking-wide font-light animate-pulse mt-1">
          {statusText}
        </p>
      </div>
    </div>
  );
}
