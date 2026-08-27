import type { ProCheckCardProps } from '@antdv-next1/pro-card'
import type { GetComponentProps } from '@v-c/table'
import type { AnyObject, CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { ColProps, ListyProps, PaginationConfig, SpinProps, TableColumnType, TableProps, TableRowSelection } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { GetRowKey, TableLocale, TablePaginationConfig } from 'antdv-next/dist/table/interface'
import type { CSSProperties, SetupContext } from 'vue'
import type { ProListyItemProps } from './Item'
import type { AntdListyProps, ListyItemLayout, ListySize, ProListyGridType } from './typing'
import { ProCard, ProCheckCard } from '@antdv-next1/pro-card'
import { useProConfig } from '@antdv-next1/pro-provider'
import { isSpecialNode, useState } from '@antdv-next1/pro-utils'
import { classNames, get, omit } from '@v-c/util'
import { Col, Empty, Listy, Pagination, Row, Spin, useBreakpoint } from 'antdv-next'
import { responsiveArray } from 'antdv-next/dist/_util/responsiveObserver'
import useLazyKVMap from 'antdv-next/dist/table/hooks/useLazyKVMap'
import usePagination from 'antdv-next/dist/table/hooks/usePagination'
import useSelection from 'antdv-next/dist/table/hooks/useSelection'
import { computed, defineComponent, isVNode, shallowRef, watch } from 'vue'
import { useProListyContextProvider } from './context'
import ProListyItem from './Item'

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

export type ListViewProps<RecordType extends Record<string, any>> = Omit<AntdListyProps, 'renderItem'> & Pick<
  TableProps<RecordType>,
    'columns' | 'expandable' | 'pagination' | 'onRow'
> & {
  rowHoverable?: boolean
  size?: ListySize
  loadMore?: VueNode
  itemLayout?: ListyItemLayout
  split?: boolean
  loading?: boolean | SpinProps
  locale?: Pick<TableLocale, 'emptyText'>
  rowKey?: string | keyof RecordType | GetRowKey<RecordType>
  rowSelection?: TableRowSelection<RecordType>
  variant?: 'outlined' | 'borderless' | 'filled'
  prefixCls?: string
  grid?: ProListyGridType
  ghost?: boolean
  action?: {
    isEditable?: (row: RecordType & {
      index: number
    }) => {
      recordKey: string
      isEditable: boolean
      preIsEditable: boolean
    } | undefined
  }
  dataSource?: RecordType[]
  // 当非卡片模式时，用于为每一行的项目绑定事件，用户设置 `grid`时将会失效
  onRow?: GetComponentProps<RecordType>
  // 兼容普通和卡片模式的事件绑定，代表每一个项目的事件，是对`onRow`的补充
  onItem?: GetComponentProps<RecordType>
  rowClassName?: string | ((item: RecordType, index: number) => string)
  itemCardProps?: ProCheckCardProps
  itemRender?: (item: RecordType, index: number, dom: VueNode) => VueNode
  pagination?: TablePaginationConfig | false
  hashId?: string
  cssVarCls?: string
}

const PRO_LIST_KEYS = [
  'title',
  'subTitle',
  'avatar',
  'description',
  'extra',
  'aside',
  'content',
  'actions',
  'type',
] as const

const PRO_LIST_KEYS_MAP = new Set<string>(PRO_LIST_KEYS)

type ListSlot = (typeof PRO_LIST_KEYS)[number] | (string & {})

type ListSlotColumn<RecordType> = TableColumnType<RecordType> & {
  listSlot?: ListSlot
}

interface CardRowItem<RecordType> {
  item: RecordType
  index: number
}

function normalizeColumnCount(count?: number) {
  if (!Number.isFinite(count) || !count) {
    return undefined
  }
  return Math.min(24, Math.max(1, Math.floor(count)))
}

function columnCountToSpan(count?: number) {
  const normalizedCount = normalizeColumnCount(count)
  return normalizedCount ? Math.max(1, Math.floor(24 / normalizedCount)) : undefined
}

function resolveGutterValue(
  gutter: unknown,
  screens: Partial<Record<(typeof responsiveArray)[number], boolean>> | null,
) {
  if (typeof gutter === 'number') {
    return gutter
  }
  if (gutter && typeof gutter === 'object') {
    const breakpoint = responsiveArray.find(key => screens?.[key] && typeof (gutter as Record<string, unknown>)[key] === 'number')
    return breakpoint ? (gutter as Record<string, number>)[breakpoint] : 0
  }
  return 0
}

const ListView = defineComponent(<RecordType extends AnyObject>(props: ListViewProps<RecordType>, {
  slots,
  attrs,
  expose,
}: SetupContext<
  {},
  CustomSlotsType<{
    itemRender?: ListViewProps<RecordType>['itemRender']
    default?: () => VueNode
  }>
>) => {
  const rawData = shallowRef(props?.dataSource || [])
  const proConfig = useProConfig()
  watch(() => props.dataSource, () => {
    rawData.value = props?.dataSource || []
  })
  const getRowKey = computed<
    GetRowKey<RecordType>
  >((): GetRowKey<RecordType> => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey
    }
    return (record: RecordType, index?: number) =>
      record[props.rowKey as string] || index
  })
  const childrenColumnName = computed(() => 'children')
  const baseClassName = computed(() => props.prefixCls || 'ant-pro-listy')
  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey)
  const hashId = computed(() => props.hashId ?? proConfig.value.hashId)
  // 合并分页配置，兼容 antd 的分页
  const [mergedPagination, refreshPagination] = usePagination(
    computed(() => (props.dataSource || []).length),
    () => {},
    computed(() => isPlainObject(props.pagination) ? props.pagination : {}),
  )

  /** 根据分页来返回不同的数据，模拟 table */
  const pageData = computed(() => {
    if (
      !props.pagination
      || !mergedPagination.value.pageSize
      || (props.dataSource || []).length < mergedPagination.value.total!
    ) {
      return props.dataSource || []
    }
    const { current = 1, pageSize = 10 } = mergedPagination.value

    return (props.dataSource || []).slice((current - 1) * pageSize, current * pageSize)
  })

  const [transformSelectionColumns, selectedKeySet] = useSelection(
    {
      getRowKey,
      getRecordByKey,
      prefixCls: baseClassName,
      data: computed(() => props.dataSource || []),
      pageData,
      childrenColumnName,
      locale: {},
    },
    computed(() => props.rowSelection),
  )
  const selectionColumn = computed(() => (
    transformSelectionColumns([])[0] as TableColumnType<RecordType> | undefined
  ))

  const screens = useBreakpoint()
  const activeColumnCount = computed(() => {
    const grid = props.grid
    if (!grid) {
      return 1
    }
    const activeBreakpoint = responsiveArray.find((breakpoint) => {
      return screens.value?.[breakpoint] && normalizeColumnCount(grid[breakpoint as keyof ProListyGridType] as number)
    })
    return normalizeColumnCount(
      activeBreakpoint
        ? grid[activeBreakpoint as keyof ProListyGridType] as number
        : grid.column,
    ) || 1
  })
  const cardRows = computed<CardRowItem<RecordType>[][]>(() => {
    const rows: CardRowItem<RecordType>[][] = []
    const columnCount = activeColumnCount.value
    pageData.value.forEach((item, index) => {
      const rowIndex = Math.floor(index / columnCount)
      if (!rows[rowIndex]) {
        rows[rowIndex] = []
      }
      rows[rowIndex].push({ item, index })
    })
    return rows
  })
  const horizontalGutter = computed(() => {
    const gutter = props.grid?.gutter
    return resolveGutterValue(Array.isArray(gutter) ? gutter[0] : gutter, screens.value)
  })
  const verticalGutter = computed(() => {
    const gutter = props.grid?.gutter
    return resolveGutterValue(Array.isArray(gutter) ? gutter[1] : 0, screens.value)
  })
  const virtualCardEnabled = computed(() => (
    !!props.grid && !!props.virtual && typeof props.height === 'number' && props.height > 0
  ))

  /** 展开收起功能区域 star */
  const [innerExpandedKeys, setInnerExpandedKeys] = useState<Key[]>(
    () => {
      // 提供和 Table 一样的 expand 支持
      const {
        defaultExpandedRowKeys,
        defaultExpandAllRows = true,
      } = props.expandable || {}
      if (defaultExpandedRowKeys) {
        return defaultExpandedRowKeys as Key[]
      }
      if (defaultExpandAllRows !== false) {
        return (props.dataSource || []).map(getRowKey.value)
      }
      return []
    },
  )
  const mergedExpandedKeys = computed(
    () => {
      // 提供和 Table 一样的 expand 支持
      const {
        expandedRowKeys,
      } = props.expandable || {}

      return new Set(expandedRowKeys || innerExpandedKeys.value || [])
    },
  )
  const onTriggerExpand = (record: RecordType) => {
    // 提供和 Table 一样的 expand 支持
    const {
      onExpand,
      onExpandedRowsChange,
    } = props.expandable || {}
    const key = getRowKey.value(record, (props.dataSource || []).indexOf(record))
    const hasKey = mergedExpandedKeys.value.has(key)
    const nextKeys = new Set(mergedExpandedKeys.value)
    if (hasKey) {
      nextKeys.delete(key)
    }
    else {
      nextKeys.add(key)
    }
    const newExpandedKeys = [...nextKeys]

    setInnerExpandedKeys(newExpandedKeys)
    onExpand?.(!hasKey, record)
    onExpandedRowsChange?.(newExpandedKeys)
  }

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
  const currentPagination = computed(() => props.pagination
    ? mergedPagination.value
    : false)
  const onPaginationShowSizeChange = (page: number, pageSize: number) => {
    refreshPagination(page, pageSize)
    if (isPlainObject(props.pagination)) {
      props.pagination.onShowSizeChange?.(page, pageSize)
    }
  }

  const getItemProps = (item: RecordType, index: number) => {
    const itemProps = {} as Partial<ProListyItemProps<RecordType>>
    ;(props.columns as ListSlotColumn<RecordType>[] | undefined)?.forEach((column) => {
      const { listSlot } = column
      if (!listSlot || !PRO_LIST_KEYS_MAP.has(listSlot)) {
        return
      }

      const dataIndex = column.dataIndex || listSlot || column.key
      const rawData = Array.isArray(dataIndex)
        ? get(item, dataIndex as string[])
        : item[dataIndex as string]
      let data = column.render
        ? column.render(rawData, item, index)
        : rawData

      if (listSlot === 'actions' && !Array.isArray(data)) {
        data = [data]
      }
      const propKey = listSlot === 'aside' ? 'extra' : listSlot
      if (data !== '-') {
        itemProps[propKey as keyof typeof itemProps] = data as never
      }
    })
    return itemProps
  }

  const getSelectionCheckbox = (item: RecordType, index: number) => {
    return selectionColumn.value?.render?.(item, item, index) as VueNode
  }

  const getGridColProps = (): ColProps => {
    const grid = props.grid || {}
    return {
      span: columnCountToSpan(grid.column) || 24,
      xs: columnCountToSpan(grid.xs),
      sm: columnCountToSpan(grid.sm),
      md: columnCountToSpan(grid.md),
      lg: columnCountToSpan(grid.lg),
      xl: columnCountToSpan(grid.xl),
      xxl: columnCountToSpan(grid.xxl),
    }
  }

  const renderListItem = (item: RecordType, index: number) => {
    const itemProps = getItemProps(item, index)
    const checkboxDom = getSelectionCheckbox(item, index)
    const { isEditable, recordKey } = props.action?.isEditable?.({ ...item, index }) || {}
    const itemKey = getRowKey.value(item, index)
    const defaultDom = (
      <ProListyItem
        key={recordKey || itemKey}
        {...itemProps}
        recordKey={recordKey}
        isEditable={isEditable || false}
        expandable={props.expandable}
        expand={mergedExpandedKeys.value.has(itemKey)}
        onExpand={() => onTriggerExpand(item)}
        index={index}
        record={item}
        rowHoverable={props.rowHoverable}
        rowSupportExpand={!props.expandable?.rowExpandable || props.expandable.rowExpandable(item)}
        selected={selectedKeySet.value.has(itemKey)}
        checkbox={checkboxDom}
        onItem={props.onItem}
        onRow={props.onRow}
      />
    )
    return props.itemRender
      ? <>{props.itemRender(item, index, defaultDom)}</>
      : defaultDom
  }

  const renderCardItem = (item: RecordType, index: number) => {
    const itemProps = getItemProps(item, index)
    const checkboxDom = getSelectionCheckbox(item, index)
    const itemKey = getRowKey.value(item, index)
    const selectionEnabled = Boolean(props.rowSelection)
    const itemCardProps = omit(props.itemCardProps || {}, [
      'checked',
      'defaultChecked',
      'onChange',
      'onUpdate:checked',
    ])
    const checkboxChange = selectionEnabled && isVNode(checkboxDom) && !isSpecialNode(checkboxDom)
      ? (checked: boolean) => {
          checkboxDom.props?.onChange?.({
            nativeEvent: {},
            target: { checked },
          })
          props.itemCardProps?.onChange?.(checked)
        }
      : undefined
    const title = itemProps.title || itemProps.subTitle
      ? (
          <div class={`${baseClassName.value}-card-title`}>
            {itemProps.title && <span>{itemProps.title}</span>}
            {itemProps.subTitle && <span class={`${baseClassName.value}-card-subtitle`}>{itemProps.subTitle}</span>}
          </div>
        )
      : undefined
    const cardActions = itemProps.actions ?? props.itemCardProps?.actions
    const cardExtra = itemProps.extra ?? props.itemCardProps?.extra
    const extra = cardActions
      ? (
          <span class={`${baseClassName.value}-card-actions`}>
            {cardExtra}
            {cardActions}
          </span>
        )
      : cardExtra
    const defaultDom = (
      <ProCheckCard
        key={itemKey}
        {...itemCardProps}
        title={title ?? props.itemCardProps?.title}
        avatar={(itemProps.avatar ?? props.itemCardProps?.avatar) as AntVueNode}
        description={(itemProps.description ?? props.itemCardProps?.description) as AntVueNode}
        extra={extra as AntVueNode}
        actions={undefined}
        checked={selectionEnabled ? selectedKeySet.value.has(itemKey) : false}
        disabled={Boolean(
          props.itemCardProps?.disabled
          || (isVNode(checkboxDom) && !isSpecialNode(checkboxDom) && checkboxDom.props?.disabled),
        )}
        onChange={checkboxChange}
        v-slots={{
          default: () => itemProps.content,
        }}
      />
    )
    return props.itemRender
      ? props.itemRender(item, index, defaultDom)
      : defaultDom
  }

  const renderCardCol = ({ item, index }: CardRowItem<RecordType>) => {
    const itemAttrs = props.onItem?.(item, index) || {}
    const rowClass = typeof props.rowClassName === 'function'
      ? props.rowClassName(item, index)
      : props.rowClassName
    return (
      <Col
        {...itemAttrs}
        {...getGridColProps()}
        key={getRowKey.value(item, index)}
        class={classNames(`${baseClassName.value}-grid-col`, rowClass, itemAttrs.class)}
      >
        {renderCardItem(item, index)}
      </Col>
    )
  }

  const renderVirtualCardRow = (row: CardRowItem<RecordType>[], rowIndex: number) => (
    <Row
      key={rowIndex}
      class={`${baseClassName.value}-grid-row`}
      gutter={[horizontalGutter.value, 0]}
    >
      {row.map(renderCardCol)}
    </Row>
  )

  const renderCardGrid = () => {
    if (!virtualCardEnabled.value) {
      return (
        <div class={classNames(`${baseClassName.value}-grid`, attrs.class)} style={attrs.style}>
          <Row class={`${baseClassName.value}-grid-row`} gutter={props.grid?.gutter}>
            {pageData.value.map((item, index) => renderCardCol({ item, index }))}
          </Row>
        </div>
      )
    }

    return (
      <Listy
        data-listy-card-virtual
        rowKey={(row: CardRowItem<RecordType>[], rowIndex?: number) => {
          const firstItem = row[0]
          return firstItem ? getRowKey.value(firstItem.item, firstItem.index) : rowIndex || 0
        }}
        items={cardRows.value}
        height={props.height}
        virtual
        class={classNames(`${baseClassName.value}-grid`, `${baseClassName.value}-grid-virtual`, attrs.class)}
        style={attrs.style as CSSProperties}
        classes={{
          item: `${baseClassName.value}-grid-virtual-row`,
        } as unknown as ListyProps['classes']}
        styles={{
          item: {
            paddingBlockEnd: `${verticalGutter.value}px`,
          },
        } as unknown as ListyProps['styles']}
        onScroll={props.onScroll}
        itemRender={renderVirtualCardRow}
      />
    )
  }
  useProListyContextProvider({
    grid: computed(() => props.grid!),
    itemLayout: computed(() => props.itemLayout!),
  })
  expose({})
  return () => {
    const { prefixCls = 'ant-pro-listy', cssVarCls, size } = props
    const defaultPaginationProps: PaginationConfig = {
      current: 1,
      total: 0,
      position: 'bottom',
    }
    const paginationProps = mergeProps(
      defaultPaginationProps,
      currentPagination.value || {},
    ) as PaginationConfig
    const paginationPosition = paginationProps.position
    const showPaginationTop
      = !!currentPagination.value
        && (paginationPosition === 'top' || paginationPosition === 'both')
    const showPaginationBottom
      = !!currentPagination.value
        && (paginationPosition === 'bottom' || paginationPosition === 'both')
    const paginationContent = currentPagination.value && (
      <div class={classNames(`${prefixCls}-pagination`)}>
        <Pagination
          align="end"
          {...paginationProps}
          onShowSizeChange={onPaginationShowSizeChange}
        />
      </div>
    )
    return (
      <ProCard
        type="inner"
        variant={props.variant !== 'outlined' ? 'borderless' : 'outlined'}
        styles={{
          body: {
            padding: 0,
          },
        }}
        ghost={props.ghost}
      >
        <Spin spinning={false} {...spinProps.value}>
          { !pageData.value.length && !spinProps.value?.spinning ? (
            <div class={classNames(`${prefixCls}-empty-text`)}>
              {props.locale?.emptyText || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
          ) : (
            <>
              {props.loadMore || (showPaginationTop && paginationProps.total ? paginationContent : null)}
              {props.grid ? renderCardGrid() : (
                <Listy
                  rowKey={props.rowKey!}
                  items={pageData.value}
                  height={props.height}
                  virtual={props.virtual}
                  sticky={props.sticky}
                  group={props.group}
                  onScroll={props.onScroll}
                  class={classNames(attrs.class, {
                    [`${prefixCls}-vertical`]: props.itemLayout === 'vertical',
                    [`${prefixCls}-${size === 'default' ? 'medium' : size}`]: size !== 'default',
                  }, hashId.value, cssVarCls)}
                  style={attrs.style as CSSProperties}
                  classes={
                    { item: classNames(
                      `${prefixCls}-item`,
                      hashId.value,
                      cssVarCls,
                    ) } as unknown as ListyProps['classes']
                  }
                  itemRender={renderListItem}
                  v-slots={slots}
                />
              )}
              {props.loadMore
                || (showPaginationBottom && paginationProps.total ? paginationContent : null)}
            </>
          )}
        </Spin>
      </ProCard>
    )
  }
}, {
  name: 'ListView',
  inheritAttrs: false,
  props: ['columns', 'action', 'expandable', 'grid', 'group', 'height', 'itemCardProps', 'itemRender', 'onScroll', 'pagination', 'rowHoverable', 'loading', 'dataSource', 'prefixCls', 'rowClassName', 'rowKey', 'rowSelection', 'split', 'sticky', 'variant', 'virtual', 'classes', 'styles', 'ghost', 'itemLayout', 'loadMore', 'onItem', 'onRow', 'size', 'hashId', 'cssVarCls'],
})

export default ListView
