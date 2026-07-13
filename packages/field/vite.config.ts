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
        'swrv',
        '@ant-design/fast-color',
        /^@antdv-next\/icons/,
        '@ant-design/colors',
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-utils',
        /^@v-c\/util/,
        /^antdv-next/,
        /^dayjs/,
        /^@antdv-next\/cssinjs/,
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProField',
      fileName: () => 'pro-field.esm.js',
      formats: ['es'],
    },
  },
})
