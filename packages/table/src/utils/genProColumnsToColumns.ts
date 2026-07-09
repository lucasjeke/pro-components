import type { ProFieldEmptyText } from '@antdv-next1/pro-field'
import type { ParamsType } from '@antdv-next1/pro-provider'
import type { Key, ProFieldValueObjectType, ProFieldValueType, ProSchemaComponentTypes, UseEditableUtilType, VueNode } from '@antdv-next1/pro-utils'
import type { TableProps } from 'antdv-next'
import type { AnyObject } from 'antdv-next/dist/_util/type'
import type { SortOrder } from 'antdv-next/dist/table/index'
import type { GetRowKey } from 'antdv-next/dist/table/interface'
import type { ColumnsState, ContainerReturnType } from '../Store/Provide'
import type { FilterValue, ProColumns, ProColumnType, ProSorter } from '../typing'
import { proFieldParsingValueEnumToArray } from '@antdv-next1/pro-field'
import { omitBoolean, omitUndefinedAndEmptyArr, runFunction } from '@antdv-next1/pro-utils'
import { Table } from 'antdv-next'
import { shallowReactive } from 'vue'
import columnRender, { defaultOnFilter, renderColumnsTitle } from './columnRender'

type ResizeWidthMap = Record<string, number>

type ColumnToColumnParams<T, U, ValueType> = {
  columns?: ProColumns<T, ValueType>[]
  counter?: ContainerReturnType<T, U, ValueType>
  columnEmptyText?: ProFieldEmptyText
  type?: ProSchemaComponentTypes
  marginSM: number
  editableUtils?: UseEditableUtilType<T>
  childrenColumnName?: string
  proFilter?: Record<string, FilterValue>
  proSort?: Record<string, SortOrder>
  columnResizeWidthMap?: ResizeWidthMap
} & Partial<Pick<TableProps<T>, 'rowKey'>>

const columnResizeWidthMaps = new WeakMap<object, ResizeWidthMap>()

function getColumnResizeWidthMap<T, ValueType>(
  columns: ProColumns<T, ValueType>[] | undefined,
  inheritedMap?: ResizeWidthMap,
) {
  if (inheritedMap)
    return inheritedMap
  if (!columns)
    return shallowReactive<ResizeWidthMap>({})
  const existingMap = columnResizeWidthMaps.get(columns)
  if (existingMap)
    return existingMap
  const nextMap = shallowReactive<ResizeWidthMap>({})
  columnResizeWidthMaps.set(columns, nextMap)
  return nextMap
}

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param index 序列号，理论上唯一
 */
export function genColumnKey<T>(key?: T, index?: Key): string {
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
export function parseDataIndex<T, K>(dataIndex: ProColumnType<T, K>['dataIndex']): string | undefined {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join(',')
  }
  return dataIndex?.toString()
}

/**
 * 判断是否为本地筛选
 * @param filters 筛选配置
 * @param onFilter 筛选函数
 * @returns 是否为本地筛选
 */
export function isLocalFilter<T, K>(filters: ProColumnType<T, K>['filters'], onFilter: ProColumnType<T, K>['onFilter']) {
  return !!filters && !!onFilter
}

/**
 * 判断是否为本地排序
 * @param sorter 排序配置
 * @returns 是否为本地排序
 */
export function isLocalSorter<T>(sorter: ProSorter<T>) {
  return (
    typeof sorter === 'function'
    || (typeof sorter === 'object' && typeof sorter.compare === 'function')
  )
}

/**
 * 解析对应排序值，用作双向绑定
 * @param proSort 排序配置
 * @param columnProps 列配置
 * @returns 排序值
 */
export function parseProSortOrder<T, K>(proSort?: Record<string, SortOrder>, columnProps?: ProColumnType<T, K>): SortOrder | undefined {
  const { sorter, sortOrder: columnSortOrder, dataIndex } = columnProps || {}

  // 优先使用用户明确设置的 sortOrder
  if (columnSortOrder !== undefined)
    return columnSortOrder

  // 如果没有排序器配置，直接返回 undefined
  if (sorter == null)
    return undefined

  // 如果是本地排序，不使用 proSort 中的值
  if (isLocalSorter(sorter))
    return undefined

  // 服务端排序：确定排序键
  const sortKey
    = typeof sorter === 'string' ? sorter : parseDataIndex(dataIndex)

  // 返回对应的排序值
  return sortKey ? proSort?.[sortKey] : undefined
}

/**
 * 解析对应筛选值，用作双向绑定
 * @param proFilter 筛选配置
 * @param columnProps 列配置
 * @returns 筛选值
 */
export function parseProFilteredValue<T, K>(proFilter?: Record<string, FilterValue>, columnProps?: ProColumnType<T, K>): FilterValue | undefined {
  const {
    filters,
    onFilter,
    filteredValue: columnFilteredValue,
    dataIndex,
  } = columnProps || {}

  // 优先使用用户设置的 filteredValue
  if (columnFilteredValue !== undefined)
    return columnFilteredValue as FilterValue

  // 如果没有筛选配置，直接返回 undefined
  if (filters == null)
    return undefined

  // 如果是本地筛选，不使用 proFilter 中的值
  if (isLocalFilter<T, K>(filters, onFilter))
    return undefined

  // 服务端排序：获取筛选键
  const filterKey = parseDataIndex<T, K>(dataIndex)

  // 返回对应的筛选值
  return filterKey ? proFilter?.[filterKey] : undefined
}

function parseColumnFilterSort<T, K>(
  proFilter?: Record<string, FilterValue>,
  proSort?: Record<string, SortOrder>,
  columnProps?: ProColumns<T, K>,
) {
  return {
    filteredValue: parseProFilteredValue<T, K>(proFilter, columnProps),
    sortOrder: parseProSortOrder<T, K>(proSort, columnProps),
  }
}

function resolveOnFilter<T, U>(columnProps: ProColumns<T, U>) {
  const { onFilter, dataIndex } = columnProps
  if (onFilter === true) {
    return (value: string, row: T) =>
      defaultOnFilter(value, row, dataIndex as string[])
  }
  return omitBoolean(onFilter)
}

function resolveFilters<T, U>(columnProps: ProColumns<T, U>) {
  const { filters = [], valueEnum } = columnProps
  if (filters === true) {
    return proFieldParsingValueEnumToArray(
      runFunction<[undefined]>(valueEnum, undefined),
    ).filter(valueItem => valueItem && valueItem.value !== 'all')
  }
  return filters
}

function getColumnConfig<T>(
  columnsMap: Record<string, ColumnsState> | undefined,
  columnKey: string,
  columnProps: ProColumns<T, any>,
) {
  const config = columnsMap?.[columnKey] || { fixed: columnProps.fixed }
  return { fixed: config.fixed }
}

function updateSubNameRecord<T extends AnyObject>(
  rowData: T,
  index: number,
  keyName: Key,
  childrenColumnName: string | undefined,
  subNameRecord: Map<Key, (Key | undefined)[]>,
) {
  if (
    !(Object.prototype.toString.call(rowData) === '[object Object]')
    || rowData === null
    || !Reflect.has(rowData, keyName)
  ) {
    return undefined
  }
  const record = rowData
  const uniqueKey = record?.[keyName as keyof typeof record] as Key
  const parentInfo = subNameRecord.get(uniqueKey) || [];
  (record?.[childrenColumnName as keyof typeof record] as Record<string, any>[])?.forEach((item) => {
    const itemUniqueKey = item[keyName] as Key
    if (!subNameRecord.has(itemUniqueKey)) {
      subNameRecord.set(
        itemUniqueKey,
        parentInfo.concat([index, childrenColumnName]),
      )
    }
  })
  return uniqueKey
}

function createCellRender<T extends AnyObject, U extends ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(columnProps: ProColumns<T, ValueType>, context: {
  rowKey?: string | number | symbol | GetRowKey<T>
  type?: ProSchemaComponentTypes
  counter?: ContainerReturnType<T, U, ValueType>
  childrenColumnName?: string
  marginSM: number
  columnEmptyText?: ProFieldEmptyText
  editableUtils?: UseEditableUtilType<T>
}, subNameRecord: Map<Key, string[]>) {
  let keyName = (context.rowKey ?? 'id') as Key
  return (text: VueNode, rowData: T, index: number) => {
    if (typeof context.rowKey === 'function') {
      keyName = context.rowKey(rowData, index)
    }
    const uniqueKey = updateSubNameRecord(
      rowData,
      index,
      keyName,
      context.childrenColumnName,
      subNameRecord,
    )
    return columnRender<T, U, ValueType>({
      columnProps,
      text,
      rowData,
      index,
      columnEmptyText: context.columnEmptyText,
      counter: context.counter,
      type: context.type,
      marginSM: context.marginSM,
      subName: subNameRecord.get(uniqueKey!),
      editableUtils: context.editableUtils,
    })
  }
}
/**
 * 转化 columns 到 pro 的格式 主要是 render 方法的自行实现
 *
 */
export function genProColumnsToColumns<T extends Record<string, any>, U extends ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(params: ColumnToColumnParams<T, U, ValueType>, parents?: ProColumns<T, any>) {
  const {
    columns,
    counter,
    proFilter,
    proSort,
    columnEmptyText,
    marginSM,
    editableUtils,
    rowKey = 'id',
    type = 'table',
    childrenColumnName = 'children',
  } = params
  const subNameRecord = new Map<Key, string[]>()
  const columnResizeWidthMap = getColumnResizeWidthMap(columns, params.columnResizeWidthMap)
  return columns
    ?.map((columnProps, columnsIndex) => {
      if (columnProps === Table.EXPAND_COLUMN)
        return columnProps
      if (columnProps === Table.SELECTION_COLUMN)
        return columnProps
      const {
        key,
        dataIndex,
        valueEnum,
        valueType = 'text',
        children,
      } = columnProps
      const columnKey = genColumnKey(
        key || dataIndex?.toString(),
        [parents?.key, columnsIndex].filter(Boolean).join('-'),
      )
      // 这些都没有，说明是普通的表格不需要 pro 管理
      const noNeedPro = !valueEnum && !valueType && !children
      if (noNeedPro) {
        return {
          index: columnsIndex,
          ...columnProps,
        }
      }
      const { filteredValue, sortOrder } = parseColumnFilterSort(
        proFilter,
        proSort,
        columnProps,
      )
      const { fixed } = getColumnConfig(
        counter?.columnsMap?.value,
        columnKey,
        columnProps,
      )
      const width = columnResizeWidthMap[columnKey] ?? columnProps.width ?? (columnProps.fixed ? 200 : undefined)
      const tempColumns: ProColumns<T, ValueType> & {
        index?: number
      } = {
        index: columnsIndex,
        key: columnKey,
        ...columnProps,
        title: renderColumnsTitle(columnProps),
        valueEnum,
        filters: resolveFilters(columnProps),
        onFilter: resolveOnFilter(columnProps),
        filteredValue,
        sortOrder,
        fixed,
        width,
        children: columnProps.children
          ? genProColumnsToColumns<T, U, ValueType>(
              {
                ...params,
                columns: columnProps.children || [],
                columnResizeWidthMap,
              },
              { ...columnProps, key: columnKey },
            )
          : undefined,
        render: createCellRender<T, U, ValueType>(columnProps, {
          rowKey,
          type,
          childrenColumnName,
          counter,
          marginSM,
          columnEmptyText,
          editableUtils,
        }, subNameRecord),

      }
      const finalColumns = omitUndefinedAndEmptyArr(tempColumns) as typeof tempColumns
      if (columnProps.resizable) {
        finalColumns.onHeaderCell = (data, cellIndex) => {
          const headerCellProps = columnProps.onHeaderCell?.(data, cellIndex)
          return {
            ...headerCellProps,
            resizable: true,
            width: finalColumns.width,
            onResize: (event: MouseEvent, { size }: { size: { width: number } }) => {
              columnResizeWidthMap[columnKey] = size.width
              finalColumns.width = size.width
              ;(headerCellProps as any)?.onResize?.(event, { size })
            },
          } as any
        }
      }
      return finalColumns
    })
    ?.filter(item => !item?.hideInTable)
}
