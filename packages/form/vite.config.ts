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
        '@antdv-next1/pro-field',
        /^@v-c\/util/,
        /^antdv-next/,
        /^@antdv-next\/cssinjs/,
        '@v-c/resize-observer',
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProForm',
      fileName: () => 'pro-form.esm.js',
      formats: ['es'],
    },
  },
})
