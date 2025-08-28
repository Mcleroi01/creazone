import { supabase } from './supabase';

export interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  post_id: string;
  parent_id: string | null;
}

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
};

export const getReplies = async (commentId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching replies:', error);
    return [];
  }

  return data || [];
};

export const addComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return data;
};

// Fonction de like de commentaire supprimée car non utilisée
