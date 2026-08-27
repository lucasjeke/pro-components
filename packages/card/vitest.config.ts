import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import { defineProject, mergeConfig } from 'vitest/config'
import vitestPlugin from '../../vitest-plugin.ts'

const rootUrl = fileURLToPath(new URL('../..', import.meta.url))

const cardProjectConfig = defineProject({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^antdv-next$/,
        replacement: path.resolve(rootUrl, 'node_modules/antdv-next/dist/index.js'),
      },
      {
        find: /^@antdv-next\/cssinjs$/,
        replacement: path.resolve(rootUrl, 'node_modules/@antdv-next/cssinjs/dist/index.js'),
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

const config = mergeConfig(vitestPlugin, cardProjectConfig)
const currentAlias = Array.isArray(config.resolve?.alias) ? config.resolve.alias : []
const staleWorkspaceAliases = new Set([
  /^antdv-next/.toString(),
  /^@antdv-next\/cssinjs/.toString(),
])

export default {
  ...config,
  resolve: {
    ...config.resolve,
    alias: [
      ...cardProjectConfig.resolve!.alias as any[],
      ...currentAlias.filter((alias: any) => (
        !staleWorkspaceAliases.has(alias.find?.toString())
        && !cardProjectConfig.resolve!.alias!.some((item: any) => item.find?.toString() === alias.find?.toString())
      )),
    ],
  },
}
