import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineProject, mergeConfig } from 'vitest/config'
import vitestPlugin from '../../vitest-plugin.ts'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
const rootUrl = fileURLToPath(new URL('../..', import.meta.url))

const tableProjectConfig = defineProject({
  resolve: {
    alias: [
      {
        find: /^antdv-next$/,
        replacement: path.resolve(rootUrl, 'node_modules/antdv-next/dist/index.js'),
      },
      {
        find: /^@antdv-next1\/pro-form$/,
        replacement: path.resolve(baseUrl, '../form/src'),
      },
      {
        find: /^@antdv-next1\/pro-table$/,
        replacement: path.resolve(baseUrl, './src'),
      },
    ],
  },
  test: {
    include: [
      '**/tests/**/*.test.ts',
      '**/tests/**/*.test.tsx',
    ],
    environment: 'jsdom',
    server: {
      deps: {
        inline: [/@v-c\//],
      },
    },
  },
})

const config = mergeConfig(vitestPlugin, tableProjectConfig)
const currentAlias = Array.isArray(config.resolve?.alias) ? config.resolve.alias : []

export default {
  ...config,
  resolve: {
    ...config.resolve,
    alias: [
      ...tableProjectConfig.resolve!.alias as any[],
      ...currentAlias.filter((alias: any) => !tableProjectConfig.resolve!.alias!.some((item: any) => item.find?.toString() === alias.find?.toString())),
    ],
  },
}
