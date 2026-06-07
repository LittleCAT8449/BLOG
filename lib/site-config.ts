import fs from 'fs'
import path from 'path'

const configFile = path.join(process.cwd(), 'content', 'site-config.json')

export interface SiteConfig {
  heroBackgroundImage: string
  heroTitle: string
  heroDescription: string
  pageBackgroundImage: string
}

const defaultConfig: SiteConfig = {
  heroBackgroundImage: '',
  heroTitle: 'Welcome to My Blog',
  heroDescription: 'Thoughts, stories, and ideas about technology, design, and the world around us.',
  pageBackgroundImage: '',
}

export function getSiteConfig(): SiteConfig {
  try {
    if (fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, 'utf-8')
      return { ...defaultConfig, ...JSON.parse(data) }
    }
  } catch { /* ignore */ }
  return defaultConfig
}

export function updateSiteConfig(partial: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig()
  const updated = { ...current, ...partial }
  const dir = path.dirname(configFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(configFile, JSON.stringify(updated, null, 2))
  return updated
}
