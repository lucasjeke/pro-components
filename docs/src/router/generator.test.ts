import { describe, expect, it } from 'vitest'
import { createGroupedLocaleRoutes, getLocaleRouteInfo } from './generator'

const modules = {
  '/src/pages/components/index.zh-CN.md': () => Promise.resolve({ default: 'components zh' }),
  '/src/pages/components/index.en-US.md': () => Promise.resolve({ default: 'components en' }),
  '/src/pages/components/layout/index.zh-CN.md': () => Promise.resolve({ default: 'layout zh' }),
  '/src/pages/components/layout/index.en-US.md': () => Promise.resolve({ default: 'layout en' }),
  '/src/pages/docs/index.zh-CN.md': () => Promise.resolve({ default: 'docs zh' }),
  '/src/pages/changelog/index.zh-CN.md': () => Promise.resolve({ default: 'changelog zh' }),
  '/src/pages/changelog/index.en-US.md': () => Promise.resolve({ default: 'changelog en' }),
  '/src/pages/changelog/pro-form.zh-CN.md': () => Promise.resolve({ default: 'pro form changelog zh' }),
  '/src/pages/changelog/pro-form.en-US.md': () => Promise.resolve({ default: 'pro form changelog en' }),
}

describe('router generator', () => {
  it('normalizes index pages to the base route instead of reading menu labels', () => {
    expect(getLocaleRouteInfo('/src/pages/components/index.zh-CN.md')).toEqual({
      basePath: '/components',
      childPath: '',
      locale: 'zh-CN',
    })
  })

  it('creates only file-backed children and never turns menu groups into child routes', () => {
    const routes = createGroupedLocaleRoutes(modules, {
      layout: () => Promise.resolve({ default: 'layout' }),
      menuPrefixes: ['/components'],
    })

    expect(routes.map(route => route.path)).toEqual(['/components', '/en-US/components'])
    expect(routes.flatMap(route => route.children?.map(child => child.path) ?? [])).toEqual([
      '',
      'layout',
      '',
      'layout',
    ])
    expect(routes.flatMap(route => route.children?.map(child => child.path) ?? [])).not.toContain('architectureDesign')
    expect(routes.flatMap(route => route.children?.map(child => child.path) ?? [])).not.toContain('layoutGroup')
    expect(routes.flatMap(route => route.children?.map(child => child.path) ?? [])).not.toContain('design')
  })

  it('creates changelog routes for package-specific release notes', () => {
    const routes = createGroupedLocaleRoutes(modules, {
      layout: () => Promise.resolve({ default: 'layout' }),
      menuPrefixes: ['/changelog'],
    })

    expect(routes.map(route => route.path)).toEqual(['/changelog', '/en-US/changelog'])
    expect(routes.flatMap(route => route.children?.map(child => child.path) ?? [])).toEqual([
      '',
      'pro-form',
      '',
      'pro-form',
    ])
  })
})
