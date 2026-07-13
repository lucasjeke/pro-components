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
        /^@antdv-next\/icons/,
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-utils',
        /^@v-c\/util/,
        /^antdv-next/,
        /^@antdv-next\/cssinjs/,
        '@ant-design/fast-color',
        '@antdv-next1/pro-card',
        '@antdv-next1/pro-table',
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProListy',
      fileName: () => 'pro-listy.esm.js',
      formats: ['es'],
    },
  },
})
