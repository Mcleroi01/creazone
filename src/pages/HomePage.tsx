import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, ChevronRight, Users2, Tag } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { usePosts, useCategories } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { SEO } from '../components/SEO'
import { motion, useAnimation, useInView } from 'framer-motion'

export const HomePage: React.FC = () => {
  const { language } = useApp()
  const { posts, loading } = usePosts(language)
  const { categories } = useCategories(language)


  console.log("Posts:", posts)
  console.log("Loading state:", loading)
  
  // Prendre les 3 derniers articles
  const latestPosts = posts.slice(0, 3)

  const texts = {
    fr: {
      hero: {
        title: 'Explorations Numériques',
        subtitle: 'Découvrez des articles variés sur la tech, la science, la culture et plus encore',
        cta: 'Explorer les articles'
      },
      sections: {
        latest: 'Derniers Articles',
        categories: 'Catégories',
        viewAll: 'Voir tous les articles',
        blog: {
          title: 'Dernières Publications',
          description: 'Nos articles sur divers sujets technologiques et culturels',
          cta: 'Lire le blog'
        },
        tutorials: {
          title: 'Tutoriels',
          description: 'Guides pratiques pour apprendre les technologies modernes',
          cta: 'Voir les tutoriels'
        },
        features: {
          title: 'Pourquoi nous choisir',
          description: 'Découvrez ce qui fait notre différence',
          items: [
            {
              title: 'Contenu varié',
              description: 'Des articles sur la tech, la science, la culture et plus encore'
            },
            {
              title: 'Mise à jour régulière',
              description: 'Du contenu frais chaque semaine'
            },
            {
              title: 'Communauté engagée',
              description: 'Rejoignez notre communauté de lecteurs curieux'
            }
          ]
        }
      }
    },
    en: {
      hero: {
        title: 'Digital Explorations',
        subtitle: 'Discover articles on tech, science, culture, and more',
        cta: 'Explore Articles'
      },
      sections: {
        latest: 'Latest Articles',
        categories: 'Categories',
        viewAll: 'View All Articles',
        blog: {
          title: 'Latest Publications',
          description: 'Our articles on various technological and cultural topics',
          cta: 'Read blog'
        },
        tutorials: {
          title: 'Tutorials',
          description: 'Step-by-step guides to learn modern technologies',
          cta: 'View tutorials'
        },
        features: {
          title: 'Why Choose Us',
          description: 'Discover what makes us different',
          items: [
            {
              title: 'Diverse Content',
              description: 'Articles on tech, science, culture, and more'
            },
            {
              title: 'Regular Updates',
              description: 'Fresh content every week'
            },
            {
              title: 'Engaged Community',
              description: 'Join our community of curious readers'
            }
          ]
        }
      }
    },
    pt: {
      hero: {
        title: 'Explorações Digitais',
        subtitle: 'Descubra artigos sobre tecnologia, ciência, cultura e muito mais',
        cta: 'Explorar Artigos'
      },
      sections: {
        latest: 'Últimos Artigos',
        categories: 'Categorias',
        viewAll: 'Ver Todos os Artigos',
        blog: {
          title: 'Últimas Publicações',
          description: 'Nossos artigos sobre diversos tópicos tecnológicos e culturais',
          cta: 'Ler blog'
        },
        tutorials: {
          title: 'Tutoriais',
          description: 'Guias práticos para aprender tecnologias modernas',
          cta: 'Ver tutoriais'
        },
        features: {
          title: 'Por que nos escolher',
          description: 'Descubra o que nos torna diferentes',
          items: [
            {
              title: 'Conteúdo Diversificado',
              description: 'Artigos sobre tecnologia, ciência, cultura e muito mais'
            },
            {
              title: 'Atualizações Regulares',
              description: 'Conteúdo novo toda semana'
            },
            {
              title: 'Comunidade Engajada',
              description: 'Junte-se à nossa comunidade de leitores curiosos'
            }
          ]
        }
      }
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: { fr: 'Contenu Varié', en: 'Diverse Content', pt: 'Conteúdo Diversificado' },
      description: { 
        fr: 'Découvrez des articles sur la tech, la science, la culture et plus encore',
        en: 'Discover articles on tech, science, culture, and more',
        pt: 'Descubra artigos sobre tecnologia, ciência, cultura e muito mais'
      }
    },
    {
      icon: Code,
      title: { fr: 'Technologies Modernes', en: 'Modern Technologies', pt: 'Tecnologias Modernas' },
      description: { 
        fr: 'Restez à jour avec les dernières avancées technologiques',
        en: 'Stay up-to-date with the latest technological advancements',
        pt: 'Fique por dentro das últimas novidades tecnológicas'
      }
    },
    {
      icon: Users2,
      title: { fr: 'Communauté Engagée', en: 'Engaged Community', pt: 'Comunidade Engajada' },
      description: { 
        fr: 'Échangez avec une communauté de lecteurs passionnés',
        en: 'Connect with a community of passionate readers',
        pt: 'Conecte-se com uma comunidade de leitores apaixonados'
      }
    }
  ]

  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        type: 'tween'
      }
    }
  } as const

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  return (
    <div className="overflow-x-hidden">
      <SEO 
        title={texts[language].hero.title}
        description={texts[language].hero.subtitle}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[url('https://leblogduwebmaster.fr/data/medias/resolutionecrandeveloppeurweb.jpeg')] opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {texts[language].hero.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {texts[language].hero.subtitle}
            </p>
            <div className="mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg animate-gradient"
              >
                {texts[language].hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="group bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title[language]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description[language]}
                </p>
                <div className="mt-4 text-blue-600 dark:text-blue-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">En savoir plus</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              {texts[language].sections.categories}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {language === 'fr' ? 'Explorez nos catégories' : language === 'en' ? 'Explore our categories' : 'Explore nossas categorias'}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  to={`/categories/${category.slug}`}
                  className="block h-full p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-transparent"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-5 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {category.name}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">
                      {language === 'fr' ? 'Explorer' : language === 'en' ? 'Explore' : 'Explorar'}
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              {texts[language].sections.features.title}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {texts[language].sections.features.description}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {texts[language].sections.features.items.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Tutorials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Blog Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {texts[language].sections.blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {texts[language].sections.blog.description}
                </p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  {texts[language].sections.blog.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Tutorials Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Code className="h-16 w-16 text-white" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {texts[language].sections.tutorials.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {texts[language].sections.tutorials.description}
                </p>
                <Link 
                  to="/tutorials" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  {texts[language].sections.tutorials.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
          >
            <div>
              <span className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                {texts[language].sections.latest}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {language === 'fr' ? 'Nos derniers articles' : language === 'en' ? 'Our latest articles' : 'Nossos artigos mais recentes'}
              </h2>
            </div>
            <Link
              to="/blog"
              className="mt-6 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              {texts[language].sections.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {latestPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}