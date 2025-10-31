// docs/.vitepress/nav-generator.ts
import type { DefaultTheme } from 'vitepress'
import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.resolve(__dirname, '../articles')

function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

const CATEGORY_NAME_MAP: Record<string, string> = {
  cncf: 'CNCF',
  cpp: 'C++',
  os: 'OS',
  software: 'Software',
  language: 'Language',
  course: 'Course',
  others: 'Others',
}

export function generateNavFromArticles(): DefaultTheme.NavItem[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.warn('Articles directory not found')
    return []
  }

  const categories = fs.readdirSync(ARTICLES_DIR).filter(f =>
    fs.statSync(path.join(ARTICLES_DIR, f)).isDirectory()
  )

  const navItems: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
  ]

  for (const category of categories) {
    const categoryPath = path.join(ARTICLES_DIR, category)
    const subdirs = fs.readdirSync(categoryPath).filter(f =>
      fs.statSync(path.join(categoryPath, f)).isDirectory()
    )

    const childItems: DefaultTheme.NavItem[] = []
    for (const subdir of subdirs) {
      const mdFiles = fs.readdirSync(path.join(categoryPath, subdir)).filter(f => f.endsWith('.md'))
      if (mdFiles.length === 0) continue

      const targetFile = mdFiles.find(f => f === `${subdir}.md`) || mdFiles[0]
      const fileName = targetFile.replace(/\.md$/, '')
      const link = `/articles/${category}/${subdir}/${fileName}`

      childItems.push({
        text: toTitleCase(subdir),
        link,
      })
    }

    if (childItems.length > 0) {
      // ✅ 关键：构造一个符合 DefaultTheme.NavItem 的分组对象
      const group: DefaultTheme.NavItem = {
        text: CATEGORY_NAME_MAP[category] || toTitleCase(category),
        items: childItems,
      }
      navItems.push(group)
    }
  }

  return navItems
}