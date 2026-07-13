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
        '@v-c/resize-observer',
        /^@antdv-next\/cssinjs/,
        '@ant-design/fast-color',
        '@dnd-kit/dom',
        '@dnd-kit/helpers',
        /^@dnd-kit\/vue/,
        /^@dnd-kit\/abstract/,
        '@antdv-next1/pro-card',
        '@antdv-next1/pro-field',
        '@antdv-next1/pro-form',
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-utils',
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProTable',
      fileName: () => 'pro-table.esm.js',
      formats: ['es'],
    },
  },
})
