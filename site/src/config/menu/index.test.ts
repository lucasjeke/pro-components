import { describe, expect, it } from 'vitest'
import { collectMenuKeys, collectRouteMenuKeys, getMenuLocaleLabel, isRouteMenuItem, menusMap } from './index'

describe('menu key collection', () => {
  it('collects navigable keys and label locale keys, but skips group identity keys', () => {
    expect(collectMenuKeys([
      {
        key: 'architectureDesign',
        label: 'architectureDesign',
        type: 'group',
        children: [
          { key: '/components', label: '/components/design' },
        ],
      },
      {
        key: 'layoutGroup',
        label: 'layoutGroup',
        type: 'group',
        children: [
          { key: '/components/layout', label: '/components/layout' },
        ],
      },
    ])).toEqual(new Set([
      'architectureDesign',
      '/components',
      '/components/design',
      'layoutGroup',
      '/components/layout',
    ]))
  })

  it('collects docs group labels without treating slash-prefixed group keys as routes', () => {
    const docsItems = [
      {
        key: '/docs/use',
        label: '/docs/use',
        type: 'group' as const,
        children: [
          { key: '/docs', label: '/docs' },
        ],
      },
      {
        key: '/docs/other',
        label: '/docs/other',
        type: 'group' as const,
        children: [
          { key: '/docs/faq', label: '/docs/faq' },
        ],
      },
    ]

    expect(collectMenuKeys(docsItems)).toEqual(new Set([
      '/docs/use',
      '/docs',
      '/docs/other',
      '/docs/faq',
    ]))
    expect(collectRouteMenuKeys(docsItems)).toEqual(new Set([
      '/docs',
      '/docs/faq',
    ]))
  })

  it('treats only non-group slash-prefixed menu items as route menu items', () => {
    expect(isRouteMenuItem({ key: '/components' })).toBe(true)
    expect(isRouteMenuItem({ key: '/components/layout' })).toBe(true)
    expect(isRouteMenuItem({ key: '/docs/use', type: 'group' })).toBe(false)
    expect(isRouteMenuItem({ key: 'architectureDesign', type: 'group' })).toBe(false)
  })

  it('uses label as the preferred locale key while keeping key as the route', () => {
    expect(getMenuLocaleLabel({
      locales: {
        '/components': {
          'zh-CN': '组件',
          'en-US': 'Components',
        },
        '/components/design': {
          'zh-CN': '组件设计',
          'en-US': 'Component Design',
        },
      },
      key: '/components',
      label: '/components/design',
      locale: 'zh-CN',
    })).toBe('组件设计')

    expect(getMenuLocaleLabel({
      locales: {},
      key: '/components',
      label: '/components/design',
      locale: 'zh-CN',
    })).toBe('/components/design')
  })

  it('registers changelog sidebar menus by package and defaults to ProComponents', () => {
    const changelogMenus = menusMap['/changelog']

    expect(changelogMenus.menus.map(item => item.key)).toEqual([
      '/changelog',
      '/changelog/pro-form',
      '/changelog/pro-table',
      '/changelog/pro-layout',
      '/changelog/pro-card',
      '/changelog/pro-field',
      '/changelog/pro-listy',
      '/changelog/pro-provider',
      '/changelog/pro-utils',
      '/changelog/route-utils',
    ])
    expect(changelogMenus.menus[0]?.label).toBe('/changelog/pro-components')
    expect(changelogMenus.locales['/changelog/pro-components']?.['zh-CN']).toBe('ProComponents')
    expect(changelogMenus.locales['/changelog/pro-form']?.['en-US']).toBe('ProForm')
  })
})
