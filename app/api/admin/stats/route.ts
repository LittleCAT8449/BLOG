import { NextResponse } from 'next/server'
import { getAllPosts, getAllDrafts, getAllTags } from '@/lib/posts'
import { getAllViews } from '@/lib/views'

export async function GET() {
  const views = getAllViews()
  const totalViews = Object.values(views).reduce((sum, v) => sum + v, 0)

  return NextResponse.json({
    totalPosts: getAllPosts().length,
    totalDrafts: getAllDrafts().length,
    totalTags: getAllTags().length,
    totalViews,
  })
}

export const dynamic = 'force-static'
