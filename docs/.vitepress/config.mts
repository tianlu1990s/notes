import { defineConfig } from 'vitepress';

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
          items: [],
        },
      ],
      '/articles/os/centos': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/os/windows': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/software/redis': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/software/mysql': [
        {
          text: '',
          base: '/articles/software/haproxy/',
          items: [
            { text: 'HAProxy', link: 'haproxy' },
            { text: '配置手册', link: 'manual' },
            { text: 'FAQ', link: 'faq' },
          ],
        },
      ],
      '/articles/software/sqlite': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/software/nginx': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/software/haproxy': [
        {
          text: '',
          base: '/articles/software/haproxy/',
          items: [
            { text: 'HAProxy', link: 'haproxy' },
            { text: '配置手册', link: 'manual' },
            { text: 'FAQ', link: 'faq' },
          ],
        },
      ],
      '/articles/software/git': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/language/golang': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/language/c': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/language/cpp': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/cncf/docker': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/cncf/swarm': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/cncf/kubernets': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/others/idea': [
        {
          text: '',
          items: [],
        },
      ],
      '/articles/others/sad': [
        {
          text: '',
          items: [],
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
