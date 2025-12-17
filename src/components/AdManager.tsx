import { useEffect } from 'react';

type AdConfig = {
  socialBar: string;
};

const AD_CONFIGS: Record<string, AdConfig> = {
  'www.usehideout.xyz': {
    socialBar: '//eventabsorbedrichard.com/10/09/af/1009af6830a75cb3a01abfe7e90d6a5d.js',
  },
  'usehideout.xyz': {
    socialBar: '//eventabsorbedrichard.com/10/09/af/1009af6830a75cb3a01abfe7e90d6a5d.js',
  },
  'hideout-now.lovable.app': {
    socialBar: '//eventabsorbedrichard.com/81/be/08/81be08761cb56f661f055429c4a52f35.js',
  },
  'hideout-now.lovable.app': {
    socialBar: '//eventabsorbedrichard.com/58/c7/28/58c728d6a72c8f57778b9cac5f3d21c7.js',
  },
};

const getAdConfig = (): AdConfig | null => {
  const hostname = window.location.hostname;
  
  if (AD_CONFIGS[hostname]) {
    return AD_CONFIGS[hostname];
  }
  
  if (hostname.includes('lovable.app') || hostname.includes('lovableproject.com')) {
    return AD_CONFIGS['hideout-now.lovable.app'];
  }
  
  return null;
};

// Global social bar loader
export const GlobalAdsLoader = () => {
  const config = getAdConfig();

  useEffect(() => {
    if (!config) return;

    const socialBarScript = document.createElement('script');
    socialBarScript.async = true;
    socialBarScript.setAttribute('data-cfasync', 'false');
    socialBarScript.src = config.socialBar;
    document.body.appendChild(socialBarScript);

    return () => {
      if (socialBarScript.parentNode) {
        socialBarScript.parentNode.removeChild(socialBarScript);
      }
    };
  }, [config]);

  return null;
};

// Check if ads should be shown
export const shouldShowAds = (): boolean => {
  return getAdConfig() !== null;
};
