import { supabase } from '../../lib/supabase';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  posts?: Array<{ id: string }>;
}

export interface CategoryWithCount extends Omit<Category, 'posts'> {
  post_count: number;
}

export const getCategories = async (language?: string): Promise<CategoryWithCount[]> => {
  let query = supabase
    .from('categories')
    .select('*, posts!inner(id)')
    .eq('posts.is_published', true);

  if (language) {
    query = query.eq('posts.language', language);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  // Compter le nombre d'articles par catégorie
  const categoriesWithCount = (data as Category[]).map(category => ({
    ...category,
    post_count: category.posts?.length || 0
  }));

  return categoriesWithCount;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    throw error;
  }

  return data as Category;
};
