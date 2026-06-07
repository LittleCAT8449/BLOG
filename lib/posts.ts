import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const draftsDirectory = path.join(process.cwd(), 'content/drafts')

export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  description: string
  coverImage?: string
  author?: string
  draft?: boolean
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  excerpt: string
  readingTime: number
}

function readMarkdownFiles(dir: string): Post[] {
  if (!fs.existsSync(dir)) return []

  const filenames = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const filePath = path.join(dir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    const excerpt = content
      .replace(/^#.*$/gm, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
      .replace(/[`*_~>#\[\]()|-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 180)

    const wordCount = content.replace(/\s+/g, '').length
    const readingTime = Math.max(1, Math.ceil(wordCount / 500))

    return {
      slug,
      frontmatter: {
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: data.tags || [],
        description: data.description || excerpt.slice(0, 120),
        coverImage: data.coverImage || undefined,
        author: data.author || 'Anonymous',
        draft: data.draft || false,
      },
      content,
      excerpt,
      readingTime,
    }
  })

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  )
}

let postsCache: Post[] | null = null
let draftsCache: Post[] | null = null

export function getAllPosts(): Post[] {
  if (postsCache) return postsCache
  postsCache = readMarkdownFiles(postsDirectory).filter((p) => !p.frontmatter.draft)
  return postsCache
}

export function getAllDrafts(): Post[] {
  if (draftsCache) return draftsCache
  draftsCache = readMarkdownFiles(draftsDirectory)
  return draftsCache
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = [...getAllPosts(), ...getAllDrafts()]
  return posts.find((p) => p.slug === slug)
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) =>
    post.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAdjacentPosts(slug: string): {
  prev: Post | null
  next: Post | null
} {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}

export function getPaginatedPosts(page: number, perPage: number = 9): { posts: Post[]; totalPages: number } {
  const allPosts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  const posts = allPosts.slice(start, start + perPage)

  return { posts, totalPages }
}

export function invalidateCache(): void {
  postsCache = null
  draftsCache = null
}

function buildFrontmatterString(frontmatter: PostFrontmatter): string {
  const lines: string[] = ['---']
  lines.push(`title: "${frontmatter.title}"`)
  lines.push(`date: "${frontmatter.date.split('T')[0]}"`)
  if (frontmatter.tags.length > 0) {
    lines.push(`tags: [${frontmatter.tags.map((t) => `"${t}"`).join(', ')}]`)
  }
  if (frontmatter.description) {
    lines.push(`description: "${frontmatter.description}"`)
  }
  if (frontmatter.coverImage) {
    lines.push(`coverImage: "${frontmatter.coverImage}"`)
  }
  if (frontmatter.author) {
    lines.push(`author: "${frontmatter.author}"`)
  }
  if (frontmatter.draft) {
    lines.push('draft: true')
  }
  lines.push('---')
  return lines.join('\n')
}

export function createPost(
  slug: string,
  frontmatter: PostFrontmatter,
  content: string
): void {
  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (fs.existsSync(filePath)) {
    throw new Error(`文章 "${slug}" 已存在`)
  }
  const frontmatterStr = buildFrontmatterString(frontmatter)
  const fullContent = `${frontmatterStr}\n\n${content.trim()}\n`
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, fullContent)
  invalidateCache()
}

export function updatePost(
  originalSlug: string,
  newSlug: string,
  frontmatter: PostFrontmatter,
  content: string
): void {
  const oldPath = path.join(postsDirectory, `${originalSlug}.md`)
  const draftPath = path.join(draftsDirectory, `${originalSlug}.md`)

  // Determine if the post is a draft
  let actualPath: string
  if (fs.existsSync(oldPath)) {
    actualPath = oldPath
  } else if (fs.existsSync(draftPath)) {
    actualPath = draftPath
  } else {
    throw new Error(`文章 "${originalSlug}" 不存在`)
  }

  const frontmatterStr = buildFrontmatterString(frontmatter)
  const fullContent = `${frontmatterStr}\n\n${content.trim()}\n`

  // If slug changed or draft status changed, move the file
  const targetDir = frontmatter.draft ? draftsDirectory : postsDirectory
  const newPath = path.join(targetDir, `${newSlug}.md`)

  if (actualPath !== newPath) {
    const newDir = path.dirname(newPath)
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true })
    fs.renameSync(actualPath, newPath)
  }

  fs.writeFileSync(newPath, fullContent)
  invalidateCache()
}

export function deletePost(slug: string): void {
  const postsPath = path.join(postsDirectory, `${slug}.md`)
  const draftsPath = path.join(draftsDirectory, `${slug}.md`)

  if (fs.existsSync(postsPath)) {
    fs.unlinkSync(postsPath)
  } else if (fs.existsSync(draftsPath)) {
    fs.unlinkSync(draftsPath)
  } else {
    throw new Error(`文章 "${slug}" 不存在`)
  }
  invalidateCache()
}
