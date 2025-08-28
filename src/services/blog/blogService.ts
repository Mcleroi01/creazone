import { supabase } from '../../lib/supabase';

export interface Post {
  id: string;
  slug: string;
  language: string;
  title: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  author_id?: string;
  category_id?: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
}

export const getPosts = async (options: GetPostsOptions = {}) => {
  const { page = 1, limit = 10, category, language } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq('category.slug', category);
  }

  if (language) {
    query = query.eq('language', language);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  return { data, count };
};

export const getPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*), author:users(display_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    throw error;
  }

  return data;
};

export const getRelatedPosts = async (postId: string, categoryId: number, limit = 3) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', categoryId)
    .neq('id', postId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data;
};
