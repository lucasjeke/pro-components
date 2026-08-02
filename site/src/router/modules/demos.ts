import type { RouteRecordRaw } from 'vue-router'
import { extractInlineDemos } from '@/components/CodeDemo/utils/inline-demo'

const pageDemos = import.meta.glob([
  '/src/pages/components/**/demo/*.vue',
  '!/src/pages/components/**/components',
])

const markdownPages = import.meta.glob('/src/pages/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function createInlineDemoRoutes(pages: Record<string, string>) {
  return Object.entries(pages).flatMap(([filePath, markdown]) => {
    return extractInlineDemos(filePath, markdown).map(demo => ({
      path: `/~demos/${demo.id}`,
      component: () => import('@/components/CodeDemo/inline-page.vue'),
      props: {
        id: demo.id,
        source: encodeURIComponent(demo.source),
      },
    } satisfies RouteRecordRaw))
  })
}

export function generateDemoRoutes(pages: Record<string, string> = markdownPages) {
  const routes: RouteRecordRaw[] = createInlineDemoRoutes(pages)

  for (const pageDemosKey in pageDemos) {
    const component = pageDemos[pageDemosKey]
    const key = pageDemosKey.replace('/src/pages/components/', '').replace('.vue', '').replace(/\//g, '-')
    const route = {
      path: `/~demos/${key}`,
      component,
    }
    routes.push(route as RouteRecordRaw)
  }
  return routes
}

export default generateDemoRoutes()
