import type { InnerLocale } from '#/config'
import type { AntdvMenuItem } from './interface'
import { changelogMenuLocales } from './changelog'
import { componentLocales } from './components'
import { docsMenuLocales, docsMenus } from './docs'

type MenuLocales = Record<string, Record<string, string>>

const allLocales: MenuLocales = {
  ...docsMenuLocales,
  ...componentLocales,
  ...changelogMenuLocales,
}

export function collectMenuKeys(items: AntdvMenuItem[]) {
  const result = new Set<string>()
  items.forEach((item) => {
    if (!item)
      return

    if (isRouteMenuItem(item))
      result.add(item.key)

    if (typeof item.label === 'string')
      result.add(item.label)

    if (item.children) {
      collectMenuKeys(item.children).forEach(key => result.add(key))
    }
  })
  return result
}

export function isNavigableMenuKey(key: unknown): key is string {
  return typeof key === 'string' && key.startsWith('/')
}

export function isRouteMenuItem(
  item: Pick<AntdvMenuItem, 'key' | 'type'> | null | undefined,
): item is AntdvMenuItem & { key: string } {
  return item?.type !== 'group' && isNavigableMenuKey(item?.key)
}

export function collectRouteMenuKeys(items: AntdvMenuItem[]) {
  const result = new Set<string>()
  items.forEach((item) => {
    if (!item)
      return

    if (isRouteMenuItem(item))
      result.add(item.key)

    if (item.children) {
      collectRouteMenuKeys(item.children).forEach(key => result.add(key))
    }
  })
  return result
}

export function getMenuLocaleLabel({
  key,
  label,
  locale,
  locales,
}: {
  key: unknown
  label: unknown
  locale: InnerLocale
  locales?: MenuLocales
}) {
  const labelKey = typeof label === 'string' ? label : ''
  const routeKey = typeof key === 'string' ? key : ''

  return locales?.[labelKey]?.[locale]
    ?? locales?.[routeKey]?.[locale]
    ?? label
}

function pickLocales(keys: Set<string>) {
  return Array.from(keys).reduce<MenuLocales>((acc, key) => {
    if (allLocales[key])
      acc[key] = allLocales[key]
    return acc
  }, {})
}

export const menusMap: Record<string, {
  locales: MenuLocales
  menus: AntdvMenuItem[]
}> = Object.keys(docsMenus).reduce((acc, prefix) => {
  const menus = docsMenus[prefix] || []
  const menuKeys = collectMenuKeys(menus)
  acc[prefix] = {
    locales: pickLocales(menuKeys),
    menus,
  }
  return acc
}, {} as Record<string, { locales: MenuLocales, menus: AntdvMenuItem[] }>)
