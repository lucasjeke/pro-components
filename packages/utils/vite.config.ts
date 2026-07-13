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
        'es-toolkit',
        'safe-stable-stringify',
        '@antdv-next1/pro-provider',
        '@antdv-next/icons',
        /^@v-c\/util/,
        /^antdv-next/,
        /^dayjs/,
        /^@antdv-next\/cssinjs/,
      ],
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProUtils',
      fileName: () => 'pro-utils.esm.js',
      formats: ['es'],
    },
  },
})
