import type { VueNode } from '@v-c/util/dist/type'

export type MultiTabAction = 'change' | 'close' | 'closeOther' | 'closeLeft' | 'closeRight' | 'refresh'

export interface MultiTabActionItem {
  key: string
  title: VueNode
  closable?: boolean
}

export interface MultiTabActionDisabledOptions {
  items?: MultiTabActionItem[]
  item?: MultiTabActionItem
  activeKey?: string
  showRefresh?: boolean
}

export function resolveMultiTabActionDisabled(
  action: Exclude<MultiTabAction, 'change'>,
  options: MultiTabActionDisabledOptions,
) {
  const { items = [], activeKey, showRefresh = true } = options
  const item = options.item || items.find(tab => tab.key === activeKey)

  if (!item)
    return true

  const itemIndex = items.findIndex(tab => tab.key === item.key)
  if (itemIndex < 0)
    return true
  if (action === 'close')
    return options.item?.closable === false
  if (action === 'closeLeft')
    return itemIndex <= 0
  if (action === 'closeRight')
    return itemIndex >= items.length - 1
  if (action === 'closeOther')
    return items.length <= 1
  if (action === 'refresh')
    return !showRefresh || item.key !== activeKey

  return false
}

export function getMultiTabMoreMenuActions(item?: MultiTabActionItem): Exclude<MultiTabAction, 'change'>[] {
  if (!item)
    return []
  return ['closeOther', 'close', 'refresh']
}

export function getMultiTabTabMenuActions(item?: MultiTabActionItem): Exclude<MultiTabAction, 'change'>[] {
  if (!item)
    return []
  return ['closeLeft', 'closeRight', 'closeOther', 'refresh']
}

export const multiTabActionDisabled = resolveMultiTabActionDisabled
