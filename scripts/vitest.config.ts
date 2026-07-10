import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vueJsx()],
  test: {
    include: ['scripts/**/*.test.ts', 'scripts/**/*.test.js'],
  },
})
