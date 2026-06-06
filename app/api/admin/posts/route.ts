import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
    description: p.frontmatter.description || p.excerpt,
    draft: p.frontmatter.draft || false,
  }))
  return NextResponse.json({ posts })
}

export const dynamic = 'force-static'
