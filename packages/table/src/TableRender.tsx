import type { ProFormProps } from '@antdv-next1/pro-form'
import type { ParamsType } from '@antdv-next1/pro-provider'
import type { ProFieldValueObjectType, ProFieldValueType, UseEditableUtilType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { TableProps } from 'antdv-next'
import type { CardSemanticStyles } from 'antdv-next/dist/card/Card'
import type { GetRowKey, SorterResult, SortOrder, TableCurrentDataSource, TablePaginationConfig } from 'antdv-next/dist/table/interface'
import type { CSSProperties, SetupContext } from 'vue'
import type { FilterValue, ProColumns, ProTableProps, UseFetchDataAction } from './typing'
import ProCard from '@antdv-next1/pro-card'
import ProForm from '@antdv-next1/pro-form'
import { editableRowByKey, omitUndefined, recordKeyToString } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { ConfigProvider, Table } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import ResizableTableTitle from './ResizableTableTitle'
import { useTableContextInject } from './Store/Provide'
import { flattenColumns, genColumnKey, getServerFilterResult, getServerSorterResult, isBordered } from './utils'

function getEditableDataSource<T, K, P extends (ProFieldValueType | ProFieldValueObjectType)>({
  dataSource,
  editableUtils,
  pagination,
  getRowKey,
  childrenColumnName,
}: {
  dataSource?: readonly T[] | undefined
  editableUtils?: UseEditableUtilType<T>
  pagination?: ProTableProps<T, K, P>['pagination']
  getRowKey?: GetRowKey<T>
  childrenColumnName?: string
}): T[] {
  const baseData: T[] = Array.isArray(dataSource) ? [...dataSource] : []
  const newLineConfig = editableUtils?.newLineRecord
  const defaultValue = newLineConfig?.value?.defaultValue

  if (!newLineConfig?.value || !defaultValue) {
    return baseData
  }

  const { options: newLineOptions } = newLineConfig.value
  const childrenName = childrenColumnName || 'children'

  if (newLineOptions?.parentKey) {
    const newRow = {
      ...defaultValue,
      map_row_parentKey: recordKeyToString(
        typeof newLineOptions.parentKey === 'function' ? newLineOptions.parentKey() : newLineOptions.parentKey,
      )?.toString(),
    }
    const actionProps = {
      data: baseData,
      getRowKey,
      row: newRow,
      key: newLineOptions?.recordKey ?? getRowKey?.(newRow as T, -1),
      childrenColumnName: childrenName,
    }

    return editableRowByKey(
      actionProps,
      newLineOptions?.position === 'top' ? 'top' : 'update',
    )
  }

  if (newLineOptions?.position === 'top') {
    return [defaultValue, ...baseData]
  }

  const pageConfig
    = pagination && typeof pagination === 'object' ? pagination : undefined

  if (pageConfig?.current && pageConfig?.pageSize) {
    if (pageConfig.pageSize > baseData.length) {
      baseData.push(defaultValue)
      return baseData
    }
    const insertIndex = pageConfig.current * pageConfig.pageSize - 1
    baseData.splice(insertIndex, 0, defaultValue)
    return baseData
  }

  baseData.push(defaultValue)
  return baseData
}

function getTableCardBodyStyle<T, U, ValueType>({
  propsCardProps,
  notNeedCardDom,
  name,
  hideToolbar,
  toolbarDom,
}: {
  propsCardProps: ProTableProps<T, U, ValueType>['cardProps']
  notNeedCardDom: boolean
  name: ProTableProps<T, U, ValueType>['name']
  hideToolbar: boolean | undefined
  toolbarDom: VueNode
}): CSSProperties {
  // cardProps === false 或存在 name 的场景不需要额外 padding 处理
  if (propsCardProps === false || notNeedCardDom || !!name) {
    return {}
  }

  // 显式隐藏 toolbar 时，统一不留 padding（避免误用 paddingBlockStart）
  if (hideToolbar) {
    return { padding: 0 }
  }

  // 有 toolbar 的场景，需要让 ProCard body 顶部与 toolbar 对齐
  if (toolbarDom) {
    return { paddingBlockStart: 0 }
  }

  return { padding: 0 }
}

function mergeResizableTableComponents<RecordType>(
  components: TableProps<RecordType>['components'],
): TableProps<RecordType>['components'] {
  if (components?.header?.cell)
    return components
  return {
    ...components,
    header: {
      ...components?.header,
      cell: ResizableTableTitle,
    },
  }
}

const TableRender = defineComponent(<
  RecordType extends Record<string, any> = Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text',
>(props: Omit<ProTableProps<RecordType, Params, ValueType>, 'errorBoundaryRender' | 'dataSource' | 'request'> & {
  tableColums?: ProColumns<RecordType, ValueType>[]
  action?: UseFetchDataAction<RecordType>
  editableUtils?: UseEditableUtilType<RecordType>
  toolbarDom?: VueNode
  alertDom?: VueNode
  getRowKey?: GetRowKey<RecordType>
  isLightFilter?: boolean
  searchNode?: VueNode
  hideToolbar?: boolean
  onSortChange?: (sort: Record<string, SortOrder>) => void
  onFilterChange?: (filter: Record<string, FilterValue | null>) => void
},
  { slots, expose, attrs }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>,
) => {
  const counter = useTableContextInject<RecordType, Params, ValueType>()

  /** 需要遍历一下，不然不支持嵌套表格 */
  const columns = computed(() => {
    const loopFilter = (column?: ProColumns<RecordType, ValueType>[]): ProColumns<RecordType, ValueType>[] => {
      if (!Array.isArray(column))
        return []
      return column
        ?.map((item) => {
          // 删掉不应该显示的
          const columnKey = genColumnKey(item.key, item.index)
          const config = counter.columnsMap?.value?.[columnKey]
          if (config && config.show === false) {
            return false
          }
          if (item.children) {
            return {
              ...item,
              children: loopFilter(item.children),
            }
          }
          return item
        })
        .filter(Boolean) as ProColumns<RecordType, ValueType>[]
    }
    return loopFilter(props.tableColums) ?? []
  })
  const mergedDataSource = computed(() => getEditableDataSource<RecordType, Params, ValueType>({
    dataSource: props.action?.dataSource.value,
    editableUtils: props.editableUtils,
    pagination: props.pagination,
    getRowKey: props.getRowKey,
    childrenColumnName: props.expandable?.childrenColumnName || 'children',
  }))
  const useFilterColumns = computed(() => {
    const _columns = flattenColumns(columns.value)
    return _columns.filter(column => !!column.filters)
  })

  expose({})
  return () => {
    const {
      tableViewRender,
      cardProps,
      isLightFilter,
      options,
      type = 'table',
      search,
      headerTitle,
      tableRender,
      toolBarRender,
      rowKey,
      size,
      columnsState,
      dateFormatter,
      debounceTime,
      defaultData,
      onSizeChange,
      form,
      prefixCls,
      ghost,
      hideToolbar,
      editableUtils,
      searchNode,
      action,
      pagination,
      tableColums,
      rowSelection,
      name: isEditorTable,
      manualRequest,
      onDataSourceChange,
      tableExtraRender,
      alertDom,
      beforeSearchSubmit,
      cardBordered,
      onLoad,
      onSubmit,
      optionsRender,
      params,
      polling,
      postData,
      toolbar,
      tooltip,
      tableClass,
      tableStyle,
      toolbarDom,
      revalidateOnFocus,
      searchFormRender,
      onLoadingChange,
      onRequestError,
      onReset,
      getRowKey,
      tableAlertOptionRender,
      tableAlertRender,
      columnEmptyText,
      onFilterChange,
      onSortChange,
      editable,
      columns: propsColumns,
      ...rest
    } = props
    const tableProps = {
      ...rest,
      size: counter.tableSize?.value,
      rowSelection: rowSelection === false ? undefined : rowSelection,
      class: tableClass,
      style: tableStyle,
      columns: columns.value! as any,
      components: mergeResizableTableComponents<RecordType>(rest.components),
      loading: action?.loading.value,
      dataSource: mergedDataSource.value,
      pagination,
      onChange: (
        changePagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
        extra: TableCurrentDataSource<RecordType>,
      ) => {
        rest.onChange?.(changePagination, filters, sorter, extra)
        const serverFilter = getServerFilterResult(filters, useFilterColumns.value)
        onFilterChange?.(omitUndefined(serverFilter))

        const serverSorter = getServerSorterResult(sorter)
        onSortChange?.(omitUndefined(serverSorter))
      },
    }
    /** 默认的 table dom，如果是编辑模式，外面还要包个 form */
    const baseTableDom = (
      <Table
        {...(tableProps as TableProps)}
        rowKey={typeof rowKey === 'function' ? (record, index) => rowKey(record as RecordType, index) : rowKey?.toString()}
        v-slots={slots}
      />
    )
    /** 自定义的 render */
    const tableDom = tableViewRender
      ? tableViewRender(
          {
            ...tableProps,
            rowSelection: rowSelection !== false ? rowSelection : undefined,
          },
          baseTableDom,
        )
      : baseTableDom
    const tableContentDom
      = editable && !isEditorTable ? (
        <>
          {toolbarDom}
          {alertDom}
          <ProForm
            ref={editable?.formProps?.formRef}
            {...editable?.formProps as ProFormProps<RecordType, Params>}
            key="table"
            submitter={false}
            omitNil={false}
            onValuesChange={(changedValues, values) => editableUtils?.onValuesChange?.(changedValues as RecordType, values as RecordType)}
            dateFormatter={dateFormatter}
          >
            {tableDom}
          </ProForm>
        </>
      ) : (
        <>
          {toolbarDom}
          {alertDom}
          {tableDom}
        </>
      )
    /**
     * 是否需要 card 来包裹
     */
    const notNeedCardDom = search === false && !headerTitle && toolBarRender === false

    const cardBodyStyle = getTableCardBodyStyle<RecordType, Params, ValueType>({
      propsCardProps: cardProps,
      notNeedCardDom,
      name: props.name,
      hideToolbar,
      toolbarDom,
    })

    /** ProTable：有搜索/工具栏/标题时使用卡片包裹；可编辑表格（name）不包裹 */
    /** ProListy：始终使用卡片包裹（除非 cardProps 为 false） */
    const useCard = (cardProps !== false && !isEditorTable && !notNeedCardDom) || (cardProps !== false && type === 'listy')

    const resolvedCardProps = cardProps === false ? {} : cardProps ?? {}
    /** Table 区域的 dom，为了方便 render */
    const tableAreaDom
      = !useCard ? (
        tableContentDom
      ) : (
        <ProCard
          {...resolvedCardProps}
          ghost={ghost}
          variant={isBordered('table', typeof cardBordered === 'string' ? true : cardBordered) ? 'outlined' : 'borderless'}
          styles={{
            ...resolvedCardProps.styles,
            body: {
              ...cardBodyStyle,
              ...((resolvedCardProps.styles as CardSemanticStyles)?.body ?? {}),
            },
          }}
        >
          {tableContentDom}
        </ProCard>
      )
    const renderTable = () => {
      if (tableRender) {
        return tableRender(props, tableAreaDom, {
          toolbar: toolbarDom || undefined,
          alert: alertDom || undefined,
          table: tableDom || undefined,
        })
      }
      return tableAreaDom
    }
    const proTableDom = (
      <div
        class={classNames(attrs.class, {
          [`${prefixCls}-polling`]: action?.pollingLoading.value,
        })}
        style={attrs.style}
        ref={counter.rootDomRef}
      >
        {isLightFilter ? null : searchNode}
        {/* 渲染一个额外的区域，用于一些自定义 */}
        {type !== 'form' && props.tableExtraRender && (
          <div class={classNames(attrs.class, `${prefixCls}-extra`)}>
            {props.tableExtraRender(props, action?.dataSource.value || [])}
          </div>
        )}
        {type !== 'form' && renderTable()}
      </div>
    )
    if (!options || !options?.fullScreen) {
      return proTableDom
    }
    return (
      <ConfigProvider getPopupContainer={() => counter.rootDomRef?.value || document.body}>
        {proTableDom}
      </ConfigProvider>
    )
  }
}, {
  name: 'TableRender',
  inheritAttrs: false,
  props: ['searchNode', 'isLightFilter', 'editableUtils', 'hideToolbar', 'action', 'alertDom', 'getRowKey', 'toolbarDom', 'beforeSearchSubmit', 'tableColums', 'columnEmptyText', 'editable', 'options', 'tooltip', 'search', 'headerTitle', 'tableStyle', 'toolBarRender', 'optionsRender', 'columnsState', 'onSizeChange', 'toolbar', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columns', 'components', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'direction', 'dropdownPrefixCls', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'measureRowRender', 'name', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSubmit', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableViewRender', 'tailor', 'title', 'type', 'virtual', 'tableAlertRender', 'tableAlertOptionRender', 'onSortChange', 'onFilterChange', 'defaultSize'],
})

export default TableRender
