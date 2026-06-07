import Link from 'next/link'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import TagBadge from '@/components/ui/TagBadge'
import type { Post } from '@/lib/posts'

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.frontmatter.date)
  const formattedDate = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block glass rounded-2xl overflow-hidden card-hover animate-slide-up"
    >
      {/* Cover image */}
      {post.frontmatter.coverImage ? (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={post.frontmatter.coverImage}
            alt={post.frontmatter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50 dark:from-primary-950 dark:via-accent-950 dark:to-primary-950 flex items-center justify-center">
          <span className="text-5xl opacity-30 select-none">📝</span>
        </div>
      )}

      <div className="p-5 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.frontmatter.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {post.frontmatter.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.frontmatter.description || post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1 ml-auto text-primary-500 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            Read
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
