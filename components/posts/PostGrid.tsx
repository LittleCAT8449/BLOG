import type { Post } from '@/lib/posts'
import PostCard from './PostCard'

export default function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No posts yet
        </h2>
        <p className="text-gray-400 dark:text-gray-500">
          Check back later for new content!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
