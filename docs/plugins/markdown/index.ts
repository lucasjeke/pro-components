import type { PluginOption } from 'vite'
import { demoPlugin } from './demo/index.ts'
import { md2VuePlugin } from './md2vue.ts'

export function mdPlugin(): PluginOption[] {
  return [
    md2VuePlugin(),
    demoPlugin(),
  ]
}
