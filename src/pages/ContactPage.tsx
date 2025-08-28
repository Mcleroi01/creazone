import { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

// Durée d'affichage du message de statut en millisecondes
const STATUS_MESSAGE_DURATION = 5000;

export const ContactPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ 
    success: boolean; 
    message: string;
  } | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Effet pour masquer automatiquement le message de statut après un délai
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, STATUS_MESSAGE_DURATION);
      
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés pour afficher les erreurs
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler un envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire après un envoi réussi
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      
      setSubmitStatus({
        success: true,
        message: 'Message envoyé avec succès ! Nous vous répondrons dès que possible.',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setSubmitStatus({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SEO 
          title="Contact - Votre Blog" 
          description="Contactez-nous pour toute question ou information supplémentaire. Notre équipe est là pour vous aider."
        />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Contactez-nous
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Une question ? Une suggestion ? Nous sommes à votre écoute.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            {/* Message de statut */}
            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-6 p-4 rounded-md ${
                    submitStatus.success 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <p className="flex items-center">
                    {submitStatus.success ? (
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {submitStatus.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className={`block w-full px-4 py-3 rounded-md border ${
                      errors.name && touched.name 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="Votre nom"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && touched.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`block w-full px-4 py-3 rounded-md border ${
                      errors.email && touched.email 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="votre@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur('message')}
                    className={`block w-full px-4 py-3 rounded-md border ${
                      errors.message && touched.message 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    }`}
                    placeholder="Votre message..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  {errors.message && touched.message ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.message.length}/10 caractères minimum
                    </p>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting 
                      ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le message'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 sm:px-10 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Nous vous répondrons dans les plus brefs délais. En moyenne sous 24-48h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
