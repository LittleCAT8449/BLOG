'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { Calendar, Clock, Search } from 'lucide-react'
import type { Post } from '@/lib/posts'
import TagBadge from '@/components/ui/TagBadge'

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/search-index')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'description', weight: 2 },
          { name: 'tags', weight: 2 },
          { name: 'excerpt', weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
        includeMatches: true,
      }),
    [posts]
  )

  const results = useMemo(() => {
    if (!query.trim()) return posts
    return fuse.search(query.trim()).map((r) => r.item)
  }, [query, fuse, posts])

  const handleChange = (value: string) => {
    setQuery(value)
    const url = value.trim()
      ? `/search?q=${encodeURIComponent(value.trim())}`
      : '/search'
    router.replace(url, { scroll: false })
  }

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type to search..."
          autoFocus
          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-6 rounded-xl bg-gray-50 dark:bg-gray-900">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No results found
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Try different keywords or browse by tags
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </p>
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all card-hover"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {post.frontmatter.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {post.frontmatter.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                {post.frontmatter.description || post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.frontmatter.date).toLocaleDateString('zh-CN')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
