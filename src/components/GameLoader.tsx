import { useEffect, useState } from "react";

interface GameLoaderProps {
  gameName: string;
  gameImage: string;
  onLoadComplete: () => void;
}

export const GameLoader = ({ gameName, gameImage, onLoadComplete }: GameLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const duration = 15000; // 15 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Start fade out after reaching 100%
        setTimeout(() => {
          setIsFadingOut(true);
          // Complete after fade animation
          setTimeout(() => {
            onLoadComplete();
          }, 1000);
        }, 300);
      }
    };

    animate();
  }, [onLoadComplete]);

  const percentage = Math.floor(progress * 100);
  const circumference = 930;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-1000 rounded-lg overflow-hidden ${
        isFadingOut ? 'opacity-0 bg-[#16a249]' : 'bg-[#0a0a0a]'
      }`}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-12">
        <div className="relative w-[280px] h-[280px]">
          {/* Percentage Display */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-[#16a249] z-10"
            style={{
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 3px 3px 10px rgba(0, 0, 0, 0.7)'
            }}>
            {percentage}%
          </div>

          {/* Game Image */}
          <img
            src={gameImage}
            alt={gameName}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-[1] bg-[#1a1a1a] border-[3px] border-[#1a1a1a]"
            style={{ filter: 'blur(2px)' }}
            onError={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          />

          {/* Loading Ring */}
          <div className="absolute -top-3 -left-3 w-[304px] h-[304px] z-[2]">
            <svg
              className="w-full h-full -rotate-90 overflow-visible"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              {/* Background Circle */}
              <circle
                cx="152"
                cy="152"
                r="148"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="6"
                strokeLinecap="butt"
              />
              {/* Progress Circle */}
              <circle
                cx="152"
                cy="152"
                r="148"
                fill="none"
                stroke="#16a249"
                strokeWidth="6"
                strokeLinecap="butt"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(22, 162, 73, 0.8)) drop-shadow(0 0 20px rgba(22, 162, 73, 0.4)) drop-shadow(0 0 30px rgba(22, 162, 73, 0.2))',
                  strokeLinejoin: 'miter',
                  transition: 'stroke-dashoffset 0.1s linear'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Game Name */}
        <div className="text-white text-5xl font-semibold text-center tracking-tight">
          {gameName}
        </div>
      </div>

      {/* Bottom Loading Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#1a1a1a]">
        <div 
          className="h-full bg-[#16a249] transition-all duration-100 ease-linear"
          style={{ 
            width: `${percentage}%`,
            boxShadow: '0 0 12px rgba(22, 162, 73, 0.8), 0 0 20px rgba(22, 162, 73, 0.4)'
          }}
        />
      </div>
    </div>
  );
};
