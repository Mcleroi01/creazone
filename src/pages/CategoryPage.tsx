import React from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SEO } from '../components/SEO'
import { AdPlacement } from '../components/ads/AdPlacement'

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const { language } = useApp()
  const { posts, loading, error } = usePosts(language, category)

  const texts = {
    fr: {
      title: (cat: string) => `Catégorie: ${cat}`,
      description: (cat: string) => `Articles dans la catégorie ${cat}`,
      count: (count: number) => `${count} article${count > 1 ? 's' : ''} dans cette catégorie`
    },
    en: {
      title: (cat: string) => `Category: ${cat}`,
      description: (cat: string) => `Articles in ${cat} category`,
      count: (count: number) => `${count} post${count > 1 ? 's' : ''} in this category`
    },
    pt: {
      title: (cat: string) => `Categoria: ${cat}`,
      description: (cat: string) => `Artigos na categoria ${cat}`,
      count: (count: number) => `${count} artigo${count > 1 ? 's' : ''} nesta categoria`
    }
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message="Category not found" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={texts[language].title(category)}
        description={texts[language].description(category)}
      />
      
      {/* Bannière publicitaire en haut de la page */}
      <div className="mb-10">
        <AdPlacement type="banner" />
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 capitalize">
          {texts[language].title(category)}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {texts[language].description(category)}
        </p>
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {texts[language].count(posts.length)}
          </p>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No posts found in this category.
          </p>
        </div>
      ) : (
        <>
          {/* Bannière publicitaire dans le flux */}
          <div className="mb-10">
            <AdPlacement type="in-feed" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          </div>
          
          {/* Bannière publicitaire en bas de page */}
          <div className="mt-12">
            <AdPlacement type="banner" />
          </div>
        </>
      )}
    </div>
  )
}