import { useEffect, useRef } from 'react';

type AdConfig = {
  banner728x90: { key: string; src: string };
  banner160x600: { key: string; src: string };
  socialBar: string;
};

const AD_CONFIGS: Record<string, AdConfig> = {
  'hideout-now.lovable.app': {
    banner728x90: { 
      key: '86a81d9a2c2c68b2d58df6db627edf20',
      src: '//eventabsorbedrichard.com/86a81d9a2c2c68b2d58df6db627edf20/invoke.js'
    },
    banner160x600: { 
      key: '2109f3d989be1842cff906ee5042285b',
      src: '//eventabsorbedrichard.com/2109f3d989be1842cff906ee5042285b/invoke.js'
    },
    socialBar: '//eventabsorbedrichard.com/81/be/08/81be08761cb56f661f055429c4a52f35.js',
  },
  'www.usehideout.xyz': {
    banner728x90: { 
      key: '246b6621dfa0cd52945f0b078b6e0675',
      src: '//eventabsorbedrichard.com/246b6621dfa0cd52945f0b078b6e0675/invoke.js'
    },
    banner160x600: { 
      key: '3b803b456069ef6e76185ce466ec645b',
      src: '//eventabsorbedrichard.com/3b803b456069ef6e76185ce466ec645b/invoke.js'
    },
    socialBar: '//eventabsorbedrichard.com/10/09/af/1009af6830a75cb3a01abfe7e90d6a5d.js',
  },
  'usehideout.xyz': {
    banner728x90: { 
      key: '246b6621dfa0cd52945f0b078b6e0675',
      src: '//eventabsorbedrichard.com/246b6621dfa0cd52945f0b078b6e0675/invoke.js'
    },
    banner160x600: { 
      key: '3b803b456069ef6e76185ce466ec645b',
      src: '//eventabsorbedrichard.com/3b803b456069ef6e76185ce466ec645b/invoke.js'
    },
    socialBar: '//eventabsorbedrichard.com/10/09/af/1009af6830a75cb3a01abfe7e90d6a5d.js',
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
    script.src = config.banner728x90.src;
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
    script.src = config.banner160x600.src;
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

// Sticky bottom banner component
export const StickyBottomBanner = () => {
  const config = getAdConfig();
  if (!config) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-background/80 backdrop-blur-sm py-2 border-t border-border">
      <Banner728x90 />
    </div>
  );
};

// Social bar component - loads on every page
export const SocialBar = () => {
  const config = getAdConfig();

  useEffect(() => {
    if (!config) return;

    // Check if script already exists
    const existingScript = document.getElementById('social-bar-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Load the social bar script
    const script = document.createElement('script');
    script.id = 'social-bar-script';
    script.type = 'text/javascript';
    script.src = config.socialBar;
    document.body.appendChild(script);
  }, [config]);

  if (!config) return null;

  return null;
};

// Global ads loader (for social bar on all pages)
export const GlobalAdsLoader = () => {
  return <SocialBar />;
};

// Check if ads should be shown
export const shouldShowAds = (): boolean => {
  return getAdConfig() !== null;
};
