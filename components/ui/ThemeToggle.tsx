'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const cycle = () => {
    if (resolvedTheme === 'dark') setTheme('light')
    else if (resolvedTheme === 'light') setTheme('system')
    else setTheme('dark')
  }

  const Icon = resolvedTheme === 'dark' ? Moon : resolvedTheme === 'light' ? Sun : Monitor

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Theme: ${theme} (click to cycle)`}
      aria-label="Toggle theme"
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
