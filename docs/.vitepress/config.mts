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
  description: 'A Personal Notes',
  base: '/notes/',
  head: [
    ['link', { 
      rel: 'icon', 
      href: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iI0ZGNDU1NyIvPgo8cGF0aCBkPSJNMTYgMjMuNUwxNC4xIDIxLjZDMTEuOSAxOS4zIDggMTUuNSA4IDExLjVDOCA4LjcgMTAuMiA2LjUgMTMgNi41QzE0LjQgNi41IDE1LjggNy4yIDE2IDguMUMxNi4yIDcuMiAxNy42IDYuNSAxOSA2LjVDMjEuOCA2LjUgMjQgOC43IDI0IDExLjVDMjQgMTUuNSAyMC4xIDE5LjMgMTcuOSAyMS42TDE2IDIzLjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
    }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'OS',
        items: [
          { text: 'Linux', link: '/articles/os/linux/linux' },
          { text: 'Debian', link: '/articles/os/debian/debian' },
          { text: 'CentOS', link: '/articles/os/centos/centos' },
          { text: 'Windows', link: '/articles/os/windows/windows' },
        ],
      },
      {
        text: 'Software',
        items: [
          { text: 'Redis', link: '/articles/software/redis/redis' },
          { text: 'MySQL', link: '/articles/software/mysql/mysql' },
          { text: 'Sqlite', link: '/articles/software/sqlite/sqlite' },
          { text: 'Nginx', link: '/articles/software/nginx/nginx' },
          { text: 'HAProxy', link: '/articles/software/haproxy/haproxy' },
          { text: 'Kafka', link: '/articles/software/kafka/kafka' },
        ],
      },
      {
        text: 'Language',
        items: [
          { text: 'Bash', link: '/articles/language/bash/bash' },
          { text: 'Golang', link: '/articles/language/golang/golang' },
          { text: 'C', link: '/articles/language/c/c' },
          { text: 'C++', link: '/articles/language/cpp/cpp' },
        ],
      },
      {
        text: 'CNCF',
        items: [
          { text: 'Docker', link: '/articles/cncf/docker/docker' },
          { text: 'Swarm', link: '/articles/cncf/swarm/swarm' },
          { text: 'Kubernets', link: '/articles/cncf/kubernetes/kubernetes' },
        ],
      },
      {
        text: 'Course',
        items: [{ text: 'SAD', link: '/articles/course/sad/sad' }],
      },
      {
        text: 'Others',
        items: [{ text: 'Git', link: '/articles/others/git/git' }],
      },
    ],
    sidebar: {
      '/articles/os/linux': [
        {
          text: '',
          items: generateSidebarItems('articles/os/linux'),
        },
      ],
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
      '/articles/software/kafka': [
        {
          text: '',
          items: generateSidebarItems('articles/software/kafka'),
        },
      ],
      '/articles/software/git': [
        {
          text: '',
          items: generateSidebarItems('articles/software/git'),
        },
      ],
      '/articles/language/bash': [
        {
          text: '',
          items: generateSidebarItems('articles/language/bash'),
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
          items: generateSidebarItems('articles/cncf/kubernetes'),
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
