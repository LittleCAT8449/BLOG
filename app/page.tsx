import { getPaginatedPosts } from '@/lib/posts'
import PostGrid from '@/components/posts/PostGrid'
import Pagination from '@/components/ui/Pagination'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const { posts, totalPages } = getPaginatedPosts(currentPage)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
          Welcome to{' '}
          <span className="gradient-text">My Blog</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Thoughts, stories, and ideas about technology, design, and the world around us.
        </p>
      </section>

      {/* Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Latest Posts
          </h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <PostGrid posts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </div>
  )
}
