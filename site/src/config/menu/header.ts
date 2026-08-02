import type { MenuItemType } from 'antdv-next'
import type { InnerLocale } from '#/config'
import locales from '@/locales'

export const headerItems: MenuItemType[] = [
  {
    key: '/',
    label: '/home',
  },
  {
    key: '/docs',
    label: '/docs',
  },
  {
    key: '/components',
    label: '/components',
  },
  {
    key: '/changelog',
    label: '/changelog',
  },
  {
    key: '/playground',
    label: '/playground',
  },
]

// Helper to flatten nested header locales
function flattenHeaderLocales(nestedLocales: typeof locales['zh-CN']['menu']['header']) {
  return {
    '/': nestedLocales.home,
    '/docs': nestedLocales.docs,
    '/components': nestedLocales.components,
    '/changelog': nestedLocales.changelog,
    '/playground': nestedLocales.playground,
  }
}

// Export locale map by converting centralized locales to the expected format
export const headerLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenHeaderLocales(locales['zh-CN'].menu.header)
  const enFlat = flattenHeaderLocales(locales['en-US'].menu.header as any)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key as keyof typeof zhFlat],
      'en-US': enFlat[key as keyof typeof enFlat],
    }
  }

  return result
})()
