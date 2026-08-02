import type { RouteRecordRaw } from 'vue-router'

export type LocaleRoute = 'zh-CN' | 'en-US' | 'all'

export type LazyRouteComponent = () => Promise<unknown>

export interface LocaleRouteInfo {
  basePath: string
  childPath: string
  locale: LocaleRoute
}

export interface CreateGroupedLocaleRoutesOptions {
  layout: LazyRouteComponent
  menuPrefixes?: string[]
}

function normalizePagePath(filePath: string) {
  if (!filePath.startsWith('/src/pages/'))
    return null

  if (filePath.endsWith('.zh-CN.md')) {
    return {
      locale: 'zh-CN' as const,
      pagePath: filePath.replace('/src/pages/', '').replace('.zh-CN.md', ''),
    }
  }

  if (filePath.endsWith('.en-US.md')) {
    return {
      locale: 'en-US' as const,
      pagePath: filePath.replace('/src/pages/', '').replace('.en-US.md', ''),
    }
  }

  if (filePath.endsWith('.vue')) {
    return {
      locale: 'all' as const,
      pagePath: filePath.replace('/src/pages/', '').replace('.vue', ''),
    }
  }

  return null
}

export function getLocaleRouteInfo(filePath: string): LocaleRouteInfo | null {
  const normalized = normalizePagePath(filePath)

  if (!normalized)
    return null

  const segments = normalized.pagePath.split('/').filter(Boolean)
  if (!segments.length)
    return null

  if (segments[segments.length - 1] === 'index')
    segments.pop()

  const [baseSegment, ...childSegments] = segments
  if (!baseSegment)
    return null

  return {
    basePath: `/${baseSegment}`,
    childPath: childSegments.join('/'),
    locale: normalized.locale,
  }
}

function createChildRoute(path: string, component: LazyRouteComponent): RouteRecordRaw {
  return {
    path,
    component: component as RouteRecordRaw['component'],
  } as RouteRecordRaw
}

function sortChildRoutes(routes: RouteRecordRaw[]) {
  return routes.sort((a, b) => {
    if (a.path === '')
      return -1
    if (b.path === '')
      return 1
    return String(a.path).localeCompare(String(b.path))
  })
}

export function createGroupedLocaleRoutes(
  modules: Record<string, LazyRouteComponent>,
  options: CreateGroupedLocaleRoutesOptions,
): RouteRecordRaw[] {
  const allowedPrefixes = options.menuPrefixes
    ? new Set(options.menuPrefixes)
    : null
  const groups = new Map<string, {
    zh: RouteRecordRaw[]
    en: RouteRecordRaw[]
  }>()

  Object.keys(modules).sort().forEach((filePath) => {
    const routeInfo = getLocaleRouteInfo(filePath)
    const component = modules[filePath]

    if (!routeInfo || !component)
      return

    if (allowedPrefixes && !allowedPrefixes.has(routeInfo.basePath))
      return

    const group = groups.get(routeInfo.basePath) ?? {
      zh: [],
      en: [],
    }

    const route = createChildRoute(routeInfo.childPath, component)
    if (routeInfo.locale === 'zh-CN' || routeInfo.locale === 'all')
      group.zh.push(route)
    if (routeInfo.locale === 'en-US' || routeInfo.locale === 'all')
      group.en.push(route)

    groups.set(routeInfo.basePath, group)
  })

  const orderedBasePaths = [
    ...(options.menuPrefixes ?? []).filter(prefix => groups.has(prefix)),
    ...Array.from(groups.keys())
      .filter(prefix => !options.menuPrefixes?.includes(prefix))
      .sort((a, b) => a.localeCompare(b)),
  ]

  return orderedBasePaths.flatMap((basePath) => {
    const group = groups.get(basePath)

    if (!group)
      return []

    const routes: RouteRecordRaw[] = []

    if (group.zh.length) {
      routes.push({
        path: basePath,
        component: options.layout as RouteRecordRaw['component'],
        children: sortChildRoutes(group.zh),
      } as RouteRecordRaw)
    }

    if (group.en.length) {
      routes.push({
        path: `/en-US${basePath}`,
        component: options.layout as RouteRecordRaw['component'],
        children: sortChildRoutes(group.en),
      } as RouteRecordRaw)
    }

    return routes
  })
}
