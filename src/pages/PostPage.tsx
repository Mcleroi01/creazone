import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Share2, MessageCircle, Heart, Bookmark, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePost } from '../hooks/usePosts';
import { AdPlacement } from '../components/ads/AdPlacement';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { SEO } from '../components/SEO';
import { Tag as TagType, Language } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CommentSection } from '../components/CommentSection';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';


// Composant pour les boutons de partage
type ShareButtonProps = {
  title: string;
  url: string;
  tags?: TagType[];
};

const ShareButtons: React.FC<ShareButtonProps> = ({ title, url, tags = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`Découvrez cet article: ${title}`);

  const shareOptions = [
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/30',
      textColor: 'text-blue-500',
    },
    {
      name: 'LinkedIn',
      icon: '🔗',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-100 dark:hover:bg-blue-900/20',
      textColor: 'text-blue-600',
    },
    {
      name: 'Facebook',
      icon: '👍',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      textColor: 'text-blue-700',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      textColor: 'text-green-600',
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-300',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Découvrez cet article: ${title}`,
          url: url,
        });
      } catch (err) {
        console.error('Erreur lors du partage:', err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNativeShare} 
        className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all border-gray-200 dark:border-gray-700 group relative"
      >
        <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Partager
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 text-sm ${option.color} ${option.textColor} hover:text-gray-900 dark:hover:text-white`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-lg">{option.icon}</span>
                <span>Partager sur {option.name}</span>
              </a>
            ))}
            <button
              onClick={() => {
                copyToClipboard();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <span className="mr-3">📋</span>
              {isCopied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(
    (searchParams.get('lang') as Language) || 'fr'
  );
  const { post, loading, error } = usePost(slug || '', language);
  const location = useLocation();
  const { viewCount } = useVisitorTracking(post?.id);
  const [isMounted, setIsMounted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Suivi des visiteurs
  useVisitorTracking(post?.id);

  useEffect(() => {
    setIsMounted(true);
    setCurrentUrl(window.location.href);
    
    const lang = searchParams.get('lang') as Language | null;
    if (lang && ['fr', 'en', 'pt'].includes(lang)) {
      setLanguage(lang);
    }
  }, [searchParams]);

  // Rediriger si l'article n'existe pas
  useEffect(() => {
    if (!loading && !post && !error && isMounted) {
      navigate('/404');
    }
  }, [loading, post, error, isMounted, navigate]);

  if (loading || !isMounted) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return <ErrorMessage message="Article non trouvé" />;
  }


  interface Texts {
  [key: string]: {
    backToBlog: string;
    publishedOn: string;
    by: string;
    in: string;
    readMore: string;
    aboutAuthor: string;
    relatedPosts: string;
    noRelatedPosts: string;
    share: string;
    comments: string;
    likes: string;
    reply: string;
    save: string;
    category: string;
    tags: string;
    readingTime: string;
    noTags: string;
    readNext: string;
    allPosts: string;
    commentsCount: string; // Format: "{count} commentaire(s)"
    copyLink: string;
    linkCopied: string;
    shareOn: string;
    noComments: string;
    beFirstToComment: string;
    leaveComment: string;
    name: string;
    email: string;
    comment: string;
    postComment: string;
  };
}

const texts: Record<Language, Texts[keyof Texts]> = {
    fr: {
      backToBlog: 'Retour au blog',
      publishedOn: 'Publié le',
      by: 'par',
      in: 'dans',
      readMore: 'Lire la suite',
      aboutAuthor: 'À propos de l\'auteur',
      relatedPosts: 'Articles similaires',
      noRelatedPosts: 'Aucun article similaire pour le moment',
      share: 'Partager',
      comments: 'Commentaires',
      likes: 'J\'aime',
      save: 'Enregistrer',
      category: 'Catégorie',
      tags: 'Étiquettes',
      readingTime: 'min de lecture',
      noTags: 'Aucune étiquette',
      readNext: 'À lire ensuite',
      allPosts: 'Tous les articles',
      commentsCount: 'commentaire(s)',
      copyLink: 'Copier le lien',
      linkCopied: 'Lien copié !',
      shareOn: 'Partager sur',
      noComments: 'Aucun commentaire pour le moment',
      beFirstToComment: 'Soyez le premier à commenter !',
      leaveComment: 'Laisser un commentaire',
      name: 'Nom',
      email: 'Email (ne sera pas affiché)',
      comment: 'Commentaire',
      postComment: 'Publier le commentaire',
      reply: 'Répondre',
    },
    en: {
      backToBlog: 'Back to blog',
      publishedOn: 'Published on',
      by: 'by',
      in: 'in',
      readMore: 'Read more',
      aboutAuthor: 'About the author',
      relatedPosts: 'Related posts',
      noRelatedPosts: 'No related posts yet',
      share: 'Share',
      comments: 'Comments',
      likes: 'Like',
      reply: 'Reply',
      save: 'Save',
      category: 'Category',
      tags: 'Tags',
      readingTime: 'min read',
      noTags: 'No tags',
      readNext: 'Read next',
      allPosts: 'All posts',
      commentsCount: 'comment(s)',
      copyLink: 'Copy link',
      linkCopied: 'Link copied!',
      shareOn: 'Share on',
      noComments: 'No comments yet',
      beFirstToComment: 'Be the first to comment!',
      leaveComment: 'Leave a comment',
      name: 'Name',
      email: 'Email (will not be displayed)',
      comment: 'Comment',
      postComment: 'Post comment'
    },
    pt: {
      backToBlog: 'Voltar ao blog',
      publishedOn: 'Publicado em',
      by: 'por',
      in: 'em',
      readMore: 'Ler mais',
      aboutAuthor: 'Sobre o autor',
      relatedPosts: 'Artigos relacionados',
      noRelatedPosts: 'Nenhum artigo relacionado no momento',
      share: 'Compartilhar',
      comments: 'Comentários',
      likes: 'Curtir',
      reply: 'Responder',
      save: 'Salvar',
      category: 'Categoria',
      tags: 'Tags',
      readingTime: 'min de leitura',
      noTags: 'Nenhuma tag',
      readNext: 'Próxima leitura',
      allPosts: 'Todos os artigos',
      commentsCount: 'comentário(s)',
      copyLink: 'Copiar link',
      linkCopied: 'Link copiado!',
      shareOn: 'Compartilhar no',
      noComments: 'Nenhum comentário ainda',
      beFirstToComment: 'Seja o primeiro a comentar!',
      leaveComment: 'Deixar um comentário',
      name: 'Nome',
      email: 'E-mail (não será exibido)',
      comment: 'Comentário',
      postComment: 'Publicar comentário'
    }
  };

  // Afficher des informations de débogage
  console.log('PostPage - État:', { loading, error, post, slug, language });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner />
        <p className="text-center mt-4 text-gray-500">Chargement de l'article "{slug}"...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error || 'Article non trouvé'} />
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white">Détails de l'erreur :</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Impossible de trouver l'article avec le slug : <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{slug}</code>
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Langue : <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{language}</code>
          </p>
          <div className="mt-4">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {texts[language].backToBlog}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPostDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        image={post.cover_image_url}
        canonicalUrl={window.location.href}
        meta={[
          // Open Graph / Facebook
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: post.title },
          { property: 'og:description', content: post.excerpt || '' },
          { property: 'og:image', content: post.cover_image_url || '' },
          { property: 'og:url', content: window.location.href },
          { property: 'og:site_name', content: 'CréaZone' },
          
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: post.title },
          { name: 'twitter:description', content: post.excerpt || '' },
          { name: 'twitter:image', content: post.cover_image_url || '' },
          
          // Article specific
          { property: 'article:published_time', content: post.published_at || '' },
          { property: 'article:author', content: post.author?.display_name || '' },
          ...(post.tags?.map(tag => ({ property: 'article:tag', content: tag.name })) || [])
        ]}
      />

      <div className="mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {texts[language].backToBlog}
        </Link>

       

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Avatar 
              className="h-10 w-10"
              src={post.author?.avatar_url}
              alt={post.author?.display_name}
              fallback={
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {post.author?.display_name?.charAt(0) || 'A'}
                </span>
              }
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author?.display_name || 'Auteur inconnu'}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{formatPostDate(post.published_at)}</span>
                <span className="mx-2">•</span>
                <span>{readingTime} {texts[language].readingTime}</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count || 0} {texts[language].commentsCount}</span>
            </Button>
            <ShareButtons title={post.title} url={currentUrl} />
          </div>
        </div>



        {post.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-8">
          {post.category && (
            <Link
              to={`/categories/${post.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          
          {post.tags && post.tags.length > 0 ? (
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug || tag.id}`}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {texts[language].noTags}
            </span>
          )}
        </div>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none mb-12 relative">
        {/* Publicité flottante sur le côté pour les grands écrans */}
        <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 w-48">
          <AdPlacement type="rectangle" />
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white border-b pb-2">
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
                {children}
              </h3>
            ),
            h3: ({ children }) => (
              <h4 className="text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            code: ({ node, inline, className, children, ...props }) => (
              inline ? (
                <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <div className="my-6 rounded-lg overflow-hidden">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto text-sm">
                    <code className="font-mono" {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              )
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 text-gray-600 dark:text-gray-400 italic">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-6 space-y-2 pl-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-6 space-y-2 pl-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 dark:text-gray-300 text-lg">
                {children}
              </li>
            ),
            img: ({ src, alt }) => (
              <div className="my-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={src} 
                  alt={alt || ''} 
                  className="w-full h-auto"
                  loading="lazy"
                />
                {alt && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {alt}
                  </p>
                )}
              </div>
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
        {/* Bannière publicitaire avant la section auteur */}
        <div className="my-12">
          <AdPlacement type="in-feed" />
        </div>
      </article>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mb-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar 
                src={post.author?.avatar_url} 
                alt={post.author?.display_name}
                fallback={post.author?.display_name?.charAt(0) || 'A'}
                className="h-14 w-14 border-2 border-white dark:border-gray-800 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {post.author?.display_name || 'Auteur inconnu'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {post.author?.bio || 'Auteur de cet article'}
              </p>
             
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{new Intl.NumberFormat('fr-FR').format(viewCount)}</span>
                  <span className="ml-1">vues</span>
                </div>
              </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all"
              onClick={() => {
                document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
             
            </Button>
            <ShareButtons title={post.title} url={currentUrl} />
          </div>
        </div>
      </div>

      {/* Bannière publicitaire avant les commentaires */}
     
      
      {/* Section de commentaires */}
      <CommentSection postId={post.id} language={language} />
      {/* Bannière publicitaire après l'introduction */}
      <div className="my-8">
        <AdPlacement type="rectangle" />
      </div>
    </div>
  )
}