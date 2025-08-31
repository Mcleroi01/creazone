import { useEffect } from 'react';

export const useAdSense = () => {
  useEffect(() => {
    // Vérifier si on est côté navigateur et que l'API AdSense n'est pas déjà chargée
    if (typeof window === 'undefined' || (window as any).adsbygoogle) {
      return;
    }

    // Charger le script AdSense
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3279989468929505';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      // Initialiser les annonces après le chargement du script
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Erreur lors de l\'initialisation d\'AdSense:', e);
      }
    };

    script.onerror = () => {
      console.error('Erreur lors du chargement du script AdSense');
    };

    document.head.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default useAdSense;
