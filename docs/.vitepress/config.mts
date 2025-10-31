// import { defineConfig } from 'vitepress';
// .vitepress/config.mts
import { defineConfig } from 'vitepress';
import { generateNavFromArticles } from './nav-gen'
import { generateSidebar } from './sidebar-gen'

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
    nav: generateNavFromArticles(),
    sidebar: generateSidebar(),
    
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


