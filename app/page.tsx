import { getPaginatedPosts } from '@/lib/posts'
import { getSiteConfig } from '@/lib/site-config'
import PostGrid from '@/components/posts/PostGrid'
import Pagination from '@/components/ui/Pagination'
import { Sparkles } from 'lucide-react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const { posts, totalPages } = getPaginatedPosts(currentPage)
  const siteConfig = getSiteConfig()

  return (
    <div>
      {/* Hero */}
      <section
        className="relative mb-16 animate-fade-in"
        style={
          siteConfig.heroBackgroundImage
            ? {
                backgroundImage: `url(${siteConfig.heroBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background: 'linear-gradient(135deg, #2563eb10 0%, #d946ef10 50%, #3b82f610 100%)',
              }
        }
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-950/60 backdrop-blur-sm" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center p-8 sm:p-10 rounded-2xl glass-strong">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs font-medium text-primary-600 dark:text-primary-400 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight leading-tight">
              {siteConfig.heroTitle || 'Welcome to My Blog'}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {siteConfig.heroDescription || 'Thoughts, stories, and ideas about technology, design, and the world around us.'}
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="p-6 sm:p-8 rounded-2xl glass-strong">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Latest Posts
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <PostGrid posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </div>
  )
}
