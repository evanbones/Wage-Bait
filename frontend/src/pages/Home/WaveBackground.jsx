import React, { useEffect, useState } from "react";

const WaveBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const maxScroll = 900;
  const progress = Math.min(scrollY / maxScroll, 1);

  // parallax using vh to stay relative to screen height
  const backWaveTranslate = 95 - (progress * 75); 
  const frontWaveTranslate = 90 - (progress * 70); 

  return (
    <div className="hidden sm:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* back wave layer */}
      <div 
        className="absolute top-0 left-[-250%] w-[600%] h-[150vh] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${backWaveTranslate}vh)` }}
      >
        <svg 
          className="w-full h-[350px] animate-wave-reverse opacity-100" 
          viewBox="0 0 1200 300" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,150 C100,20 200,280 300,150 C400,20 500,280 600,150 C700,20 800,280 900,150 C1000,20 1100,280 1200,150 V300 H0 Z" 
            fill="#9abddc"
          />
        </svg>
        <div className="w-full h-full bg-[#9abddc] opacity-80 mt-[-2px]" />
      </div>

      {/* front wave layer */}
      <div 
        className="absolute top-0 left-[-250%] w-[600%] h-[150vh] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${frontWaveTranslate}vh)` }}
      >
        <svg 
          className="w-full h-[300px] animate-wave opacity-80" 
          viewBox="0 0 1200 300" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,150 C100,280 200,20 300,150 C400,280 500,20 600,150 C700,280 800,20 900,150 C1000,280 1100,20 1200,150 V300 H0 Z" 
            fill="#d1e5f4"
          />
        </svg>
        <div className="w-full h-full bg-[#d1e5f4] opacity-80 mt-[-2px]" />
      </div>
    </div>
  );
};

export default WaveBackground;
