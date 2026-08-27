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
        /^antdv-next/,
        /^@v-c\/util/,
        /^dayjs/,
        'swrv',
        'es-toolkit',
        /^@antdv-next\/cssinjs/,
        '@antdv-next/icons',
        '@v-c/resize-observer',
        '@antdv-next1/pro-card',
        '@antdv-next1/pro-field',
        '@antdv-next1/pro-form',
        '@antdv-next1/pro-layout',
        '@antdv-next1/pro-listy',
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-table',
        '@antdv-next1/pro-utils',
        '@antdv-next1/pro-descriptions',
        '@antdv-next1/pro-skeleton',
        '@antdv-next1/route-utils',
        '@v-c/virtual-list',
        '@dnd-kit/dom',
        '@dnd-kit/helpers',
        '@dnd-kit/collision',
        /^@dnd-kit\/vue/,
        /^@dnd-kit\/abstract/,
        '@ant-design/colors',
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProComponents',
      fileName: () => 'pro-components.esm.js',
      formats: ['es'],
    },
  },
})
