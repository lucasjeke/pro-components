import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx({
      mergeProps: true,
    }),
  ],
  build: {
    rolldownOptions: {
      external: [
        'vue',
        /^dayjs/,
        /^antdv-next/,
        /^@v-c\/util/,
        '@antdv-next/icons',
        /^@antdv-next\/cssinjs/,
        '@antdv-next1/pro-field',
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-utils',
        '@antdv-next1/pro-form',
        '@antdv-next1/pro-skeleton',
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProDescriptions',
      fileName: () => 'pro-descriptions.esm.js',
      formats: ['es'],
    },
  },
})
