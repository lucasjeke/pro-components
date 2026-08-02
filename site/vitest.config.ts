import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

const siteRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: siteRoot,
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
  ],
  resolve: {
    alias: [
      {
        find: /^@antdv-next1\/pro-layout/,
        replacement: fileURLToPath(new URL('../packages/layout/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-provider/,
        replacement: fileURLToPath(new URL('../packages/provider/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-field/,
        replacement: fileURLToPath(new URL('../packages/field/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-utils/,
        replacement: fileURLToPath(new URL('../packages/utils/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/route-utils/,
        replacement: fileURLToPath(new URL('../packages/route-utils/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-listy/,
        replacement: fileURLToPath(new URL('../packages/listy/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-card/,
        replacement: fileURLToPath(new URL('../packages/card/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-form/,
        replacement: fileURLToPath(new URL('../packages/form/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-table/,
        replacement: fileURLToPath(new URL('../packages/table/src', import.meta.url)),
      },
      {
        find: /^@antdv-next1\/pro-components/,
        replacement: fileURLToPath(new URL('../packages/components/src', import.meta.url)),
      },
      {
        find: /^dayjs\/plugin\/([^.]*)$/,
        replacement: 'dayjs/plugin/$1.js',
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    include: ['src/**/*.test.ts', 'plugins/**/*.test.ts'],
    environment: 'jsdom',
    server: {
      deps: {
        inline: [/@v-c\//],
      },
    },
  },
})
