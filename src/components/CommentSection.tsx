import { useState, useEffect } from 'react';
import { Comment as CommentType, getCommentsByPostId, addComment } from '../lib/comments';
import { format } from 'date-fns';
import { fr, enUS, pt } from 'date-fns/locale';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

const locales = { fr, en: enUS, pt };

interface CommentSectionProps {
  postId: string;
  language: 'fr' | 'en' | 'pt';
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, language }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const commentsData = await getCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        post_id: postId,
        author_name: name,
        author_email: email,
        content: comment,
        parent_id: null,
      });
      
      // Réinitialiser le formulaire
      setComment('');
      setName('');
      setEmail('');
      
      // Recharger les commentaires
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des commentaires...</div>;
  }

  return (
    <div id="comments" className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Commentaires ({comments.length})
      </h2>
      
      {/* Formulaire de commentaire */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Laisser un commentaire
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email * (ne sera pas affiché)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Commentaire *
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={submitting}
            >
              {submitting ? 'Publication...' : 'Publier le commentaire'}
            </Button>
          </div>
        </form>
      </div>

      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <Avatar 
                  className="h-10 w-10"
                  fallback={
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {comment.author_name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {comment.author_name || 'Anonyme'}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(comment.created_at), 'd MMMM yyyy', { locale: locales[language] })}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {comment.content}
                  </p>
                  <div className="mt-3 flex items-center space-x-4">
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Aucun commentaire pour le moment
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Soyez le premier à partager votre avis !
          </p>
        </div>
      )}
    </div>
  );
};
