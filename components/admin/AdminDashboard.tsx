'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, FileText, Tag, Hash, Clock, Calendar, Unlock, ChevronRight } from 'lucide-react'
import TagBadge from '@/components/ui/TagBadge'
import Link from 'next/link'

interface PostInfo {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  draft: boolean
}

interface Stats {
  totalPosts: number
  totalDrafts: number
  totalTags: number
  totalViews: number
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [drafts, setDrafts] = useState<PostInfo[]>([])
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, totalDrafts: 0, totalTags: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published')

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)

    Promise.all([
      fetch('/api/admin/posts').then((r) => r.json()),
      fetch('/api/admin/drafts').then((r) => r.json()),
      fetch('/api/admin/stats').then((r) => r.json()),
    ])
      .then(([postsData, draftsData, statsData]) => {
        setPosts(postsData.posts || [])
        setDrafts(draftsData.drafts || [])
        setStats(statsData)
      })
      .finally(() => setLoading(false))
  }, [authenticated])

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Access
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the admin password to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(false)
            }}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
          {passwordError && (
            <p className="text-sm text-red-500 dark:text-red-400">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Unlock className="w-4 h-4 inline mr-2" />
            Unlock
          </button>
        </form>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Published', value: stats.totalPosts, icon: FileText, color: 'text-green-500' },
          { label: 'Drafts', value: stats.totalDrafts, icon: FileText, color: 'text-yellow-500' },
          { label: 'Tags', value: stats.totalTags, icon: Tag, color: 'text-primary-500' },
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-accent-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-1">
        {(['published', 'drafts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'published' ? 'Published' : 'Drafts'}
            <span className="ml-2 text-xs opacity-60">
              {tab === 'published' ? stats.totalPosts : stats.totalDrafts}
            </span>
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-2">
        {(activeTab === 'published' ? posts : drafts).map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all card-hover"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {post.title}
                </h3>
                {post.draft && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 font-medium flex-shrink-0">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {post.tags.length} tags
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700 flex-shrink-0 ml-4" />
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Create New Post
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Add a new .md file to content/posts/ with frontmatter:
            </p>
            <pre className="text-xs bg-gray-50 dark:bg-gray-950 p-3 rounded-lg text-gray-600 dark:text-gray-400 overflow-x-auto">
{`---
title: "My Post Title"
date: "2026-06-06"
tags: ["tech", "life"]
description: "A brief description"
---

Write your content here...`}
            </pre>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Manage Content
            </h4>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <li>• Posts: <code className="text-primary-600 dark:text-primary-400">content/posts/</code></li>
              <li>• Drafts: <code className="text-primary-600 dark:text-primary-400">content/drafts/</code></li>
              <li>• Views: <code className="text-primary-600 dark:text-primary-400">content/views.json</code></li>
              <li>• Set draft: true in frontmatter to hide</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
