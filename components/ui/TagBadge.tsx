import Link from 'next/link'

export default function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
    >
      {tag}
      {count !== undefined && (
        <span className="text-primary-400 dark:text-primary-500">{count}</span>
      )}
    </Link>
  )
}
