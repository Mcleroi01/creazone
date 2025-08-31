import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle: { push: (params?: any) => void }[] & { loaded?: boolean };
  }
}

type AdSenseBannerProps = {
  slot: string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const AdSenseBanner = ({
  slot,
  format = 'auto',
  layout = '',
  layoutKey = '',
  fullWidthResponsive = true,
  className = '',
  style = { display: 'block' },
}: AdSenseBannerProps) => {
  const { pathname } = useLocation();
  const adRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const adPushed = useRef(false);

  useEffect(() => {
    // Ne rien faire côté serveur
    if (typeof window === 'undefined') return;

    // Vérifier si on est sur une page sensible
    const sensitivePaths = ['/admin', '/login', '/signup', '/profile'];
    if (sensitivePaths.some(path => pathname.startsWith(path))) {
      return;
    }

    // Fonction pour charger et afficher l'annonce
    const loadAd = () => {
      if (!adRef.current || adPushed.current) return;

      // Créer un nouvel élément ins pour l'annonce
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.minHeight = '250px'; // Hauteur minimale pour éviter les erreurs
      
      // Ajouter les attributs requis
      ins.setAttribute('data-ad-client', 'ca-pub-3279989468929505');
      ins.setAttribute('data-ad-slot', slot);
      ins.setAttribute('data-ad-format', format);
      ins.setAttribute('data-full-width-responsive', fullWidthResponsive ? 'true' : 'false');
      
      if (layout) ins.setAttribute('data-ad-layout', layout);
      if (layoutKey) ins.setAttribute('data-ad-layout-key', layoutKey);

      // Vider le conteneur et ajouter le nouvel élément ins
      if (adRef.current) {
        adRef.current.innerHTML = '';
        adRef.current.appendChild(ins);
      }

      // S'assurer que l'API AdSense est chargée
      const loadScript = () => {
        if (!adPushed.current) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adPushed.current = true;
          } catch (e) {
            console.error('Error pushing ad:', e);
          }
        } else if (!scriptLoaded.current) {
          const script = document.createElement('script');
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3279989468929505';
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.onload = () => {
            scriptLoaded.current = true;
            loadScript(); // Réessayer après le chargement du script
          };
          script.onerror = () => {
            console.error('Failed to load AdSense script');
          };
          document.head.appendChild(script);
        }
      };

      // Délai pour s'assurer que l'élément est dans le DOM
      const timer = setTimeout(() => {
        loadScript();
      }, 100);

      // Nettoyage
      return () => {
        clearTimeout(timer);
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }
        adPushed.current = false;
      };
    };

    loadAd();

    // Nettoyage lors du démontage
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
      adPushed.current = false;
    };
  }, [pathname, slot, format, layout, layoutKey, fullWidthResponsive]);

  // Ne pas afficher d'annonces sur les pages sensibles
  const sensitivePaths = ['/admin', '/login', '/signup', '/profile'];
  if (sensitivePaths.some(path => pathname.startsWith(path))) {
    return null;
  }

  return (
    <div 
      ref={adRef} 
      className={`ad-container ${className}`}
      style={{
        ...style,
        minHeight: '250px', // Hauteur minimale pour éviter les erreurs
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* L'élément ins sera inséré ici par le useEffect */}
    </div>
  );
};

export default AdSenseBanner;
