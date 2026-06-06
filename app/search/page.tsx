import type { Metadata } from 'next'
import { Suspense } from 'react'
import SearchPageClient from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search through all blog posts',
}

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Search
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Find articles by title, content, or tags
        </p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse p-6 rounded-xl bg-gray-50 dark:bg-gray-900"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        }
      >
        <SearchPageClient />
      </Suspense>
    </div>
  )
}
