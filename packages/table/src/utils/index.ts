import type { IntlType } from '@antdv-next1/pro-provider'
import type { AddLineOptions, Key, PageInfo, ProFieldValueObjectType, ProFieldValueType, RecordKey, UseEditableUtilType } from '@antdv-next1/pro-utils'
import type { GetRowKey } from '@v-c/table'
import type { TablePaginationConfig } from 'antdv-next'
import type { FilterValue as AntFilterValue, SorterResult, SortOrder } from 'antdv-next/dist/table/index'
import type { ComputedRef, ShallowRef, UnwrapRef, VNode } from 'vue'
import type {
  ActionType,
  Bordered,
  BorderedType,
  FilterValue,
  ProColumns,
  ProTableInstance,
  UseFetchDataAction,
} from '../typing'
import { computed, isVNode } from 'vue'
import { isLocalFilter, isLocalSorter } from './genProColumnsToColumns'

/**
 * 检查值是否存在 为了 避开 0 和 false
 *
 * @param value
 */
export function checkUndefinedOrNull(value: any) {
  return value !== undefined && value !== null
}

/**
 * 合并用户 props 和 预设的 props
 *
 * @param pagination
 * @param pageInfo
 * @param intl
 */
export function mergePagination<T>(
  pagination: TablePaginationConfig | boolean | undefined,
  pageInfo: UnwrapRef<UseFetchDataAction<T>['pageInfo']> & {
    setPageInfo: any
  },
  intl: IntlType,
): TablePaginationConfig | false | undefined {
  if (pagination === false) {
    return false
  }
  const { total, current, pageSize, setPageInfo } = pageInfo
  const defaultPagination: TablePaginationConfig = typeof pagination === 'object' ? pagination : {}

  return {
    showTotal: (all, range) =>
      `${intl.getMessage({ id: 'pagination.total.range', defaultMessage: '第' })} ${range[0]}-${range[1]} ${intl.getMessage(
        {
          id: 'pagination.total.total',
          defaultMessage: '条/总共',
        },
      )} ${all} ${intl.getMessage({ id: 'pagination.total.item', defaultMessage: '条' })}`,
    total,
    ...(defaultPagination as TablePaginationConfig),
    current: pagination !== true && pagination ? (pagination.current ?? current) : current,
    pageSize: pagination !== true && pagination ? (pagination.pageSize ?? pageSize) : pageSize,
    onChange: (page: number, newPageSize?: number) => {
      const { onChange } = pagination as TablePaginationConfig
      onChange?.(page, newPageSize || 20)
      // pageSize 改变之后就没必要切换页码
      if (newPageSize !== pageSize || current !== page) {
        setPageInfo({ pageSize: newPageSize, current: page })
      }
    },
  }
}

type PostDataType<T> = (data: T) => T

/**
 * 一个转化的 pipeline 列表
 *
 * @param data
 * @param pipeline
 */
export function postDataPipeline<T>(data: T, pipeline: PostDataType<T>[]) {
  if (pipeline.filter(item => item).length < 1) {
    return data
  }
  return pipeline.reduce((pre, postData) => {
    return postData(pre)
  }, data)
}

export function isBordered(borderType: BorderedType, border?: Bordered) {
  if (border === undefined) {
    return false
  }
  if (typeof border === 'boolean') {
    return border
  }
  return border[borderType]
}

/**
 * 获取用户的 action 信息
 *
 */
export function useActionType<T extends Record<string, any>>(action: UseFetchDataAction<T>, props: {
  nativeElement: ComputedRef<HTMLDivElement | null | undefined>
  focus: () => void
  fullScreen: () => Promise<void>
  onCleanSelected: () => Promise<void>
  resetAll: () => Promise<void>
  editableUtils: UseEditableUtilType<T>
}) {
  const { messageContextHolder, ...rest } = props.editableUtils
  return {
    ...rest,
    get pageInfo() {
      return action.pageInfo.value
    },
    get nativeElement() {
      return props.nativeElement.value
    },
    focus: () => props.focus(),
    reload: async (resetPageIndex?: boolean) => {
    // 如果为 true，回到第一页
      if (resetPageIndex) {
        await action.setPageInfo({
          current: 1,
        })
      }
      await action?.reload()
    },
    reloadAndRest: async () => {
    // reload 之后大概率会切换数据，清空一下选择。
      await props.onCleanSelected()
      await action.setPageInfo({
        current: 1,
      })
      await action?.reload()
    },
    reset: async () => {
      await props.resetAll()
      await action?.reset?.()
      await action?.reload()
    },
    fullScreen: async () => await props.fullScreen(),
    clearSelected: async () => await props.onCleanSelected(),
    setPageInfo: async (rest: Partial<PageInfo>) => await action.setPageInfo(rest),
  } as ActionType<any, T>
}

export function isMergeCell(dom?: VNode<any, any, { colSpan?: string }>) {
  return dom && isVNode(dom) && dom?.props?.colSpan
}

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param index 序列号，理论上唯一
 */
export function genColumnKey(key?: string | number | Key, index?: number | string): string {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

/**
 * 将 ProTable - column - dataIndex 转为字符串形式
 *
 * @param dataIndex Column 中的 dataIndex
 */
function parseDataIndex<T>(dataIndex: T) {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join(',')
  }
  return dataIndex?.toString()
}

/**
 * 平铺所有columns, 用于判断是用的是本地筛选/排序
 * @param columns 列配置
 */
export function flattenColumns<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(columns?: ProColumns<T, ValueType>[]) {
  const _columns: ProColumns<T, ValueType>[] = []
  columns?.forEach((column) => {
    if (column.children) {
      _columns.push(...flattenColumns(column.children))
    }
    else {
      _columns.push(column)
    }
  })
  return _columns
}

/**
 * 获取服务端筛选数据
 * @param filters 筛选数据
 * @param columns 列配置
 * @returns 服务端筛选数据
 */
export function getServerFilterResult<T, ValueType>(filters: Record<string, AntFilterValue | null>, columns: ProColumns<T, ValueType>[]) {
  // 过滤掉本地筛选的列
  return Object.entries(filters).reduce<Record<string, FilterValue>>(
    (acc, [key, value]) => {
      const column = columns.find(
        column => parseDataIndex(column.dataIndex) === key,
      )
      if (column != null && !isLocalFilter(column.filters, column.onFilter))
        acc[key] = value as FilterValue

      return acc
    },
    {},
  )
}

/**
 * 获取服务端排序数据
 * @param sorterResult 排序数据
 * @returns 服务端排序数据
 */
export function getServerSorterResult<T extends Record<string, any>>(sorterResult: SorterResult<T> | SorterResult<T>[]) {
  const result = Array.isArray(sorterResult) ? sorterResult : [sorterResult]

  const serverSorter = result.reduce<Record<string, SortOrder | undefined>>(
    (acc, item) => {
      const sorter = item.column?.sorter
      if (sorter != null && isLocalSorter<T>(sorter))
        return acc

      const sortKey
        = typeof sorter === 'string'
          ? sorter
          : parseDataIndex(item.column?.dataIndex)
      if (sortKey != null)
        acc[sortKey] = item.order

      return acc
    },
    {},
  )
  return serverSorter
}

/**
 * 从 ProColumns 数组中取出默认的排序和筛选数据
 *
 * @param columns ProColumns
 */
export function parseServerDefaultColumnConfig<T, ValueType>(columns: ProColumns<T, ValueType>[]) {
  const filter: (Record<string, FilterValue | null>) = {}
  const sort: Record<string, SortOrder> = {}
  columns.forEach((column) => {
    // 转换 dataIndex
    const dataIndex = parseDataIndex(column.dataIndex)
    if (!dataIndex)
      return
    // 当 column 启用服务端 filters 功能时，取出默认的筛选值
    if (column.filters && !isLocalFilter<T, ValueType>(column.filters, column.onFilter)) {
      filter[dataIndex] = column.defaultFilteredValue as FilterValue ?? null
    }
    // 当 column 启用服务端 sorter 功能时，取出默认的排序值
    if (column.sorter && !isLocalSorter<T>(column.sorter)) {
      if (typeof column.sorter === 'string') {
        sort[column.sorter] = column.defaultSortOrder ?? null
      }
      else {
        sort[dataIndex] = column.defaultSortOrder ?? null
      }
    }
  })
  return { sort, filter }
}

export function useProTableInstanceExpose<T extends Record<string, any>>(tableRef: ShallowRef<ProTableInstance<T> | null>) {
  return ({
    get nativeElement() {
      return tableRef.value?.nativeElement
    },
    get pageInfo() {
      return tableRef.value?.pageInfo
    },
    get formRef() {
      return tableRef.value?.formRef?.nativeElement ? tableRef.value?.formRef : null
    },
    preEditableKeys: computed(() => tableRef.value?.preEditableKeys?.value),
    focus: () => tableRef.value?.focus?.(),
    fullScreen: async () => await tableRef.value?.fullScreen(),
    cleanSelected: async () => await tableRef.value?.clearSelected?.(),
    addEditRecord: async (row: T, options?: AddLineOptions) => await tableRef.value?.addEditRecord?.(row, options),
    cancelEditable: async (recordKey: RecordKey, needReTry?: boolean) => await tableRef.value?.cancelEditable?.(recordKey, needReTry),
    getRealIndex: (record: T) => tableRef.value?.getRealIndex?.(record),
    isEditable: (row: T & {
      index: number
    }) => tableRef.value?.isEditable?.(row),
    onValuesChange: (value: T, values: T) => tableRef.value?.onValuesChange?.(value, values),
    reload: async (resetPageIndex?: boolean) => await tableRef.value?.reload?.(resetPageIndex),
    reloadAndRest: async () => await tableRef.value?.reloadAndRest?.(),
    reset: async () => await tableRef.value?.reset?.(),
    saveEditable: async (recordKey: RecordKey, needReTry?: boolean) => await tableRef.value?.saveEditable?.(recordKey, needReTry),
    scrollTo: (arg: number | {
      index?: number | undefined
      key?: Key | undefined
      top?: number
    }) => tableRef.value?.scrollTo?.(arg),
    setPageInfo: async (page: Partial<PageInfo>) => tableRef.value?.setPageInfo(page),
    startEditable: async (recordKey: Key, record?: T) => await tableRef.value?.startEditable?.(recordKey, record),
  })
}

/**
 * 将 editableKeys 解析为 RowEditableConfig.onChange 的第二参数，
 * 与 useEditableArray 内 setEditableRowKeys 一致：single 为单条（可为空场景下的 undefined），multiple 为数组。
 */
export function resolveEditingPayloadForRowEditableOnChange<
  DataType extends Record<string, any>,
>(
  keys: Key[],
  dataSource: readonly DataType[] | undefined,
  getRowKey: GetRowKey<DataType>,
  editableType: 'single' | 'multiple' | undefined,
  childrenColumnName = 'children',
): DataType | DataType[] {
  const cleanKeys = keys.filter(key => key !== undefined)
  const kvMap = new Map<Key, DataType>()
  const dig = (records: readonly DataType[]) => {
    records.forEach((record, index) => {
      const rowKey = getRowKey(record, index)
      kvMap.set(rowKey, record)
      if (
        record
        && typeof record === 'object'
        && childrenColumnName in record
      ) {
        dig(((record as any)[childrenColumnName] || []) as DataType[])
      }
    })
  }
  dig(dataSource ?? [])
  const editingRecords = cleanKeys
    .map(key => kvMap.get(key))
    .filter((k): k is DataType => k !== undefined)
  const type = editableType || 'single'
  const editingPayload
    = type === 'single' ? editingRecords[0] : editingRecords
  return editingPayload as DataType | DataType[]
}
