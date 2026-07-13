import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'tsdown'
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
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/tests/*',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
  ],
  unbundle: true,
  format: 'es',
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
  // minify: true,
  clean: true,
  deps: {
    onlyBundle: false,
    skipNodeModulesBundle: true,
    neverBundle: [
      'vue',
      '@antdv-next/icons',
      'csstype',
      '@v-c/util',
      /^dayjs\//,
      /^antdv-next\//,
      /^@antdv-next\/cssinjs\//,
    ],
  },
})
