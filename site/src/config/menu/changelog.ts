import type { InnerLocale } from '#/config'
import type { AntdvMenuItem } from './interface'
import type { Menu } from '@/locales/zh-CN/menu'
import locales from '@/locales'

interface ChangelogPackageMenu {
  key: string
  label: string
  localeKey: keyof Menu['changelog']
}

export const changelogPackageMenus: ChangelogPackageMenu[] = [
  {
    key: '/changelog',
    label: '/changelog/pro-components',
    localeKey: 'proComponents',
  },
  {
    key: '/changelog/pro-form',
    label: '/changelog/pro-form',
    localeKey: 'proForm',
  },
  {
    key: '/changelog/pro-table',
    label: '/changelog/pro-table',
    localeKey: 'proTable',
  },
  {
    key: '/changelog/pro-layout',
    label: '/changelog/pro-layout',
    localeKey: 'proLayout',
  },
  {
    key: '/changelog/pro-card',
    label: '/changelog/pro-card',
    localeKey: 'proCard',
  },
  {
    key: '/changelog/pro-field',
    label: '/changelog/pro-field',
    localeKey: 'proField',
  },
  {
    key: '/changelog/pro-listy',
    label: '/changelog/pro-listy',
    localeKey: 'proListy',
  },
  {
    key: '/changelog/pro-provider',
    label: '/changelog/pro-provider',
    localeKey: 'proProvider',
  },
  {
    key: '/changelog/pro-utils',
    label: '/changelog/pro-utils',
    localeKey: 'proUtils',
  },
  {
    key: '/changelog/route-utils',
    label: '/changelog/route-utils',
    localeKey: 'routeUtils',
  },
]

export const changelogMenus: AntdvMenuItem[] = changelogPackageMenus.map(({ key, label }) => ({
  key,
  label,
}))

export const changelogMenuLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const result: Record<string, Record<InnerLocale, string>> = {}

  changelogPackageMenus.forEach(({ label, localeKey }) => {
    result[label] = {
      'zh-CN': locales['zh-CN'].menu.changelog[localeKey],
      'en-US': locales['en-US'].menu.changelog[localeKey],
    }
  })

  return result
})()
