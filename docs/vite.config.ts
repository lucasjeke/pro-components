import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dayjsPlugin from 'vite-plugin-dayjs'
import inspect from 'vite-plugin-inspect'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import virtualAntdCss from './plugins/css-plugin'
import { mdPlugin } from './plugins/markdown'

import { postcssIsolateStyles } from './plugins/markdown/isolateStyles.ts'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
const docsBuildTarget = ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'] as const

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      virtualAntdCss({
        development: false,
      }),
      dayjsPlugin(),
      mdPlugin(),
      tsxResolveTypes({
        defaultPropsToUndefined: ['Boolean'],
      }),
      vueJsx({ mergeProps: true }),
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      inspect(),
      autoImport({
        dirs: ['./src/stores'],
        dts: 'types/auto-imports.d.ts',
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia', 'vue-i18n'],
      }),
      components({
        dirs: [],
        dts: 'types/components.d.ts',
        resolvers: [AntdvNextResolver()],
      }),
      Unocss(),
    // prefetch(),
    ],
    // server: {
    //   host: '0.0.0.0',
    //   port: 3322,
    // },
    optimizeDeps: {
      exclude: [
        '@v-c/segmented',
        '@v-c/trigger',
        '@v-c/tooltip',
        '@v-c/util',
        '@v-c/menu',
        '@v-c/tour',
        '@v-c/input',
        '@v-c/input-number',
        '@v-c/textarea',
        '@v-c/select',
        '@v-c/picker',
        '@v-c/drawer',
        '@v-c/dialog',
      ],
      include: ['@antdv-next/icons', '@antdv-next/icons/all', '@ant-design/icons-svg/es/asn/*'],
    },
    resolve: {
      alias: [
        {
          find: /^@antdv-next1\/pro-layout/,
          replacement: path.resolve(baseUrl, '../packages/layout/src'),
        },
        {
          find: /^@antdv-next1\/pro-provider/,
          replacement: path.resolve(baseUrl, '../packages/provider/src'),
        },
        {
          find: /^@antdv-next1\/pro-field/,
          replacement: path.resolve(baseUrl, '../packages/field/src'),
        },
        {
          find: /^@antdv-next1\/pro-listy/,
          replacement: path.resolve(baseUrl, '../packages/listy/src'),
        },
        {
          find: /^@antdv-next1\/pro-card/,
          replacement: path.resolve(baseUrl, '../packages/card/src'),
        },
        {
          find: /^@antdv-next1\/pro-form/,
          replacement: path.resolve(baseUrl, '../packages/form/src'),
        },
        {
          find: /^@antdv-next1\/pro-table/,
          replacement: path.resolve(baseUrl, '../packages/table/src'),
        },
        {
          find: /^@antdv-next1\/pro-components/,
          replacement: path.resolve(baseUrl, '../packages/components/src'),
        },
        {
          find: /^@antdv-next1\/pro-utils/,
          replacement: path.resolve(baseUrl, '../packages/utils/src'),
        },
        {
          find: /^@antdv-next1\/route-utils/,
          replacement: path.resolve(baseUrl, '../packages/route-utils/src'),
        },
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    css: {
      postcss: {
        plugins: [postcssIsolateStyles()],
      },
    },
    build: {
    // Lock the docs site target to Vite's current baseline so future browser
    // version bumps do not leak unsupported targets like `chrome142` into the build.
      target: [...docsBuildTarget],
      cssTarget: [...docsBuildTarget],
      sourcemap: false,
    },
  }
})
