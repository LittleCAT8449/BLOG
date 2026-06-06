import { NextResponse } from 'next/server'
import { getAllDrafts } from '@/lib/posts'

export async function GET() {
  const drafts = getAllDrafts().map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
    description: p.frontmatter.description || p.excerpt,
    draft: true,
  }))
  return NextResponse.json({ drafts })
}

export const dynamic = 'force-static'
