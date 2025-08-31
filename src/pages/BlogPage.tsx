import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { usePosts } from '../hooks/usePosts';
import { PostSkeleton } from '../components/PostSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { SEO } from '../components/SEO';
import { AdPlacement } from '../components/ads/AdPlacement';

export const BlogPage: React.FC = () => {
  const { setLanguage } = useApp();
  
  // Forcer la langue en français
  useEffect(() => {
    setLanguage('fr');
  }, [setLanguage]);
  
  const { posts, loading, error } = usePosts('fr');

  const texts = {
    title: 'Tous les Articles',
    description: 'Découvrez tous nos articles et tutoriels',
    count: (count: number) => `${count} article${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title={texts.title} 
        description={texts.description} 
      />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {texts.title}
            </h1>
            <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
              {texts.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bannière publicitaire en haut de la page */}
        <div className="mb-10">
          <AdPlacement type="banner" />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tous les articles
            </h2>
            <div className="absolute -bottom-1 left-0 w-16 h-1 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {!loading && texts.count(posts.length)}
            </p>
          </div>
        </div>

        {loading ? (
          <PostSkeleton count={6} />
        ) : (
          <>
            {/* Bannière publicitaire avant la liste des articles */}
            <div className="mb-10">
              <AdPlacement type="in-feed" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.cover_image_url || '/placeholder.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">
                        {post.author?.display_name.charAt(0) || 'A'}
                      </div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {post.author?.display_name || 'Auteur inconnu'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={`/blog/${post.slug}`} 
                  className="absolute inset-0 z-10"
                  aria-label={`Lire l'article : ${post.title}`}
                />
              </motion.article>
            ))}
            </div>
          </>
        )}
        
        {/* Bannière publicitaire en bas de la page */}
        <div className="mt-12">
          <AdPlacement type="banner" />
        </div>
      </div>
    </div>
  );
};