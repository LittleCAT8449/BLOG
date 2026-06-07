import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/posts'

export async function POST(request: NextRequest) {
  try {
    const { slug, title, date, tags, description, coverImage, author, content, draft } = await request.json()

    if (!slug || !title || !date) {
      return NextResponse.json({ error: '缺少必填字段 (slug, title, date)' }, { status: 400 })
    }

    createPost(slug, {
      title,
      date: new Date(date).toISOString(),
      tags: tags || [],
      description: description || '',
      coverImage: coverImage || undefined,
      author: author || undefined,
      draft: draft || false,
    }, content || '')

    return NextResponse.json({ success: true, slug })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '创建失败' }, { status: 400 })
  }
}
