import type { AntdvMenuItem } from './interface'
import type { InnerLocale } from '@/utils/locale'
import locales from '@/locales'

// Helper function to convert nested component locales to flat structure
// e.g., { components: { button: 'Button' } } -> { '/components/button': 'Button', 'general': '通用' }
function flattenComponentLocales(nestedLocales: { components: Record<string, string> }) {
  const flattened: Record<string, string> = {}
  const components = nestedLocales.components
  const groupKeyMap: Record<string, string> = {
    general: 'general',
    layoutGroup: 'layoutGroup',
    navigation: 'navigation',
    dataEntry: 'data-entry',
    dataDisplay: 'data-display',
    feedback: 'feedback',
    other: 'other',
  }

  for (const [key, value] of Object.entries(components)) {
    // Group labels (general, layoutGroup, navigation, etc.) don't have /components/ prefix
    if (groupKeyMap[key]) {
      flattened[groupKeyMap[key]] = value
    }
    else {
      // Component paths get /components/ prefix
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      flattened[`/components/${kebabKey}`] = value
    }
  }

  return flattened
}

// Export locale map by converting centralized locales to the expected format
export const componentLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenComponentLocales(locales['zh-CN'].menuComponents)
  const enFlat = flattenComponentLocales(locales['en-US'].menuComponents)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    const zhValue = zhFlat[key]
    const enValue = enFlat[key]
    if (zhValue && enValue) {
      result[key] = {
        'zh-CN': zhValue,
        'en-US': enValue,
      }
    }
  }

  return result
})()

export const components: AntdvMenuItem[] = [
  { key: '/components/overview', label: '/components/overview' },
  { key: '/components/changelog', label: '/components/changelog' },
  {
    key: 'layoutGroup',
    label: 'layout',
    type: 'group',
    children: [
      { key: '/components/layout', label: '/components/layout' },
      { key: '/components/page-container', label: '/components/page-container' },
      { key: '/components/card', label: '/components/card' },
      { key: '/components/statistic-card', label: '/components/statistic-card' },
      { key: '/components/check-card', label: '/components/check-card' },
    ],
  },
  {
    key: 'data-entry',
    label: 'data-entry',
    type: 'group',
    children: [
      { key: '/components/form', label: '/components/form' },
      { key: '/components/field-set', label: '/components/field-set' },
      { key: '/components/group', label: '/components/group' },
      { key: '/components/dependency', label: '/components/dependency' },
      { key: '/components/schema-form', label: '/components/schema-form' },
      { key: '/components/query-filter', label: '/components/query-filter' },
      { key: '/components/steps-form', label: '/components/steps-form' },
      { key: '/components/modal-form', label: '/components/modal-form' },
      { key: '/components/login-form', label: '/components/login-form' },
    ],
  },
  {
    key: 'data-display',
    label: 'data-display',
    type: 'group',
    children: [
      { key: '/components/table', label: '/components/table' },
      { key: '/components/editable-table', label: '/components/editable-table' },
      { key: '/components/drag-sort-table', label: '/components/drag-sort-table' },
      // { key: '/components/descriptions', label: '/components/descriptions' },
      { key: '/components/listy', label: '/components/listy' },
    ],
  },
  {
    key: 'general',
    label: 'general',
    type: 'group',
    children: [
      // { key: '/components/skeleton', label: '/components/skeleton' },
      { key: '/components/field', label: '/components/field' },
    ],
  },
]
