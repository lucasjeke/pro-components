import { defineProject, mergeConfig } from 'vitest/config'
import vitestPlugin from '../../vitest-plugin.ts'

export default mergeConfig(vitestPlugin, defineProject({
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
}))
