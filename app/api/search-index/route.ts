import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description || p.excerpt,
    tags: p.frontmatter.tags,
    excerpt: p.excerpt,
    frontmatter: p.frontmatter,
    readingTime: p.readingTime,
  }))

  return NextResponse.json({ posts })
}

export const dynamic = 'force-static'
