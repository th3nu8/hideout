import { useEffect, useRef } from 'react';

type AdConfig = {
  banner728x90: { key: string };
  banner160x600: { key: string };
  popunder: string;
};

const AD_CONFIGS: Record<string, AdConfig> = {
  'www.usehideout.xyz': {
    banner728x90: { key: '246b6621dfa0cd52945f0b078b6e0675' },
    banner160x600: { key: '3b803b456069ef6e76185ce466ec645b' },
    popunder: '//pl28198315.effectivegatecpm.com/b2/78/ef/b278efb8890fbdaafb94434cdab945bf.js',
  },
  'usehideout.xyz': {
    banner728x90: { key: '246b6621dfa0cd52945f0b078b6e0675' },
    banner160x600: { key: '3b803b456069ef6e76185ce466ec645b' },
    popunder: '//pl28198315.effectivegatecpm.com/b2/78/ef/b278efb8890fbdaafb94434cdab945bf.js',
  },
  'hideout-now.lovable.app': {
    banner728x90: { key: '86a81d9a2c2c68b2d58df6db627edf20' },
    banner160x600: { key: '2109f3d989be1842cff906ee5042285b' },
    popunder: '//pl28198337.effectivegatecpm.com/01/d5/f9/01d5f9812b8d1cc5feb5623b6c0e6087.js',
  },
};

const getAdConfig = (): AdConfig | null => {
  const hostname = window.location.hostname;
  return AD_CONFIGS[hostname] || null;
};

// Component for 728x90 banner
export const Banner728x90 = ({ className = '' }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = getAdConfig();

  useEffect(() => {
    if (!config || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Set atOptions
    (window as any).atOptions = {
      key: config.banner728x90.key,
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${config.banner728x90.key}/invoke.js`;
    container.appendChild(script);
  }, [config]);

  if (!config) return null;

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center min-h-[90px] ${className}`}
    />
  );
};

// Component for 160x600 banner
export const Banner160x600 = ({ className = '' }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = getAdConfig();

  useEffect(() => {
    if (!config || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Set atOptions
    (window as any).atOptions = {
      key: config.banner160x600.key,
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    };

    // Load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${config.banner160x600.key}/invoke.js`;
    container.appendChild(script);
  }, [config]);

  if (!config) return null;

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center min-h-[600px] ${className}`}
    />
  );
};

// Global ads loader (popunder only)
export const GlobalAdsLoader = () => {
  const config = getAdConfig();

  useEffect(() => {
    if (!config) return;

    // Load popunder script
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = config.popunder;
    document.body.appendChild(popunderScript);

    return () => {
      // Cleanup on unmount
      if (popunderScript.parentNode) {
        popunderScript.parentNode.removeChild(popunderScript);
      }
    };
  }, [config]);

  return null;
};

// Check if ads should be shown
export const shouldShowAds = (): boolean => {
  return getAdConfig() !== null;
};
