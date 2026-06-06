import { NextRequest, NextResponse } from 'next/server'
import { incrementViews, getViews } from '@/lib/views'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
  }
  return NextResponse.json({ slug, views: getViews(slug) })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const slug = body.slug
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }
  const views = incrementViews(slug)
  return NextResponse.json({ slug, views })
}
