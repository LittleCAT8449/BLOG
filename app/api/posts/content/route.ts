import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: '缺少 slug 参数' }, { status: 400 })
  }

  const postsDir = path.join(process.cwd(), 'content/posts', `${slug}.md`)
  const draftsDir = path.join(process.cwd(), 'content/drafts', `${slug}.md`)

  let filePath = ''
  if (fs.existsSync(postsDir)) filePath = postsDir
  else if (fs.existsSync(draftsDir)) filePath = draftsDir
  else return NextResponse.json({ error: '文件不存在' }, { status: 404 })

  const raw = fs.readFileSync(filePath, 'utf-8')
  const content = raw.replace(/^---[\s\S]*?---\n*/, '')

  return NextResponse.json({ raw, content })
}
