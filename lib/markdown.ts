import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // @ts-expect-error rehype-pretty-code types mismatch with unified ecosystem
    .use(rehypePrettyCode, {
      theme: { light: 'github-light', dark: 'github-dark' },
      keepBackground: true,
      onVisitLine(node: any) {
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(node: any) {
        node.properties.className?.push('line--highlighted')
      },
      onVisitHighlightedWord(node: any) {
        node.properties.className = ['word--highlighted']
      },
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}

export function extractTOC(html: string): { id: string; text: string; level: number }[] {
  const headingRegex = /<h([2-4])\s+id="([^"]*)"[^>]*>(.*?)<\/h[2-4]>/gi
  const toc: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(html)) !== null) {
    toc.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    })
  }

  return toc
}
