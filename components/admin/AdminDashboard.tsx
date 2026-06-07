'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lock, Eye, FileText, Tag, Trash2, Edit, Plus, Unlock, Settings, ExternalLink, EyeOff, Image, Upload, Copy, Check, X } from 'lucide-react'
import MarkdownEditor from '@/components/admin/MarkdownEditor'

interface PostInfo {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  draft: boolean
  author?: string
}

interface EditData extends PostInfo {
  content: string
  coverImage: string
}

interface Stats {
  totalPosts: number
  totalDrafts: number
  totalTags: number
  totalViews: number
}

interface SiteConfig {
  heroBackgroundImage: string
  heroTitle: string
  heroDescription: string
  pageBackgroundImage?: string
}

// ── Tab: Post List ──
function PostListTab({
  posts,
  drafts,
  stats,
  onEdit,
  onRefresh,
  loading,
}: {
  posts: PostInfo[]
  drafts: PostInfo[]
  stats: Stats
  onEdit: (post: PostInfo) => void
  onRefresh: () => void
  loading: boolean
}) {
  const deletePost = async (slug: string, title: string) => {
    if (!confirm(`确定要删除「${title}」吗？此操作不可恢复。`)) return
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (res.ok) onRefresh()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '已发布', value: stats.totalPosts, icon: FileText, color: 'text-green-500' },
          { label: '草稿', value: stats.totalDrafts, icon: EyeOff, color: 'text-yellow-500' },
          { label: '标签', value: stats.totalTags, icon: Tag, color: 'text-primary-500' },
          { label: '总阅读量', value: stats.totalViews, icon: Eye, color: 'text-accent-500' },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl glass">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Published */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          已发布文章 ({posts.length})
        </h3>
        <div className="space-y-2">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} onEdit={onEdit} onDelete={deletePost} />
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">暂无已发布文章</p>
          )}
        </div>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            草稿 ({drafts.length})
          </h3>
          <div className="space-y-2">
            {drafts.map((post) => (
              <PostRow key={post.slug} post={post} onEdit={onEdit} onDelete={deletePost} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PostRow({
  post,
  onEdit,
  onDelete,
}: {
  post: PostInfo
  onEdit: (post: PostInfo) => void
  onDelete: (slug: string, title: string) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl glass hover:border-primary-200 dark:hover:border-primary-800 transition-all group">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</h4>
          {post.draft && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 font-medium flex-shrink-0">
              草稿
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          <span className="font-mono text-[11px]">{post.slug}</span>
          <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
          {post.author && <span>by {post.author}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-4">
        <a
          href={`/posts/${post.slug}`}
          target="_blank"
          rel="noopener"
          className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          title="查看"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={() => onEdit(post)}
          className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          title="编辑"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(post.slug, post.title)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
          title="删除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Tab: Site Settings ──
function SiteSettingsTab() {
  const [config, setConfig] = useState<SiteConfig>({
    heroBackgroundImage: '',
    heroTitle: '',
    heroDescription: '',
    pageBackgroundImage: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/site-config')
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        setMsg('✅ 设置已保存')
      } else {
        setMsg('❌ 保存失败')
      }
    } catch {
      setMsg('❌ 网络错误')
    }
    setSaving(false)
  }

  if (loading) return <p className="text-sm text-gray-400 py-8">加载中...</p>

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl glass space-y-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">主页 Hero 设置</h3>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">主页大标题</label>
          <input
            type="text"
            value={config.heroTitle}
            onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">主页描述文字</label>
          <input
            type="text"
            value={config.heroDescription}
            onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            主页背景图 URL（留空则无背景）
          </label>
          <input
            type="text"
            value={config.heroBackgroundImage}
            onChange={(e) => setConfig({ ...config, heroBackgroundImage: e.target.value })}
            placeholder="https://images.unsplash.com/photo-xxx?w=1920&q=80"
            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
      </div>

      <div className="p-6 rounded-xl glass space-y-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">页面全局背景</h3>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            页面大背景图 URL（留空则使用默认渐变）
          </label>
          <input
            type="text"
            value={config.pageBackgroundImage || ''}
            onChange={(e) => setConfig({ ...config, pageBackgroundImage: e.target.value })}
            placeholder="https://... 或 /Photo/xxx.jpg"
            className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        {config.pageBackgroundImage && (
          <div className="rounded-lg overflow-hidden h-32 bg-gray-100 dark:bg-gray-800">
            <img src={config.pageBackgroundImage} alt="背景预览" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
        {msg && <span className={`text-sm ${msg.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>{msg}</span>}
      </div>
    </div>
  )
}

// ── Tab: Photo Management ──
function PhotosTab({ onSelectPhoto }: { onSelectPhoto?: (url: string) => void }) {
  const [photos, setPhotos] = useState<{ name: string; url: string; size: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/photos')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch { /* */ }
    setLoading(false)
  }, [])

  useEffect(() => { loadPhotos() }, [loadPhotos])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      await fetch('/api/admin/photos', { method: 'POST', body: formData })
    }
    setUploading(false)
    loadPhotos()
    // Reset input
    e.target.value = ''
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`确定删除「${name}」？`)) return
    await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: name }),
    })
    loadPhotos()
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="p-6 rounded-xl glass space-y-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">上传图片</h3>
        <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer transition-colors bg-white/30 dark:bg-gray-800/30">
          <Upload className={`w-8 h-8 ${uploading ? 'text-primary-500 animate-bounce' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {uploading ? '上传中...' : '点击选择图片或拖拽到此处'}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            支持 JPG / PNG / GIF / WebP，单张不超过 5MB
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Photo grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          图片库 ({photos.length})
        </h3>
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">暂无图片，上传一张吧</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.name}
                className="group relative aspect-square rounded-xl overflow-hidden glass border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(photo.url)}
                    className="p-1.5 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
                    title="复制 URL"
                  >
                    {copied === photo.url ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {onSelectPhoto && (
                    <button
                      onClick={() => onSelectPhoto(photo.url)}
                      className="p-1.5 rounded-lg bg-primary-500/90 text-white hover:bg-primary-600 transition-colors"
                      title="插入到编辑器"
                    >
                      <Image className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.name)}
                    className="p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] text-white truncate px-1">{photo.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ──

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [drafts, setDrafts] = useState<PostInfo[]>([])
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, totalDrafts: 0, totalTags: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)

  // Editor state
  const [activeTab, setActiveTab] = useState<'posts' | 'editor' | 'photos' | 'settings'>('posts')
  const [editingPost, setEditingPost] = useState<EditData | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editorMsg, setEditorMsg] = useState('')

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

  const loadPosts = useCallback(async () => {
    try {
      const [postsRes, draftsRes, statsRes] = await Promise.all([
        fetch('/api/admin/posts'),
        fetch('/api/admin/drafts'),
        fetch('/api/admin/stats'),
      ])
      const [postsData, draftsData, statsData] = await Promise.all([
        postsRes.json(),
        draftsRes.json(),
        statsRes.json(),
      ])
      setPosts(postsData.posts || [])
      setDrafts(draftsData.drafts || [])
      setStats(statsData)
    } catch { /* */ }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)
    loadPosts().finally(() => setLoading(false))
  }, [authenticated, loadPosts])

  const handleEdit = async (post: PostInfo) => {
    setLoadingContent(true)
    setEditorMsg('')
    try {
      const res = await fetch(`/api/posts/content?slug=${encodeURIComponent(post.slug)}`)
      const data = await res.json()
      if (res.ok) {
        setEditingPost({
          ...post,
          content: data.content || '',
          coverImage: post.description || '',
        })
      } else {
        setEditingPost({ ...post, content: '', coverImage: '' })
        setEditorMsg('无法加载文章内容')
      }
    } catch {
      setEditingPost({ ...post, content: '', coverImage: '' })
      setEditorMsg('内容加载失败')
    }
    setLoadingContent(false)
    setActiveTab('editor')
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setEditorMsg('')
    setActiveTab('editor')
  }

  const handleSave = async (data: {
    slug: string
    title: string
    date: string
    tags: string[]
    description: string
    coverImage: string
    content: string
    draft: boolean
  }) => {
    setSaving(true)
    setEditorMsg('')
    try {
      const endpoint = editingPost ? '/api/posts/update' : '/api/posts/create'
      const body: any = { ...data }
      if (editingPost) body.originalSlug = editingPost.slug

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()

      if (!res.ok) {
        setEditorMsg(result.error || '保存失败')
        return
      }

      setEditorMsg(data.draft ? '✅ 草稿已保存！' : '✅ 文章已发布！')
      setEditingPost(null)
      loadPosts()
      setActiveTab('posts')
    } catch {
      setEditorMsg('网络错误')
    } finally {
      setSaving(false)
    }
  }

  // ── Password gate ──
  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">后台管理</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">请输入管理员密码</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
            placeholder="输入密码"
            autoFocus
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          {passwordError && <p className="text-sm text-red-500">密码错误</p>}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            解锁
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

  // ── Dashboard proper ──
  const tabs = [
    { id: 'editor' as const, label: editingPost ? '编辑文章' : '写文章', icon: editingPost ? Edit : Plus },
    { id: 'posts' as const, label: '文章列表', icon: FileText },
    { id: 'photos' as const, label: '图片管理', icon: Image },
    { id: 'settings' as const, label: '站点设置', icon: Settings },
  ]

  const editorInitialData = editingPost
    ? {
        slug: editingPost.slug,
        title: editingPost.title,
        date: editingPost.date.split('T')[0],
        tags: editingPost.tags,
        description: editingPost.description || '',
        coverImage: editingPost.coverImage || '',
        content: editingPost.content || '',
        draft: editingPost.draft,
      }
    : undefined

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 dark:border-gray-800 pb-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          {loadingContent && (
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
              <span className="text-sm text-gray-400">加载文章内容...</span>
            </div>
          )}
          {editorMsg && (
            <div className={`p-3 rounded-xl text-sm font-medium ${
              editorMsg.includes('✅')
                ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
            }`}>
              {editorMsg}
            </div>
          )}
          {!loadingContent && (
            <MarkdownEditor
              initialData={editorInitialData}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <>
          {/* New post button */}
          <button
            onClick={handleNewPost}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            写新文章
          </button>
          <PostListTab
            posts={posts}
            drafts={drafts}
            stats={stats}
            onEdit={handleEdit}
            onRefresh={loadPosts}
            loading={loading}
          />
        </>
      )}

      {activeTab === 'photos' && <PhotosTab />}
      {activeTab === 'settings' && <SiteSettingsTab />}
    </div>
  )
}
