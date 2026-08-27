import type { RouteRecordRaw } from 'vue-router'
import { headerItems } from '@/config/menu/header'
import { createGroupedLocaleRoutes } from '../generator'

const pageModules = import.meta.glob([
  '/src/pages/**/*.vue',
  '/src/pages/**/*.zh-CN.md',
  '/src/pages/**/*.en-US.md',
  '!/src/pages/home/**',
  '!/src/pages/components/**/demo/**',
  '!/src/pages/components/**/components/**',
])

const menuPrefixes = headerItems
  .map(item => item?.key)
  .filter((key): key is string => typeof key === 'string' && key !== '/')

export default createGroupedLocaleRoutes(pageModules, {
  layout: () => import('@/layouts/docs/index.vue'),
  menuPrefixes,
}) as RouteRecordRaw[]
