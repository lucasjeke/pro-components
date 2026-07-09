import type { CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { CSSProperties, SetupContext, VNode } from 'vue'
import type { ListComponentProps } from '../interface'
import { cloneVNode, defineComponent, Fragment, h, isVNode } from 'vue'
import GroupHeader from '../GroupHeader'
import { useGroupSegments } from '../hooks'
import { useRawListScroll } from './useRawListScroll'

function isNumber(val: any) {
  return typeof val === 'number' && !Number.isNaN(val)
}
function unit(num: any) {
  if (isNumber(num))
    return `${num}px`
  return num
}

export type RawListProps<T, K extends Key = Key> = ListComponentProps<T, K>

function isSpecialNode(node: VNode): boolean {
  return node.type === Fragment || node.type === Comment || node.type === Text
}
function getScrollTargetProps(key: Key) {
  return {
    'data-key': String(key),
  }
}

const RawList = defineComponent(<T, K extends Key = Key>(props: RawListProps<T, K>, {
  expose,
  attrs,
}: SetupContext<
  {},
  CustomSlotsType<{
    default?: () => VueNode
  }>
>) => {
  // =============================== Refs ===============================
  const { scrollTo, holderRef } = useRawListScroll(props.prefixCls!, !!(props.sticky && props.group))

  // =============================== Data ===============================
  const groupData = useGroupSegments<T, K>(props.data!, props.group)

  // ============================== Utils ===============================
  const getItemKey = (item: T) => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey(item)
    }
    return item[props.rowKey!] as Key
  }

  // ============================ Render Item ===========================
  const renderItem = (item: T, index: number, groupKey?: K) => {
    const key = getItemKey(item)
    const scrollTargetProps = getScrollTargetProps(key!)

    const itemDom = props.itemRender?.(item, index)
    if (!isVNode(itemDom) || !isSpecialNode(itemDom)) {
      return itemDom
    }
    return cloneVNode(itemDom, {
      ...itemDom.props,
      key,
      style: props.sticky && groupKey !== undefined ? {
        scrollMarginTop: `var(--${props.prefixCls}-item-scroll-margin-top, 0px)`,
      } : undefined,
      ...scrollTargetProps,
    })
  }
  expose({
    scrollTo,
  })

  return () => {
    // ============================== Props ==============================
    const {
      data,
      group,
      height,
      onScroll,
      prefixCls,
      sticky,
      component = 'div',
    } = props
    // ============================= Content ==============================
    const rawContent = group
      ? Array.from(groupData.value, ([groupKey, groupItems]) => {
          const currentGroupItems = groupItems.map(({ item }) => item)
          return (
            <div
              key={groupKey}
              class={`${prefixCls}-group-section`}
              {...getScrollTargetProps(groupKey)}
            >
              <GroupHeader
                group={group}
                groupKey={groupKey}
                groupItems={currentGroupItems}
                prefixCls={prefixCls}
                sticky={sticky}
              />
              {groupItems.map(({ item, index }) => renderItem(item, index, groupKey))}
            </div>
          )
        })
      : data?.map((item, index) => renderItem(item, index))

    if (typeof component !== 'string') {
      return h(component!, {
        ...attrs,
        style: {
          ...(attrs.style || {}) as CSSProperties,
          maxHeight: unit(height!),
          overflowY: height === undefined ? undefined : 'auto',
          overflowAnchor: 'none',
        },
        onScroll,
      }, () => rawContent)
    }
    return h(component, {
      ...attrs,
      ref: holderRef,
      style: {
        ...(attrs.style || {}) as CSSProperties,
        maxHeight: unit(height!),
        overflowY: height === undefined ? undefined : 'auto',
        overflowAnchor: 'none',
      },
      onScroll,
    }, rawContent as VNode[])
  }
}, {
  name: 'RawList',
  inheritAttrs: false,
  props: ['data', 'group', 'component', 'height', 'itemHeight', 'itemRender', 'onScroll', 'prefixCls', 'rowKey', 'sticky'],
})

export default RawList
