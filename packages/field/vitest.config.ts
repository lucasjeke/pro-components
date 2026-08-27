import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { defineProject } from 'vitest/config'

export default defineProject({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vue(),
    vueJsx({
      mergeProps: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^dayjs\/plugin\/([^.]*)$/,
        replacement: 'dayjs/plugin/$1.js',
      },
    ],
  },
  test: {
    include: [
      '**/tests/**/*.test.ts',
      '**/tests/**/*.test.tsx',
    ],
    environment: 'jsdom',
    server: {
      deps: {
        inline: [/@v-c\//],
      },
    },
  },
})
