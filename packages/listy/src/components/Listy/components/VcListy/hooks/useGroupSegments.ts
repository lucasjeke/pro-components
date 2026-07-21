import type { VueNode } from '@v-c/util'
import type { ComputedRef } from 'vue'
import type { Key } from '../interface'
import { computed } from 'vue'

export interface Group<T, K extends Key = Key> {
  key: ((item: T) => K) | K
  title: (options: { name: K, items: T[] }) => VueNode
}

export interface GroupSegmentItem<T> {
  item: T
  index: number
}

/**
 * Build a lookup map from group key to all matching data items and their
 * original indexes.
 * This groups by key across the full data set and does not require items with
 * the same key to be contiguous.
 */
export function useGroupSegments<T, K extends Key = Key>(data: T[], group?: Group<T, K>): ComputedRef<Map<K, GroupSegmentItem<T>[]>> {
  return computed(() => {
    // ============================== Init ================================
    const map = new Map<K, GroupSegmentItem<T>[]>()

    // ============================ No Group ==============================
    if (!group) {
      return map
    }

    // ============================= Collect ==============================
    data.forEach((item, index) => {
      const groupKey = typeof group.key === 'function' ? group.key(item) : group.key
      const groupItems = map.get(groupKey)
      const groupSegmentItem = { item, index }

      if (groupItems) {
        groupItems.push(groupSegmentItem)
      }
      else {
        map.set(groupKey, [groupSegmentItem])
      }
    })

    return map
  })
}
