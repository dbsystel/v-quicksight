import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'v-quicksight',
  description: 'A vue3 wrapper for the amazon-quicksight-embedding-sdk',
  base: '/v-quicksight/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get Started', link: '/get-started' },
      { text: 'Releases', link: 'https://github.com/dbsystel/v-quicksight/releases' }
    ],
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Get Started', link: '/get-started' },
          { text: 'Releases', link: 'https://github.com/dbsystel/v-quicksight/releases' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'v-quicksight', link: '/v-quicksight' },
          { text: 'v-quicksight-dashboard', link: '/v-quicksight-dashboard' },
          { text: 'v-quicksight-visual', link: '/v-quicksight-visual' },
          { text: 'v-quicksight-console', link: '/v-quicksight-console' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/dbsystel/v-quicksight' }]
  }
})
