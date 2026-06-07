import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfig, updateSiteConfig } from '@/lib/site-config'

export async function GET() {
  const config = getSiteConfig()
  return NextResponse.json(config)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = updateSiteConfig(body)
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '更新失败' }, { status: 400 })
  }
}
