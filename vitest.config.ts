import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/*',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'packages/card/src/**/*.{ts,tsx}',
        'packages/field/src/**/*.{ts,tsx}',
        'packages/form/src/**/*.{ts,tsx}',
        'packages/layout/src/**/*.{ts,tsx}',
        'packages/listy/src/**/*.{ts,tsx}',
        'packages/provider/src/**/*.{ts,tsx}',
        'packages/route-utils/src/**/*.{ts,tsx}',
        'packages/provider/src/**/*.{ts,tsx}',
        'packages/utils/src/**/*.{ts,tsx}',
        'packages/table/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'packages/**/locale/*.{ts,tsx}',
      ],
    },
  },
})
