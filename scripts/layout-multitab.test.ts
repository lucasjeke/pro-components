import { describe, expect, it } from 'vitest'
import { normalizeMultiTabAction } from '../packages/layout/src/components/MultiTab/action.ts'
import { resolveMultiTabProps } from '../packages/layout/src/utils/multiTab.ts'

const tabItems = [
  { key: 'home', title: 'Home' },
  { key: 'settings', title: 'Settings' },
]

describe('layout MultiTab integration helpers', () => {
  it('prefers multiTabProps for the built-in MultiTab renderer', () => {
    const resolved = resolveMultiTabProps({
      multiTab: {
        items: [{ key: 'legacy', title: 'Legacy' }],
        activeKey: 'legacy',
      },
      multiTabProps: {
        items: tabItems,
        activeKey: 'settings',
      },
    })

    expect(resolved?.items).toBe(tabItems)
    expect(resolved?.activeKey).toBe('settings')
  })

  it('keeps the legacy multiTab object prop as an alias for multiTabProps', () => {
    const resolved = resolveMultiTabProps({
      multiTab: {
        items: tabItems,
        activeKey: 'settings',
      },
    })

    expect(resolved?.items).toBe(tabItems)
    expect(resolved?.activeKey).toBe('settings')
  })

  it('keeps the legacy multiTab boolean prop as an enable switch', () => {
    expect(resolveMultiTabProps({ multiTab: true })).toEqual({})
    expect(resolveMultiTabProps({ multiTab: false })).toBe(false)
  })

  it('normalizes legacy kebab-case menu action keys', () => {
    expect(normalizeMultiTabAction('close-other')).toBe('closeOther')
    expect(normalizeMultiTabAction('close-left')).toBe('closeLeft')
    expect(normalizeMultiTabAction('close-right')).toBe('closeRight')
    expect(normalizeMultiTabAction('refresh')).toBe('refresh')
  })
})
