import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET: list all photos in public/Photo/
export async function GET() {
  const photoDir = path.join(process.cwd(), 'public', 'Photo')
  try {
    if (!fs.existsSync(photoDir)) {
      return NextResponse.json({ photos: [] })
    }
    const files = fs.readdirSync(photoDir)
    const photos = files
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(f))
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

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: `不支持的图片格式: ${file.type}` }, { status: 400 })
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过 5MB' }, { status: 400 })
    }

    const photoDir = path.join(process.cwd(), 'public', 'Photo')
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir, { recursive: true })
    }

    // Sanitize filename
    let filename = file.name.replace(/[^a-zA-Z0-9._\-一-鿿]/g, '_')
    // If file already exists, add timestamp
    const filePath = path.join(photoDir, filename)
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filename)
      const base = path.basename(filename, ext)
      filename = `${base}_${Date.now()}${ext}`
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
    // Prevent path traversal
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
