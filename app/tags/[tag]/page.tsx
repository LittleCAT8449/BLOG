import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostsByTag, getAllTags } from '@/lib/posts'
import PostGrid from '@/components/posts/PostGrid'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: tag.toLowerCase() }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `#${decodeURIComponent(tag)}`,
    description: `Articles tagged with "${decodeURIComponent(tag)}"`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          <span className="text-primary-600 dark:text-primary-400">#</span>{' '}
          {decodedTag}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {posts.length} article{posts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <PostGrid posts={posts} />
    </div>
  )
}
