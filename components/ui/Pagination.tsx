import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const getHref = (page: number) =>
    basePath === '/' ? `/?page=${page}` : `${basePath}?page=${page}`

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      <Link
        href={getHref(currentPage - 1)}
        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage <= 1
            ? 'text-gray-300 dark:text-gray-700 pointer-events-none'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getHref(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={getHref(currentPage + 1)}
        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage >= totalPages
            ? 'text-gray-300 dark:text-gray-700 pointer-events-none'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </nav>
  )
}
