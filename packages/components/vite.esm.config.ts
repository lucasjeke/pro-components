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
