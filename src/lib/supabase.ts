import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Vérification des variables d'environnement
console.log('Configuration Supabase:')
console.log('- URL:', supabaseUrl ? 'Définie' : 'Non définie')
console.log('- Clé anonyme:', supabaseAnonKey ? 'Définie' : 'Non définie')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number | null
}

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  slug: string
  language: string
  title: string
  excerpt: string
  content: string
  cover_image_url?: string
  author_id?: string
  category_id?: number | null
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
  category: string
  tags: Tag[]
  categories?: Category[]
  author?: Pick<User, 'id' | 'display_name' | 'avatar_url' | 'bio'>
}

export type Language = 'fr' | 'en' | 'pt'

export const languages: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  pt: 'Português'
}