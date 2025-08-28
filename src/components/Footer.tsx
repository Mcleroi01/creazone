import React from 'react';
import { useApp } from '../contexts/AppContext';
// Icônes SVG en ligne pour éviter les dépendances externes
const icons = {
  github: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  twitter: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  ),
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  ),
  arrowUp: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )
};

export const Footer: React.FC = () => {
  const { language } = useApp();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const texts = {
    fr: {
      copyright: '© 2025 ModernBlog. Tous droits réservés.',
      builtWith: 'Construit avec amour et les technologies modernes',
      newsletter: {
        title: 'Newsletter',
        description: 'Inscrivez-vous pour recevoir les derniers articles et mises à jour.',
        placeholder: 'Votre adresse email',
        button: "S'abonner"
      },
      links: 'Liens rapides',
      contact: 'Contactez-nous'
    },
    en: {
      copyright: '© 2025 ModernBlog. All rights reserved.',
      builtWith: 'Built with love and modern technologies',
      newsletter: {
        title: 'Newsletter',
        description: 'Subscribe to receive the latest articles and updates.',
        placeholder: 'Your email address',
        button: 'Subscribe'
      },
      links: 'Quick Links',
      contact: 'Contact Us'
    },
    pt: {
      copyright: '© 2025 ModernBlog. Todos os direitos reservados.',
      builtWith: 'Construído com amor e tecnologias modernas',
      newsletter: {
        title: 'Newsletter',
        description: 'Inscreva-se para receber os últimos artigos e atualizações.',
        placeholder: 'Seu endereço de email',
        button: 'Inscrever'
      },
      links: 'Links Rápidos',
      contact: 'Contate-nos'
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CréaZone
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              {texts[language].builtWith}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                {icons.github}
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                {icons.twitter}
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                {icons.linkedin}
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {texts[language].links}
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/" 
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a 
                  href="/blog" 
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  À propos
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {texts[language].newsletter.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {texts[language].newsletter.description}
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder={texts[language].newsletter.placeholder}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                {texts[language].newsletter.button}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} CréaZone. {language === 'fr' ? 'Tous droits réservés.' : language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <a 
              href="/privacy" 
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {language === 'fr' ? 'Confidentialité' : language === 'en' ? 'Privacy' : 'Privacidade'}
            </a>
            <a 
              href="/terms" 
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {language === 'fr' ? 'Conditions' : language === 'en' ? 'Terms' : 'Termos'}
            </a>
            <a 
              href="/cookies" 
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {language === 'fr' ? 'Cookies' : 'Cookies'}
            </a>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={language === 'fr' ? 'Retour en haut' : language === 'en' ? 'Back to top' : 'Voltar ao topo'}
      >
        {icons.arrowUp}
      </button>
    </footer>
  );
};