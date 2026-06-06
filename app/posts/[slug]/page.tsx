import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getAdjacentPosts, getAllPosts } from '@/lib/posts'
import PostContent from '@/components/posts/PostContent'
import TagBadge from '@/components/ui/TagBadge'
import Link from 'next/link'
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import GiscusComments from '@/components/posts/GiscusComments'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description || post.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description || post.excerpt,
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      ...(post.frontmatter.coverImage ? { images: [post.frontmatter.coverImage] } : {}),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const date = new Date(post.frontmatter.date)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to all posts
      </Link>

      <article>
        {/* Header */}
        <header className="mb-10 animate-fade-in">
          {/* Cover Image */}
          {post.frontmatter.coverImage && (
            <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
              <img
                src={post.frontmatter.coverImage}
                alt={post.frontmatter.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.frontmatter.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            {post.frontmatter.title}
          </h1>

          {/* Description */}
          {post.frontmatter.description && (
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              {post.frontmatter.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-500 pb-8 border-b border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
            {post.frontmatter.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.frontmatter.author}
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="mb-12">
          <PostContent content={post.content} />
        </div>

        {/* Post navigation */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-gray-100 dark:border-gray-800">
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">
                <ChevronLeft className="w-3 h-3 inline" /> Previous
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-1">
                {prev.frontmatter.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/posts/${next.slug}`}
              className="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all text-right"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">
                Next <ChevronRight className="w-3 h-3 inline" />
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-1">
                {next.frontmatter.title}
              </span>
            </Link>
          )}
        </nav>

        {/* Comments */}
        <section className="mt-8">
          <GiscusComments />
        </section>
      </article>
    </div>
  )
}
