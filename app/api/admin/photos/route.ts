import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// GET: list all photos in public/Photo/
export async function GET() {
  const photoDir = path.join(process.cwd(), 'public', 'Photo')
  try {
    if (!fs.existsSync(photoDir)) {
      return NextResponse.json({ photos: [] })
    }
    const files = fs.readdirSync(photoDir)
    const photos = files
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/i.test(f))
      .map((f) => ({
        name: f,
        url: `/Photo/${f}`,
        size: fs.statSync(path.join(photoDir, f)).size,
        mtime: fs.statSync(path.join(photoDir, f)).mtime.toISOString(),
      }))
      .sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime())
    return NextResponse.json({ photos })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: upload a photo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 })
    }

    // Validate type (include image/jpg for compatibility)
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'image/webp', 'image/svg+xml', 'image/avif', 'image/bmp',
      'image/x-icon',
    ]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: `不支持的格式: ${file.type}` }, { status: 400 })
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '图片不能超过 10MB' }, { status: 400 })
    }

    const photoDir = path.join(process.cwd(), 'public', 'Photo')
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir, { recursive: true })
    }

    // Sanitize filename: keep alphanumeric, Chinese, dots, dashes, underscores
    const originalName = file.name
    const ext = path.extname(originalName).toLowerCase() || '.jpg'
    const baseName = path.basename(originalName, path.extname(originalName))
    // Remove unsafe chars but keep Chinese and common symbols
    const safeBase = baseName.replace(/[^a-zA-Z0-9一-鿿\-_ ]/g, '').trim() || 'image'
    let filename = `${safeBase}${ext}`
    // If already exists, add timestamp
    if (fs.existsSync(path.join(photoDir, filename))) {
      filename = `${safeBase}_${Date.now()}${ext}`
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(path.join(photoDir, filename), buffer)

    return NextResponse.json({
      success: true,
      url: `/Photo/${filename}`,
      name: filename,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '上传失败' }, { status: 500 })
  }
}

// DELETE: remove a photo
export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json()
    if (!filename) {
      return NextResponse.json({ error: '缺少文件名' }, { status: 400 })
    }
    const safeName = path.basename(filename)
    const filePath = path.join(process.cwd(), 'public', 'Photo', safeName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: '文件不存在' }, { status: 404 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
