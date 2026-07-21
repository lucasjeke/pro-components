import type { CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { ScrollOffsetInfo, ListRef as VcVirtualListRef } from '@v-c/virtual-list'
import type { CSSProperties, SetupContext } from 'vue'
import type { ListComponentProps } from '../interface'
import type { Row } from './useFlattenRows'
import VcVirtualList from '@v-c/virtual-list'
import { computed, defineComponent, shallowRef } from 'vue'
import GroupHeader from '../GroupHeader'
import { useGroupSegments } from '../hooks/useGroupSegments'
import { useFlattenRows } from './useFlattenRows'
import { useStickyGroupHeader } from './useStickyGroupHeader'

export type VirtualListProps<T, K extends Key = Key,
> = ListComponentProps<T, K>

const VirtualList = defineComponent(<T, K extends Key = Key>(props: VirtualListProps<T, K>, {
  expose,
  attrs,
}: SetupContext<
  {},
  CustomSlotsType<{
    default?: () => VueNode
  }>
>) => {
  const listRef = shallowRef<VcVirtualListRef | null>(null)
  // =============================== Data ===============================
  const groupData = useGroupSegments<T, K>(props.data!, props.group)
  // =============================== Keys ===============================
  const getItemKey = (item: T): Key => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey(item)
    }
    return item[props.rowKey!] as Key
  }

  const getKey = (row: Row<T, K>): Key => {
    if (row.type === 'header') {
      return row.groupKey
    }
    return getItemKey(row.item)
  }

  // ============================== Rows ================================
  const flattenRows = useFlattenRows<T, K>(
    props.data!,
    groupData,
    props.group,
  )
  // ============================== Lookup ==============================
  const itemKeyToGroupKey = computed(() => {
    const itemGroupMap = new Map<Key, K>()
    groupData.value.forEach((groupItems, groupKey) => {
      groupItems.forEach(({ item }) => {
        itemGroupMap.set(getItemKey(item), groupKey)
      })
    })
    return itemGroupMap
  })

  // ============================== Scroll ==============================
  const scrollTo: VcVirtualListRef['scrollTo'] = (config) => {
    // Group headers are rows in the virtual data, so group scroll maps to key scroll.
    if (config && typeof config === 'object' && 'key' in config) {
      const { key, align, offset } = config
      listRef.value?.scrollTo({
        key,
        align,
        offset,
      })
      return
    }
    // For sticky grouped lists, top-aligned item scroll should land below its header.
    if (
      config
      && typeof config === 'object'
      && 'key' in config
      && props.sticky
      && props.group
      && config.align === 'top'
    ) {
      const groupKey = itemKeyToGroupKey.value.get(config.key!)

      if (groupKey !== undefined) {
        let { offset = 0 } = config
        listRef.value?.scrollTo({
          ...config,
          // Use the measured header height so top-aligned items stay below it.
          offset: ({ getSize }: ScrollOffsetInfo) => {
            const headerSize = getSize(groupKey)
            const headerHeight = headerSize.bottom - headerSize.top
            console.log(offset, headerHeight, '测试')
            if (typeof offset === 'function') {
              offset = offset({ getSize })
            }
            return offset + (Number.isFinite(headerHeight) ? headerHeight : 0)
          },
        })
        return
      }
    }
    // Other scroll shapes are already supported by the underlying virtual list.
    listRef.value?.scrollTo(config)
  }

  // ============================ Render Row ============================
  const renderHeaderRow
    = (groupKey: K) => {
      const groupItems = flattenRows.value.groupKeyToItems.get(groupKey) || []
      return (
        <GroupHeader
          group={props.group!}
          groupKey={groupKey}
          groupItems={groupItems}
          prefixCls={props.prefixCls}
        />
      )
    }

  expose({
    scrollTo,
  })
  return () => {
    const {
      group,
      height,
      itemHeight,
      itemRender,
      onScroll,
      prefixCls,
      sticky,
    } = props
    // ============================== Sticky ==============================
    const extraRender = useStickyGroupHeader<T, K>({
      enabled: !!(sticky && group),
      group,
      headerRows: flattenRows.value.headerRows,
      groupKeyToItems: flattenRows.value.groupKeyToItems,
      prefixCls,
      listRef: listRef.value,
    })
    return (
      <VcVirtualList
        ref={listRef}
        {...attrs}
        data={flattenRows.value.rows}
        fullHeight={false}
        height={height}
        prefixCls={prefixCls}
        itemHeight={itemHeight}
        itemKey={getKey}
        onScroll={onScroll}
        virtual
        extraRender={extraRender}
        v-slots={{
          default: (row: { index: number, offsetX: number, style: CSSProperties, item: Row<T, K> }) => {
            console.log(row, 'row')
            return row.item.type === 'header' ? renderHeaderRow(row.item.groupKey) : itemRender?.(row.item.item, row.index)
          },
        }}
      />
    )
  }
}, {
  name: 'VirtualList',
  inheritAttrs: false,
  props: ['data', 'group', 'height', 'itemHeight', 'itemRender', 'onScroll', 'prefixCls', 'rowKey', 'sticky'],
})

export default VirtualList
