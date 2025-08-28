import { useState, useEffect, useCallback } from 'react'
import { supabase, Post, Language, Tag, Category } from '../lib/supabase'

export interface PostWithRelations extends Omit<Post, 'tags' | 'category'> {
  tags: Tag[]
  category: string
  categories?: Category[]
  category_name?: string
  comments_count?: number
}

export const usePosts = (language: Language, categoryName?: string) => {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      
      // 1. Récupérer l'ID de la catégorie si un nom est fourni
      let categoryId: number | null = null
      if (categoryName) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${categoryName}%`)
          .maybeSingle()
        
        if (categoryError) console.error('Erreur lors de la récupération de la catégorie:', categoryError)
        if (categoryData) {
          categoryId = categoryData.id
        } else {
          console.warn(`Aucune catégorie trouvée pour: ${categoryName}`)
        }
      }
      
      // 2. Construire la requête de base pour les articles publiés
      console.log('Construction de la requête pour la langue:', language)
      
      // D'abord, récupérer les articles publiés
      let query = supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
      
        .order('published_at', { ascending: false })
      
      // 3. Filtrer par catégorie si nécessaire
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      // 4. Exécuter la requête
      console.log('Exécution de la requête pour les articles...')
      const { data: postsData, error: postsError } = await query
      
      if (postsError) {
        console.error('Erreur lors de la récupération des articles:', postsError)
        throw postsError
      }
      
      // 5. Si aucun article trouvé, terminer
      console.log('Résultats de la requête:', postsData)
      if (!postsData || postsData.length === 0) {
        console.warn('Aucun article trouvé avec les critères actuels')
        setPosts([])
        setLoading(false)
        return
      }

      // 6. Récupérer les catégories pour tous les articles en une seule requête
      const categoryIds = [...new Set(postsData.map(p => p.category_id).filter(Boolean))]
      let categoriesMap = new Map<number, {name: string}>()
      
      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds as number[])
        
        if (categoriesError) {
          console.error('Erreur lors de la récupération des catégories:', categoriesError)
        } else if (categories) {
          categoriesMap = new Map(categories.map(cat => [cat.id, {name: cat.name}]))
        }
      }

      // 7. Récupérer les tags pour chaque article
      const postsWithTags = await Promise.all(
        postsData.map(async (post) => {
          // Récupérer les tags de l'article
          const { data: tags, error: tagsError } = await supabase
            .from('post_tags')
            .select('tags(*)')
            .eq('post_id', post.id)
          
          if (tagsError) {
            console.error(`Erreur lors de la récupération des tags pour l'article ${post.id}:`, tagsError)
          }

          // Récupérer le nom de la catégorie
          const categoryInfo = post.category_id ? categoriesMap.get(post.category_id) : null
          
          return {
            ...post,
            tags: tags?.map(tag => tag.tags) || [],
            category: post.category_id?.toString() || '',
            category_name: categoryInfo?.name || 'Non catégorisé'
          }
        })
      )

      setPosts(postsWithTags)
      setError(null)
    } catch (err) {
      console.error('Erreur lors de la récupération des articles:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [categoryName])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, refresh: fetchPosts }
}

export const usePost = (slug: string, language: Language) => {
  const [post, setPost] = useState<PostWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        console.log(`Récupération de l'article avec le slug: ${slug} et la langue: ${language}`)
        
        // Récupérer l'article avec les relations (auteur, catégorie, tags)
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            *,
            author:author_id (id, display_name, avatar_url, bio),
            category:category_id (id, name, slug)
          `)
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle()

        if (postError) throw postError
        
        if (!postData) {
          console.warn(`Aucun article trouvé avec le slug: ${slug} et la langue: ${language}`)
          setPost(null)
          setError('Article non trouvé')
          return
        }
        
        // Récupérer le nom de la catégorie depuis les données déjà chargées
        const categoryName = postData.category?.name || ''
        
        // Enfin, récupérer les tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('post_tags')
          .select('tags(*)')
          .eq('post_id', postData.id)
        
        if (tagsError) console.error('Erreur lors de la récupération des tags:', tagsError)
        
        // Construire l'objet article final
        const postWithRelations = {
          ...postData,
          category: postData.category || null,
          category_name: categoryName,
          tags: tagsData?.map(tag => tag.tags) || [],
          author: postData.author || null
        }
        
        console.log('Article récupéré avec succès:', postWithRelations)
        setPost(postWithRelations as unknown as Post)
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'article:', err)
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, language])

  return { post, loading, error }
}

export const useCategories = (language: Language) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error

        setCategories(data || [])
      } catch (err) {
        console.error('Erreur lors de la récupération des catégories:', err)
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [language])

  return { categories, loading, error }
}