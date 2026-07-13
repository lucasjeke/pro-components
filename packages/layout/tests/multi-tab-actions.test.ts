import type { MultiTabItem } from '../src/components/MultiTab'
import { describe, expect, it } from 'vitest'
import { getMultiTabTabMenuActions, resolveMultiTabActionDisabled } from '../src/components/MultiTab/actionState'

const items: MultiTabItem[] = [
  { key: 'home', title: 'Home', closable: false },
  { key: 'settings', title: 'Settings' },
]

describe('MultiTab action disabled state', () => {
  it('omits close from the default tab context menu because the tab already has a close icon', () => {
    expect(getMultiTabTabMenuActions(items[1])).toEqual(['closeLeft', 'closeRight', 'closeOther', 'refresh'])
  })

  it('enables available tab context actions for the second tab when the first tab is fixed', () => {
    const current = items[1]

    expect(resolveMultiTabActionDisabled('close', { items, item: current, activeKey: current.key, showRefresh: true })).toBe(false)
    expect(resolveMultiTabActionDisabled('closeLeft', { items, item: current, activeKey: current.key, showRefresh: true })).toBe(false)
    expect(resolveMultiTabActionDisabled('closeRight', { items, item: current, activeKey: current.key, showRefresh: true })).toBe(true)
    expect(resolveMultiTabActionDisabled('closeOther', { items, item: current, activeKey: current.key, showRefresh: true })).toBe(false)
    expect(resolveMultiTabActionDisabled('refresh', { items, item: current, activeKey: current.key, showRefresh: true })).toBe(false)
  })

  it('uses the active tab for more menu action state', () => {
    expect(resolveMultiTabActionDisabled('closeOther', { items, activeKey: 'settings', showRefresh: true })).toBe(false)
    expect(resolveMultiTabActionDisabled('refresh', { items, activeKey: 'settings', showRefresh: true })).toBe(false)
  })
})
