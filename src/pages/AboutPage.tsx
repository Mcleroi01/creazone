import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { ArrowRight, Target, MessageSquare, BookOpen, Lightbulb, Users as UsersIcon } from 'lucide-react';
import { TeamSection } from '../components/sections/TeamSection';

// Animation pour les cartes de mission
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const AboutPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pageTitle = "À propos - CréaZone";
  const pageDescription = "Découvrez l'équipe et la mission de CréaZone. Notre engagement pour vous fournir les meilleurs tutoriels et ressources pour vos projets créatifs.";
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        type="website"
        canonicalUrl={pageUrl}
        meta={[
          // Open Graph / Facebook
          { property: 'og:title', content: pageTitle },
          { property: 'og:description', content: pageDescription },
          { property: 'og:url', content: pageUrl },
          { property: 'og:type', content: 'website' },
          
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: pageTitle },
          { name: 'twitter:description', content: pageDescription },
          
          // Autres balises
          { name: 'keywords', content: 'à propos, équipe, mission, valeurs, créazone, histoire, philosophie' }
        ]}
      />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,#fff,transparent)]"></div>
        </div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À propos de nous
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Découvrez l'équipe passionnée derrière notre blog et notre engagement envers l'excellence
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Notre Histoire */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              Notre histoire
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Une passion pour le partage de connaissances
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <div className="prose dark:prose-invert max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed mb-6">
                Fondé en 2023, notre blog est né d'une passion commune pour le partage de connaissances et l'innovation. 
                Nous croyons que l'information de qualité devrait être accessible à tous, et c'est cette conviction qui 
                guide chacune de nos publications.
              </p>
              <p className="text-lg leading-relaxed">
                Notre mission est de fournir du contenu qui non seulement informe, mais aussi inspire et donne les moyens 
                à nos lecteurs de réaliser leur plein potentiel dans le monde numérique en constante évolution.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Notre Mission */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              <Lightbulb className="mr-2 h-4 w-4" />
              Notre Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Notre engagement envers l'excellence
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contenu de Qualité</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous nous engageons à fournir des articles bien documentés, précis et à jour pour vous offrir la meilleure information possible.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Communauté</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous croyons en la force de la communauté et encourageons les échanges constructifs entre nos lecteurs et nos auteurs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous restons à l'affût des dernières tendances technologiques pour vous offrir un contenu pertinent et innovant.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Notre Équipe - Composant dynamique */}
        <TeamSection />

        {/* Notre Engagement */}
        <motion.section 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-4">
              <Target className="mr-2 h-4 w-4" />
              Notre engagement
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ce en quoi nous croyons
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Qualité</h3>
                <p className="text-blue-100">Un contenu rigoureusement vérifié et mis à jour régulièrement</p>
              </div>
              
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-blue-100">Toujours à la pointe des dernières tendances technologiques</p>
              </div>
              
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Communauté</h3>
                <p className="text-blue-100">Une approche centrée sur les besoins de nos lecteurs</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
        >
          <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Que vous ayez des questions, des suggestions ou que vous souhaitiez collaborer avec nous, nous serions ravis d'avoir de vos nouvelles.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white group"
          >
            <a href="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
