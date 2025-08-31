// Déclaration des types globaux pour TypeScript
declare global {
  interface Window {
    adsbygoogle: { push: (params?: any) => void }[];
  }
}

export {}; // Ceci est nécessaire pour que le fichier soit traité comme un module
