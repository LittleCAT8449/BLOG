import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, deletePost } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
    description: p.frontmatter.description || p.excerpt,
    draft: p.frontmatter.draft || false,
    author: p.frontmatter.author,
  }))
  return NextResponse.json({ posts })
}

export async function DELETE(request: NextRequest) {
  try {
    const { slug } = await request.json()
    if (!slug) {
      return NextResponse.json({ error: '缺少 slug' }, { status: 400 })
    }
    deletePost(slug)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '删除失败' }, { status: 400 })
  }
}

export const dynamic = 'force-static'
