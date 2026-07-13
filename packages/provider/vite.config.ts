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
        '@ant-design/fast-color',
        '@v-c/util',
        /^antdv-next/,
        /^dayjs/,
        /^@antdv-next\/cssinjs/,
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProProvider',
      fileName: () => 'pro-provider.esm.js',
      formats: ['es'],
    },
  },
})
