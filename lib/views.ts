import fs from 'fs'
import path from 'path'

const viewsFile = path.join(process.cwd(), 'content', 'views.json')

interface ViewsData {
  [slug: string]: number
}

function readViews(): ViewsData {
  try {
    if (fs.existsSync(viewsFile)) {
      const data = fs.readFileSync(viewsFile, 'utf-8')
      return JSON.parse(data)
    }
  } catch {
    // ignore parse errors
  }
  return {}
}

function writeViews(data: ViewsData): void {
  const dir = path.dirname(viewsFile)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(viewsFile, JSON.stringify(data, null, 2))
}

export function getViews(slug: string): number {
  const views = readViews()
  return views[slug] || 0
}

export function incrementViews(slug: string): number {
  const views = readViews()
  views[slug] = (views[slug] || 0) + 1
  writeViews(views)
  return views[slug]
}

export function getAllViews(): ViewsData {
  return readViews()
}
