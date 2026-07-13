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
        'antdv-next',
        /^dayjs/,
        '@antdv-next1/pro-card',
        '@antdv-next1/pro-field',
        '@antdv-next1/pro-form',
        '@antdv-next1/pro-layout',
        '@antdv-next1/pro-listy',
        '@antdv-next1/pro-provider',
        '@antdv-next1/pro-table',
        '@antdv-next1/pro-utils',
        '@antdv-next1/route-utils',
      ],
      output: {
        exports: 'named',
        globals: {
          'vue': 'Vue',
          'dayjs': 'dayjs',
          'antdv-next': 'antd',
          '@antdv-next1/pro-card': 'ProCard',
          '@antdv-next1/pro-field': 'ProField',
          '@antdv-next1/pro-form': 'ProForm',
          '@antdv-next1/pro-layout': 'ProLayout',
          '@antdv-next1/pro-listy': 'ProListy',
          '@antdv-next1/pro-provider': 'ProProvider',
          '@antdv-next1/pro-table': 'ProTable',
          '@antdv-next1/pro-utils': 'ProUtils',
          '@antdv-next1/route-utils': 'RouteUtils',
          'dayjs/locale/zh-cn.js': 'dayjs_locale_zh_cn',
          'dayjs/plugin/quarterOfYear.js': 'dayjs_plugin_quarterOfYear',
          'dayjs/plugin/relativeTime.js': 'dayjs_plugin_relativeTime',
          'dayjs/plugin/isoWeek.js': 'dayjs_plugin_isoWeek',
          'dayjs/plugin/localizedFormat.js': 'dayjs_plugin_localizedFormat',
          'dayjs/plugin/advancedFormat.js': 'dayjs_plugin_advancedFormat',
          'dayjs/plugin/customParseFormat.js': 'dayjs_plugin_customParseFormat',
          'dayjs/plugin/localeData.js': 'dayjs_plugin_localeData',
          'dayjs/plugin/weekday.js': 'dayjs_plugin_weekday',
          'dayjs/plugin/weekOfYear.js': 'dayjs_plugin_weekOfYear',
          'dayjs/plugin/weekYear.js': 'dayjs_plugin_weekYear',
        },
      },
    },
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ProComponents',
      fileName: () => 'pro-components.js',
      formats: ['umd'],
    },
  },
})
