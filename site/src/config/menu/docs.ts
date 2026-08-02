import type { InnerLocale } from '#/config'
import type { AntdvMenuItem } from './interface'
import type { Menu } from '@/locales/zh-CN/menu'
import locales from '@/locales'
import { changelogMenus } from './changelog'
import { components } from './components'

// Helper to flatten nested docs locales
function flattenDocsLocales(nestedLocales: Menu) {
  return {
    '/docs/introduce': nestedLocales.docs.introduce,
    '/docs/use': nestedLocales.docs.use,
    '/docs': nestedLocales.docs.gettingStarted,
    '/docs/other': nestedLocales.docs.other,
    '/docs/faq': nestedLocales.docs.faq,
  }
}

// Export locale map by converting centralized locales to the expected format
export const docsMenuLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenDocsLocales(locales['zh-CN'].menu)
  const enFlat = flattenDocsLocales(locales['en-US'].menu)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key as keyof typeof zhFlat],
      'en-US': enFlat[key as keyof typeof enFlat],
    }
  }
  return result
})()

export const docsMenus: Record<string, AntdvMenuItem[]> = {
  '/docs': [{
    key: '/docs/introduce',
    label: '/docs/introduce',
  }, {
    key: '/docs/use',
    label: '/docs/use',
    type: 'group',
    children: [
      {
        key: '/docs',
        label: '/docs',
      },
    ],
  }, {
    key: '/docs/other',
    label: '/docs/other',
    type: 'group',
    children: [
      {
        key: '/docs/faq',
        label: '/docs/faq',
      },
    ],
  }],
  '/components': components,
  '/changelog': changelogMenus,
}
