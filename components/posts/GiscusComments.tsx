'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

export default function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !ref.current) return

    // Clean up existing giscus
    ref.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'YOUR_GITHUB_USERNAME/YOUR_REPO')
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    ref.current.appendChild(script)
  }, [mounted, resolvedTheme])

  if (!mounted) return <div className="h-32" />

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <p className="mb-2">
          💬 To enable comments, configure{' '}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Giscus
          </a>{' '}
          by updating the repo information in{' '}
          <code className="text-xs bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            components/posts/GiscusComments.tsx
          </code>
        </p>
      </div>
      <div ref={ref} />
    </div>
  )
}
