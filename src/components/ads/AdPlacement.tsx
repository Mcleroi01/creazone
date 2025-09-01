import React, { useEffect, useState } from 'react';
import { AdSenseBanner } from './AdSenseBanner';

type AdType = 'banner' | 'rectangle' | 'in-article' | 'in-feed';

interface AdPlacementProps {
  type?: AdType;
  className?: string;
  minContentLength?: number; // Minimum content length required to show ads
  isTestMode?: boolean; // Enable test mode to verify ad rendering without real ads
}

// Error boundary component for ad components
class AdErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Ad rendering failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail without showing anything
    }
    return this.props.children;
  }
}

// Check if there's sufficient content on the page
export const hasSufficientContent = (minLength: number = 500): boolean => {
  if (typeof document === 'undefined') return false;
  
  const mainContent = document.querySelector('main, article, .content') || document.body;
  const textContent = mainContent.textContent || '';
  return textContent.trim().length >= minLength;
};

export const AdPlacement: React.FC<AdPlacementProps> = ({ 
  type = 'banner',
  className = '',
  minContentLength = 500,
  isTestMode = process.env.NODE_ENV !== 'production'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isContentSufficient, setIsContentSufficient] = useState(false);
  const [hasError, setHasError] = useState(false);

  const adConfigs = {
    banner: {
      slot: isTestMode ? 'test-banner' : '1234567890', // Replace with your actual AdSense slot ID
      format: 'auto' as const,
      layout: '' as const,
      layoutKey: '',
      className: 'w-full my-8',
      minContentLength: 300
    },
    rectangle: {
      slot: isTestMode ? 'test-rectangle' : '0987654321',
      format: 'auto' as const,
      layout: '' as const,
      layoutKey: '',
      className: 'my-8 mx-auto max-w-[300px]',
      minContentLength: 200
    },
    'in-article': {
      slot: isTestMode ? 'test-in-article' : '1122334455',
      format: 'fluid' as const,
      layout: 'in-article' as const,
      layoutKey: '',
      className: 'my-8',
      minContentLength: 800
    },
    'in-feed': {
      slot: isTestMode ? 'test-in-feed' : '5566778899',
      format: 'fluid' as const,
      layout: '' as const,
      layoutKey: 'in-feed',
      className: 'my-8',
      minContentLength: 600
    },
  };

  // Check content sufficiency and set visibility
  useEffect(() => {
    const checkContent = () => {
      const sufficient = hasSufficientContent(adConfigs[type]?.minContentLength || minContentLength);
      setIsContentSufficient(sufficient);
      setIsVisible(sufficient);
    };

    // Initial check
    checkContent();

    // Check again after content loads
    const timer = setTimeout(checkContent, 1000);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, [type, minContentLength]);

  // Handle ad loading errors
  const handleAdError = (error: Error) => {
    console.error('Ad loading error:', error);
    setHasError(true);
  };

  const config = adConfigs[type] || adConfigs.banner;

  // Don't render if there's insufficient content or an error occurred
  if (!isVisible || !isContentSufficient || hasError) {
    return null;
  }

  return (
    <AdErrorBoundary>
      <div 
        className={`ad-placement ${config.className} ${className}`}
        data-ad-type={type}
        data-testid={`ad-${type}`}
      >
        <AdSenseBanner
          slot={config.slot}
          format={config.format}
          layout={config.layout}
          layoutKey={config.layoutKey}
          onError={handleAdError}
          isTestMode={isTestMode}
        />
      </div>
    </AdErrorBoundary>
  );
};

export default AdPlacement;
