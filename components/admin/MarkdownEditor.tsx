'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Bold, Italic, Link, Image, Code, Quote, List, Minus,
  Heading2, Heading3, Eye, EyeOff, Split, Save, FileText,
  X, ExternalLink,
} from 'lucide-react'

interface MarkdownEditorProps {
  initialData?: {
    slug: string
    title: string
    date: string
    tags: string[]
    description: string
    coverImage: string
    content: string
    draft: boolean
  }
  onSave: (data: {
    slug: string
    title: string
    date: string
    tags: string[]
    description: string
    coverImage: string
    content: string
    draft: boolean
  }) => void
  saving: boolean
}

interface ModalState {
  open: boolean
  type: 'link' | 'image'
}

export default function MarkdownEditor({ initialData, onSave, saving }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [title, setTitle] = useState(initialData?.title || '')
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [draft, setDraft] = useState(initialData?.draft ?? true)
  const [showPreview, setShowPreview] = useState(false)
  const [showMeta, setShowMeta] = useState(true)

  // Modal state
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'link' })
  const [modalText, setModalText] = useState('')
  const [modalUrl, setModalUrl] = useState('')
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([])

  // Generate slug from title
  useEffect(() => {
    if (!initialData && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[\s]+/g, '-')
          .replace(/[^\w一-鿿-]/g, '')
          .slice(0, 60)
      )
    }
  }, [title, initialData])

  const insertAtCursor = useCallback((before: string, after: string = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const newText = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(newText)
    setTimeout(() => {
      ta.focus()
      const newCursor = start + before.length + selected.length + after.length
      ta.setSelectionRange(newCursor, newCursor)
    }, 0)
  }, [content])

  const handleToolbar = (action: string) => {
    const ta = textareaRef.current
    ta?.focus()

    switch (action) {
      case 'h2':
        insertAtCursor('\n## ', '\n')
        break
      case 'h3':
        insertAtCursor('\n### ', '\n')
        break
      case 'bold':
        insertAtCursor('**', '**')
        break
      case 'italic':
        insertAtCursor('*', '*')
        break
      case 'quote':
        insertAtCursor('\n> ', '\n')
        break
      case 'code':
        insertAtCursor('\n```\n', '\n```\n')
        break
      case 'list':
        insertAtCursor('\n- ', '\n')
        break
      case 'hr':
        insertAtCursor('\n---\n', '')
        break
      case 'link':
        setModalText(content.slice(textareaRef.current?.selectionStart || 0, textareaRef.current?.selectionEnd || 0))
        setModalUrl('')
        setModal({ open: true, type: 'link' })
        break
      case 'image':
        setModalText('')
        setModalUrl('')
        setModal({ open: true, type: 'image' })
        // Fetch uploaded photos
        fetch('/api/admin/photos')
          .then((r) => r.json())
          .then((data) => setPhotos(data.photos || []))
          .catch(() => setPhotos([]))
        break
    }
  }

  const handleModalConfirm = () => {
    if (modal.type === 'link') {
      const linkText = modalText || modalUrl || 'link'
      insertAtCursor(`[${linkText}](${modalUrl || '#'})`, '')
    } else {
      const altText = modalText || 'image'
      insertAtCursor(`![${altText}](${modalUrl || '#'})`, '')
    }
    setModal({ open: false, type: 'link' })
  }

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        // For now just insert placeholder — image hosting would be needed for real upload
        insertAtCursor('\n![图片](https://placehold.co/800x400?text=Pasted+Image)\n', '')
        return
      }
    }
  }, [insertAtCursor])

  const handleSave = () => {
    const rawDate = date.includes('T') ? date : `${date}T12:00:00`
    onSave({
      slug: slug || 'untitled',
      title: title || 'Untitled',
      date: rawDate,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      description,
      coverImage,
      content,
      draft,
    })
  }

  const toolbarItems = [
    { action: 'h2', icon: Heading2, label: 'H2' },
    { action: 'h3', icon: Heading3, label: 'H3' },
    { action: 'bold', icon: Bold, label: 'Bold' },
    { action: 'italic', icon: Italic, label: 'Italic' },
    { action: 'quote', icon: Quote, label: 'Quote' },
    { action: 'code', icon: Code, label: 'Code' },
    { action: 'list', icon: List, label: 'List' },
    { action: 'link', icon: Link, label: 'Link' },
    { action: 'image', icon: Image, label: 'Image' },
    { action: 'hr', icon: Minus, label: 'HR' },
  ]

  // Quick markdown preview (basic)
  const renderPreview = (md: string) => {
    let html = md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 border-b pb-1">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm text-accent-600">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 underline" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2" />')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-400 pl-4 my-2 italic text-gray-500">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^---$/gm, '<hr class="my-4 border-gray-200" />')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3 text-sm"><code>$1</code></pre>')
      .replace(/\n/g, '<br/>')
    return html
  }

  return (
    <div className="space-y-4">
      {/* Meta fields */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMeta(!showMeta)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          {showMeta ? '隐藏元信息' : '显示元信息'}
        </button>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{content.length} 字</span>
      </div>

      {showMeta && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl glass">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="my-post-slug"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">标签 (逗号分隔)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="技术, 前端, React"
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">摘要</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="文章简短描述..."
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">封面图 URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-1.5 rounded-xl glass overflow-x-auto">
        {toolbarItems.map((item) => (
          <button
            key={item.action}
            onClick={() => handleToolbar(item.action)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex-shrink-0"
            title={item.label}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
            showPreview
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
          }`}
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{showPreview ? '隐藏预览' : '预览'}</span>
        </button>
      </div>

      {/* Editor / Preview */}
      <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
            placeholder="在此编写 Markdown 内容..."
            className="w-full min-h-[400px] p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-y"
          />
        </div>

        {showPreview && (
          <div
            className="min-h-[400px] p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-auto prose dark:prose text-sm"
            dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between p-3 rounded-xl glass">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {draft ? '保存为草稿' : '发布文章'}
          </span>
        </label>
        <button
          onClick={handleSave}
          disabled={saving || !title}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中...' : initialData ? '保存修改' : '发布文章'}
        </button>
      </div>

      {/* Link/Image Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl glass shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {modal.type === 'link' ? '插入链接' : '插入图片'}
              </h3>
              <button
                onClick={() => setModal({ open: false, type: 'link' })}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {modal.type === 'link' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">链接文本</label>
                  <input
                    type="text"
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="显示的文字"
                    autoFocus
                    className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              )}
              {modal.type === 'image' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">图片描述 (alt)</label>
                  <input
                    type="text"
                    value={modalText}
                    onChange={(e) => setModalText(e.target.value)}
                    placeholder="图片描述文字"
                    autoFocus
                    className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              )}
              {modal.type === 'image' && photos.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">从图库选择</label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {photos.slice(0, 12).map((photo) => (
                      <button
                        key={photo.name}
                        onClick={() => setModalUrl(photo.url)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          modalUrl === photo.url
                            ? 'border-primary-500 ring-2 ring-primary-500/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                        title={photo.name}
                      >
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <input
                  type="text"
                  value={modalUrl}
                  onChange={(e) => setModalUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleModalConfirm() }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModal({ open: false, type: 'link' })}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleModalConfirm}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  插入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
