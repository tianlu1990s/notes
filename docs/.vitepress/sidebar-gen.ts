// docs/.vitepress/sidebar-generator.ts
import type { DefaultTheme } from 'vitepress'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter' // 用于读取 frontmatter

const DOCS_DIR = path.resolve(__dirname, '..')
const ARTICLES_DIR = path.join(DOCS_DIR, 'articles')

function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// 读取 Markdown 文件的 title（优先 frontmatter，否则文件名）
function getMarkdownTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: _ } = matter(content)
    if (data.title && typeof data.title === 'string') {
      return data.title
    }
  } catch (e) {
    // ignore
  }
  const baseName = path.basename(filePath, '.md')
  return toTitleCase(baseName)
}

// 递归扫描目录，生成 sidebar items（支持嵌套）
function walkDir(dirPath: string, basePath: string): DefaultTheme.SidebarItem[] {
  const items: DefaultTheme.SidebarItem[] = []
  const entries = fs.readdirSync(dirPath)

  // 先处理 .md 文件（作为叶子）
  const mdFiles = entries
    .filter(f => f.endsWith('.md'))
    .sort() // 可按需自定义排序
    .map(file => {
      const fullPath = path.join(dirPath, file)
      const relativePath = path.relative(DOCS_DIR, fullPath).replace(/\.md$/, '').replace(/\\/g, '/')
      const link = '/' + relativePath
      const text = getMarkdownTitle(fullPath)
      return { text, link }
    })

  items.push(...mdFiles)

  // 再处理子目录（作为分组）
  const subdirs = entries
    .filter(f => fs.statSync(path.join(dirPath, f)).isDirectory())
    .sort()

  for (const subdir of subdirs) {
    const subdirPath = path.join(dirPath, subdir)
    const childItems = walkDir(subdirPath, basePath)

    if (childItems.length > 0) {
      const groupText = toTitleCase(subdir)
      items.push({
        text: groupText,
        collapsed: false,
        items: childItems,
      })
    }
  }

  return items
}

// 生成整个 sidebar 配置
export function generateSidebar(): DefaultTheme.Sidebar {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return {}
  }

  const sidebar: DefaultTheme.Sidebar = {}

  const categories = fs.readdirSync(ARTICLES_DIR).filter(f =>
    fs.statSync(path.join(ARTICLES_DIR, f)).isDirectory()
  )

  for (const category of categories) {
    const categoryPath = path.join(ARTICLES_DIR, category)
    const items = walkDir(categoryPath, category)

    if (items.length > 0) {
      const routePrefix = `/articles/${category}/`
      sidebar[routePrefix] = items
    }
  }

  return sidebar
}