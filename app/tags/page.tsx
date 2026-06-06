import type { Metadata } from 'next'
import { getAllTags } from '@/lib/posts'
import TagBadge from '@/components/ui/TagBadge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all topics and tags',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Tags
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {tags.length} topics to explore
        </p>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-gray-400 dark:text-gray-500">No tags yet</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="group"
            >
              <div className="px-5 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all card-hover">
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {tag}
                </span>
                <span className="ml-2 text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
