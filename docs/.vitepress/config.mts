// import { defineConfig } from 'vitepress';
// .vitepress/config.mts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitepress';

// 获取当前目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 从 Markdown 文件提取标题
function getTitleFromMd(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : path.basename(filePath, '.md');
}

// 生成侧边栏项
function generateSidebarItems(rootDir: string, basePath = ''): any[] {
  const fullPath = path.join(__dirname, '../', rootDir, basePath);

  return fs
    .readdirSync(fullPath)
    .filter((item) => !item.startsWith('.') && !item.startsWith('_'))
    .sort((a, b) => {
      // 按数字前缀排序 (01-, 02-)
      const numA = parseInt(a.split('-')[0]) || 0;
      const numB = parseInt(b.split('-')[0]) || 0;
      return numA - numB;
    })
    .map((item) => {
      const itemPath = path.join(fullPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        return {
          text: item.replace(/-/g, ' '),
          collapsible: true,
          collapsed: false,
          items: generateSidebarItems(rootDir, path.join(basePath, item)),
        };
      } else if (item.endsWith('.md') && item.toLowerCase() !== 'index.md') {
        const linkPath = `/${path.join(rootDir, basePath, item.replace('.md', ''))}`;
        return {
          text: getTitleFromMd(itemPath),
          link: linkPath,
        };
      }
    })
    .filter(Boolean) as any[];
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Louis Notes',
  description: 'A VitePress Site',
  base: '/notes/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'OS',
        items: [
          { text: 'Debian', link: '/articles/os/debian/debian' },
          { text: 'CentOS', link: '/articles/os/centos' },
          { text: 'Windows', link: '/articles/os/windows' },
        ],
      },
      {
        text: 'Software',
        items: [
          { text: 'Redis', link: '/articles/software/redis' },
          { text: 'MySQL', link: '/articles/software/mysql' },
          { text: 'Sqlite', link: '/articles/software/sqlite' },
          { text: 'Nginx', link: '/articles/software/nginx' },
          { text: 'HAProxy', link: '/articles/software/haproxy/haproxy' },
        ],
      },
      {
        text: 'Language',
        items: [
          { text: 'Golang', link: '/articles/language/golang' },
          { text: 'C', link: '/articles/language/c' },
          { text: 'C++', link: '/articles/language/cpp' },
        ],
      },
      {
        text: 'CNCF',
        items: [
          { text: 'Docker', link: '/articles/cncf/docker' },
          { text: 'Swarm', link: '/articles/cncf/swarm' },
          { text: 'Kubernets', link: '/articles/cncf/kubernets' },
        ],
      },
      {
        text: 'Course',
        items: [{ text: 'SAD', link: '/articles/course/sad' }],
      },
      {
        text: 'Others',
        items: [{ text: 'Git', link: '/articles/others/git' }],
      },
    ],
    sidebar: {
      '/articles/os/debian': [
        {
          text: '',
          items: generateSidebarItems('articles/os/debian'),
        },
      ],
      '/articles/os/centos': [
        {
          text: '',
          items: generateSidebarItems('articles/os/centos'),
        },
      ],
      '/articles/os/windows': [
        {
          text: '',
          items: generateSidebarItems('articles/os/windows'),
        },
      ],
      '/articles/software/redis': [
        {
          text: '',
          items: generateSidebarItems('articles/software/redis'),
        },
      ],
      '/articles/software/mysql': [
        {
          text: '',
          items: generateSidebarItems('articles/software/mysql'),
        },
      ],
      '/articles/software/sqlite': [
        {
          text: '',
          items: generateSidebarItems('articles/software/sqlite'),
        },
      ],
      '/articles/software/nginx': [
        {
          text: '',
          items: generateSidebarItems('articles/software/nginx'),
        },
      ],
      '/articles/software/haproxy': [
        {
          text: '',
          items: generateSidebarItems('articles/software/haproxy'),
        },
      ],
      '/articles/software/git': [
        {
          text: '',
          items: generateSidebarItems('articles/software/git'),
        },
      ],
      '/articles/language/golang': [
        {
          text: '',
          items: generateSidebarItems('articles/language/golang'),
        },
      ],
      '/articles/language/c': [
        {
          text: '',
          items: generateSidebarItems('articles/language/c'),
        },
      ],
      '/articles/language/cpp': [
        {
          text: '',
          items: generateSidebarItems('articles/language/cpp'),
        },
      ],
      '/articles/cncf/docker': [
        {
          text: '',
          items: generateSidebarItems('articles/cncf/docker'),
        },
      ],
      '/articles/cncf/swarm': [
        {
          text: '',
          items: generateSidebarItems('articles/cncf/swarm'),
        },
      ],
      '/articles/cncf/kubernets': [
        {
          text: '',
          items: generateSidebarItems('articles/cncf/kubernets'),
        },
      ],
      '/articles/others/idea': [
        {
          text: '',
          items: generateSidebarItems('articles/others/idea'),
        },
      ],
      '/articles/others/sad': [
        {
          text: '',
          items: generateSidebarItems('articles/others/sad'),
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/tianlu1990s/notes' }],

    editLink: {
      pattern: 'https://github.com/tianlu1990s/notes/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Last Modified',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: {
      light: 'solarized-light',
      dark: 'solarized-dark',
    },
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
  },
  lastUpdated: true,
});
