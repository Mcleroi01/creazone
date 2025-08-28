import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import { PostWithRelations } from '../hooks/usePosts'

interface PostCardProps {
  post: PostWithRelations
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(post.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
            {post.category_name || 'Uncategorized'}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          </div>
        </div>

        <Link 
          to={`/blog/${post.slug}`}
          className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-3 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}