import { markdownToHtml, extractTOC } from '@/lib/markdown'

export default async function PostContent({ content }: { content: string }) {
  const html = await markdownToHtml(content)
  const toc = extractTOC(html)

  return (
    <div className="flex gap-8">
      {/* TOC sidebar — desktop only */}
      {toc.length > 2 && (
        <aside className="hidden xl:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              On this page
            </h4>
            <nav className="space-y-1.5 border-l-2 border-gray-100 dark:border-gray-800">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm py-1 transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    item.level === 2
                      ? 'pl-4 text-gray-600 dark:text-gray-400'
                      : item.level === 3
                      ? 'pl-7 text-gray-500 dark:text-gray-500 text-xs'
                      : 'pl-10 text-gray-400 dark:text-gray-600 text-xs'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Content */}
      <article
        className="prose dark:prose-invert max-w-none flex-1 min-w-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
