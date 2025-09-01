import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Type for the adsbygoogle array
type AdQueueFunction = () => void;
type AdSenseQueue = AdQueueFunction[] & { push: (params: any) => number; loaded?: boolean };

declare global {
  interface Window {
    adsbygoogle: AdSenseQueue;
  }
}

// Helper to safely access window.adsbygoogle
const getAdsByGoogle = (): AdSenseQueue => {
  if (typeof window === 'undefined') {
    return [] as unknown as AdSenseQueue;
  }
  if (!window.adsbygoogle) {
    const queue = (() => {}) as unknown as AdSenseQueue;
    // Properly type the push method to return number
    queue.push = function(params: any): number {
      return Array.prototype.push.call(this, params);
    };
    window.adsbygoogle = queue;
  }
  return window.adsbygoogle;
};

type AdFormat = 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid';
type AdLayout = 'in-article' | 'in-feed' | '';

export interface AdSenseBannerProps {
  slot: string;
  format?: AdFormat;
  layout?: AdLayout;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isTestMode?: boolean;
  onError?: (error: Error) => void;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot,
  format = 'auto',
  layout = '',
  layoutKey = '',
  fullWidthResponsive = true,
  className = '',
  style = { display: 'block' },
  isTestMode = process.env.NODE_ENV !== 'production',
  onError,
}) => {
  const { pathname } = useLocation();
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const adPushed = useRef(false);
  const adTimer = useRef<NodeJS.Timeout>();

  const handleError = useCallback((error: Error) => {
    console.error('AdSense Error:', error);
    onError?.(error);
  }, [onError]);

  // Load AdSense script
  const loadAdScript = useCallback(() => {
    if (scriptLoaded.current || typeof window === 'undefined') return;

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3279989468929505${isTestMode ? '&adtest=on' : ''}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        scriptLoaded.current = true;
        resolve();
      };
      
      script.onerror = () => {
        const error = new Error('Failed to load AdSense script');
        handleError(error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }, [handleError, isTestMode]);

  // Initialize ad
  const initAd = useCallback(async () => {
    if (!adRef.current || adPushed.current || typeof window === 'undefined') return;

    try {
      // Load script if not already loaded
      if (!scriptLoaded.current) {
        await loadAdScript();
      }

      // Create ad container
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.minHeight = '250px';
      
      // Set required attributes
      ins.setAttribute('data-ad-client', 'ca-pub-3279989468929505');
      ins.setAttribute('data-ad-slot', slot);
      ins.setAttribute('data-ad-format', format);
      ins.setAttribute('data-full-width-responsive', fullWidthResponsive ? 'true' : 'false');
      
      // Set optional attributes
      if (layout) ins.setAttribute('data-ad-layout', layout);
      if (layoutKey) ins.setAttribute('data-ad-layout-key', layoutKey);
      if (isTestMode) {
        ins.setAttribute('data-adtest', 'on');
      }

      // Clear and append new ad element
      if (adRef.current) {
        adRef.current.innerHTML = '';
        adRef.current.appendChild(ins);
      }

      // Push ad to Google's queue
      const adsbygoogle = getAdsByGoogle();
      adsbygoogle.push({});
      adPushed.current = true;
      
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [slot, format, layout, layoutKey, fullWidthResponsive, isTestMode, loadAdScript, handleError]);

  // Handle ad loading with retry mechanism
  const loadAd = useCallback(() => {
    // Clear any existing timer
    if (adTimer.current) {
      clearTimeout(adTimer.current);
    }

    // Set a new timer to load the ad
    adTimer.current = setTimeout(() => {
      initAd().catch(error => {
        console.error('Failed to initialize ad:', error);
      });
    }, 100); // Small delay to ensure DOM is ready
  }, [initAd]);

  // Check if we should show ads on this page
  const shouldShowAd = useCallback(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return false;

    // Skip on sensitive paths
    const sensitivePaths = ['/admin', '/login', '/signup', '/profile', '/checkout'];
    if (sensitivePaths.some(path => pathname.startsWith(path))) {
      return false;
    }

    // Additional checks for test mode
    if (isTestMode) {
      console.log('[AdSense] Test mode enabled');
    }

    return true;
  }, [pathname, isTestMode]);

  // Effect to handle ad loading and cleanup
  useEffect(() => {
    if (!shouldShowAd()) return;

    // Set up Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAd();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px' } // Load when ad is 200px from viewport
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    // Cleanup
    return () => {
      if (adTimer.current) {
        clearTimeout(adTimer.current);
      }
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
      observer.disconnect();
    };
  }, [loadAd, shouldShowAd]);

  // Don't render on sensitive pages
  if (!shouldShowAd()) {
    return null;
  }

  return (
    <div 
      ref={adRef} 
      className={`ad-container ${className}`}
      style={{
        ...style,
        minHeight: '250px',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
      data-ad-slot={slot}
      data-testid="adsense-banner"
    >
      {/* AdSense script will inject content here */}
      {isTestMode && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          padding: '10px',
          border: '1px dashed #ccc',
          backgroundColor: '#f9f9f9',
          zIndex: 1000,
        }}>
          AdSense Ad: {slot}
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {format} {layout && `| ${layout}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdSenseBanner;
