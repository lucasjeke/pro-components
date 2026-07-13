import type { CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { PaginationConfig, SpinProps } from 'antdv-next'
// import type { Breakpoint } from 'antdv-next/dist/_util/responsiveObserver'
import type { SetupContext } from 'vue'
import type { ListyScrollToConfig } from './components/VcListy/interface'
import type { ListyProps, ListyRef } from './typing'
import { clsx } from '@v-c/util'
import { Pagination, Row, Spin } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
// import { responsiveArray } from 'antdv-next/dist/_util/responsiveObserver'
import { DefaultRenderEmpty } from 'antdv-next/dist/config-provider/defaultRenderEmpty'
import useCSSVarCls from 'antdv-next/dist/config-provider/hooks/useCSSVarCls'
import { useSize } from 'antdv-next/dist/config-provider/hooks/useSize'
import useVariant from 'antdv-next/dist/form/hooks/useVariant'
// import useBreakpoint from 'antdv-next/dist/grid/hooks/useBreakpoint'
import { computed, defineComponent, shallowRef, toRef, unref } from 'vue'
import VcListy from './components/VcListy'
import { useListyContextProvider } from './context'
import Item from './Item'
import { useStyle } from './style'
import { useComponentBaseConfig } from './util'

export function isPlainObject<T extends object = object>(val: any): val is T {
  return val !== null && typeof val === 'object'
}
type Merge<T extends readonly Record<string, any>[]>
  = T extends readonly [infer F extends object, ...infer R extends object[]]
    ? Omit<F, keyof Merge<R>> & Merge<R>
    : {}
function mergeProps<T extends Record<string, any>[]>(...items: T): Merge<T> {
  const ret = {} as Merge<T>
  items.forEach((item) => {
    if (item) {
      Object.keys(item).forEach((key) => {
        if (item[key] !== undefined)
          ret[key as keyof typeof ret] = item[key]
      })
    }
  })
  return ret as unknown as Merge<T>
}

const _Listy = defineComponent(<T, K extends Key = Key>(props: ListyProps<T, K>, {
  slots,
  attrs,
  expose,
}: SetupContext<
  {},
  CustomSlotsType<{
    default?: () => VueNode
  }>
>) => {
  const {
    getPrefixCls,
    direction,
    class: contextClassName,
    style: contextStyle,
  } = useComponentBaseConfig('listy', props)
  const config = useConfig()
  const prefixCls = computed(() => getPrefixCls('listy', props.prefixCls))
  const rootCls = useCSSVarCls(prefixCls)
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
  const listyRef = shallowRef<ListyRef | null>(null)
  const spinProps = computed<SpinProps | undefined>(() => {
    const loading = typeof props.loading === 'string' ? true : props.loading
    if (typeof loading === 'boolean') {
      return { spinning: loading }
    }
    if (typeof loading === 'object' && loading !== null) {
      return { spinning: true, ...loading }
    }
    return undefined
  })
  const paginationObj = isPlainObject(props.pagination) ? props.pagination : {}
  const paginationCurrent = shallowRef(paginationObj.defaultCurrent || 1)
  const paginationSize = shallowRef(paginationObj.defaultPageSize || 10)

  useListyContextProvider({
    grid: toRef(() => props.grid),
    itemLayout: toRef(() => props.itemLayout),
  })
  const onPaginationChange = () => {

  }
  const onPaginationShowSizeChange = () => {

  }
  // const needResponsive = computed(() => Object.keys(props.grid || {}).some(key =>
  //   responsiveArray.includes(key as Breakpoint),
  // ))
  const [variant] = useVariant('listy' as any, toRef(() => props.variant), toRef(() => props.bordered))
  // const screens = useBreakpoint(needResponsive)
  // const currentBreakpoint = computed(() => {
  //   for (let i = 0; i < responsiveArray.length; i += 1) {
  //     const breakpoint = responsiveArray[i]
  //     if (screens.value![breakpoint!]) {
  //       return breakpoint
  //     }
  //   }
  //   return undefined
  // })
  // const colStyle = computed(() => {
  //   if (!props.grid) {
  //     return undefined
  //   }
  //   const columnCount
  //     = currentBreakpoint.value && props.grid[currentBreakpoint.value] ? props.grid[currentBreakpoint.value] : props.grid.column
  //   if (columnCount) {
  //     return {
  //       width: `${100 / columnCount}%`,
  //       maxWidth: `${100 / columnCount}%`,
  //     }
  //   }
  // })
  const mergedSize = useSize(computed(() => props.size))

  expose({
    scrollTo: (config?: ListyScrollToConfig) => listyRef.value?.scrollTo(config),
  })
  return () => {
    const { loading: propsLoading = false, loadMore, split: propsSplit = true, grid, items = [], variant: customVariant, rootClass, itemLayout, virtual: propsVirtual = false, size, locale, itemRender, pagination, sticky: propsSticky = false, bordered: propsBordered = true, ...rest } = props

    const split = typeof propsSplit === 'string' ? true : propsSplit
    const virtual = typeof propsVirtual === 'string' ? true : propsVirtual

    // const loading = typeof propsLoading === 'string' ? true : propsLoading
    const sticky = typeof propsSticky === 'string' ? true : propsSticky
    // const bordered = typeof propsBordered === 'string' ? true : propsBordered
    // console.log(loading, bordered, 'asdas')
    let splitItems = [...items]

    const defaultPaginationProps: PaginationConfig = {
      current: 1,
      total: 0,
      position: 'bottom',
    }
    const paginationProps = mergeProps(
      defaultPaginationProps,
      {
        total: items?.length,
        current: paginationCurrent.value,
        pageSize: paginationSize.value,
      },
      pagination || {},
    )

    const { total = 0, pageSize = 0, current = 1 } = paginationProps
    const largestPage = Math.ceil(total / pageSize)
    paginationProps.current = Math.min(current, largestPage)
    if (pagination) {
      if (items.length > (paginationProps.current - 1) * (paginationProps.pageSize || 0)) {
        splitItems = [...items].splice(
          (paginationProps.current - 1) * (paginationProps.pageSize || 0),
          (paginationProps.pageSize || 0),
        )
      }
    }
    const paginationContent = pagination && (
      <div class={clsx(`${prefixCls.value}-pagination`)}>
        <Pagination
          align="end"
          {...paginationProps}
          onChange={onPaginationChange}
          onShowSizeChange={onPaginationShowSizeChange}
        />
      </div>
    )
    // console.log(currentBreakpoint, paginationContent, virtual, 'currentBreakpoint')
    // let splitItems = [...(items || [])]
    // if (pagination) {
    //   if (items.length > (paginationProps.current - 1) * pageSize) {
    //     splitItems = [...items].splice(
    //       (current - 1) * pageSize,
    //       pageSize,
    //     )
    //   }
    // }
    // let childrenContent = !!spinProps.value?.spinning && <div style={{ minHeight: '53px' }} />
    // if (splitItems.length > 0) {
    //   const items = splitItems.map(renderInternalItem)
    //   console.log(items, 'items')
    //   childrenContent =
    // }

    let sizeCls = ''
    switch (mergedSize.value) {
      case 'large':
        sizeCls = 'lg'
        break
      case 'small':
        sizeCls = 'sm'
        break
      default:
        break
    }
    const paginationPosition = paginationProps.position
    const isLoading = !!spinProps.value?.spinning
    let childrenContent = isLoading && <div style={{ minHeight: '53px' }} />
    if (splitItems.length > 0) {
      childrenContent = (
        <VcListy
          {...rest}
          items={splitItems}
          sticky={sticky}
          ref={listyRef}
          component={grid ? Row : undefined}
          {...(grid ? { gutter: grid.gutter } : {})}
          prefixCls={prefixCls.value}
          class={clsx(`${prefixCls.value}-items`, `${prefixCls.value}-container`, hashId.value, cssVarCls.value)}
          itemRender={itemRender}
          virtual={virtual}
          v-slots={slots}
        />
      )
    }
    else if (!slots.default?.() && !isLoading) {
      childrenContent = (
        <div class={`${prefixCls.value}-empty-text`}>
          {locale?.emptyText || config.value.renderEmpty?.('List') || <DefaultRenderEmpty componentName="List" />}
        </div>
      )
    }

    return (
      <div
        class={clsx(prefixCls.value, {
          [`${prefixCls.value}-split`]: split,
          [`${prefixCls.value}-${sizeCls}`]: sizeCls,
          [`${prefixCls.value}-vertical`]: itemLayout === 'vertical',
          [`${prefixCls.value}-loading`]: isLoading,
          [`${prefixCls.value}-grid`]: !!grid,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-bordered`]: variant.value !== 'borderless',
        }, unref(contextClassName), attrs.class, rootClass, hashId.value, cssVarCls.value)}
        style={[
          unref(contextStyle),
          attrs.style,
        ]}
      >
        {(paginationPosition === 'top' || paginationPosition === 'both') && paginationProps.total ? paginationContent : null}
        <Spin spinning={false} {...spinProps.value}>
          {childrenContent}
        </Spin>
        {loadMore
          || ((paginationPosition === 'bottom' || paginationPosition === 'both') && paginationProps.total ? paginationContent : null)}
      </div>
    )
  }
}, {
  name: 'AListy',
  inheritAttrs: false,
  props: ['group', 'split', 'loadMore', 'loading', 'grid', 'id', 'itemLayout', 'onScroll', 'pagination', 'size', 'height', 'itemHeight', 'itemRender', 'locale', 'bordered', 'rootClass', 'variant', 'items', 'onScroll', 'prefixCls', 'rowKey', 'sticky', 'virtual'],
})

const Listy = _Listy as typeof _Listy & {
  Item: typeof Item
}

Listy.Item = Item

export default Listy
