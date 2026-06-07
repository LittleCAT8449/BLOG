import fs from 'fs'
import path from 'path'

const configFile = path.join(process.cwd(), 'content', 'site-config.json')

export interface SiteConfig {
  heroBackgroundImage: string
  heroTitle: string
  heroDescription: string
  pageBackgroundImage: string
  aboutTitle: string
  aboutBio: string
  aboutInterests: string
  aboutGithub: string
  aboutTwitter: string
  aboutEmail: string
  aboutLocation: string
  aboutAvatar: string
  aboutAvatarImage: string
  forceTheme: 'system' | 'light' | 'dark'
}

const defaultConfig: SiteConfig = {
  heroBackgroundImage: '',
  heroTitle: 'Welcome to My Blog',
  heroDescription: 'Thoughts, stories, and ideas about technology, design, and the world around us.',
  pageBackgroundImage: '',
  aboutTitle: 'About Me',
  aboutBio: 'Hello! I\'m a developer who loves building things and sharing knowledge. This blog is where I write about technology, programming, design, and whatever else catches my interest.\n\nWhen I\'m not coding, you can find me reading books, exploring new coffee shops, or hiking in the mountains. I believe in the power of writing to clarify thinking and connect with others.',
  aboutInterests: 'Web Development, React & Next.js, UI/UX Design, Open Source, Writing, Photography, Music, Coffee',
  aboutGithub: 'https://github.com',
  aboutTwitter: 'https://twitter.com',
  aboutEmail: 'hello@example.com',
  aboutLocation: 'Somewhere on Earth',
  aboutAvatar: 'B',
  aboutAvatarImage: '',
  forceTheme: 'system',
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
