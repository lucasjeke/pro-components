import type { ProFormRef } from '@antdv-next1/pro-form'
import type { IntlType, ParamsType } from '@antdv-next1/pro-provider'
import type { PageInfo, ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SortOrder, TablePaginationConfig, TableRowSelection } from 'antdv-next/dist/table/index'
import type { GetRowKey } from 'antdv-next/dist/table/interface'
import type { ComputedRef, SetupContext } from 'vue'
import type { ActionType, FilterValue, ProTableProps, UseFetchDataAction } from './typing'
import { useProFormInstanceExpose } from '@antdv-next1/pro-form'
import { proTheme, useIntl } from '@antdv-next1/pro-provider'
import { stringify, useEditableArray, useEffect, useMountMergeState } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import isEqual from '@v-c/util/dist/isEqual'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, h, shallowRef, toRef, watchEffect } from 'vue'
import Alert from './components/Alert'
import FormSearch from './components/Form'
import Toolbar from './components/ToolBar'
import { useTableContextInject } from './Store/Provide'
import useStyle from './style'
import TableRender from './TableRender'
import useFetchData from './useFetchData'
import { flattenColumns, genColumnKey, mergePagination, parseServerDefaultColumnConfig, useActionType } from './utils'
import { columnSort } from './utils/columnSort'
import { genProColumnsToColumns } from './utils/genProColumnsToColumns'

function useRowKey<T, U, ValueType>(props: ProTableProps<T, U, ValueType>) {
  return computed(() => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey
    }
    const rowKey = ((record: T, index?: number) => {
      if (index === -1) {
        return record[props.rowKey as keyof typeof record]
      }
      if (props.name) {
        return index?.toString()
      }
      return record[props.rowKey as keyof typeof record] ?? index?.toString()
    }) as GetRowKey<T>
    return rowKey
  })
}

function useMergedPagination<T, U, ValueType>({
  pagination,
  action,
  intl,
  request,
  type,
}: {
  pagination: ProTableProps<T, U, ValueType>['pagination']
  action: UseFetchDataAction<T>
  intl: ComputedRef<IntlType>
  request: ProTableProps<T, U, ValueType>['request']
  type: ProTableProps<T, U, ValueType>['type']
}): ComputedRef<ProTableProps<T, U, ValueType>['pagination']> {
  return computed(() => {
    const newPropsPagination
      = pagination === false ? false : { ...(pagination || {}) }
    const pageConfig = {
      ...action.pageInfo.value,
      setPageInfo: ({ pageSize, current }: PageInfo) => {
        const { pageInfo } = action
        // pageSize 发生改变，并且你不是在第一页，切回到第一页
        // 这样可以防止出现 跳转到一个空的数据页的问题
        if (pageSize === pageInfo.value.pageSize || pageInfo.value.current === 1) {
          action.setPageInfo({ pageSize, current })
          return
        }

        // 通过request的时候清空数据，然后刷新不然可能会导致 pageSize 没有数据多
        if (request)
          action.setDataSource([])
        action.setPageInfo({
          pageSize,
          // 目前只有 Listy 和 Table 支持分页, List 有分页的时候 还是使用之前的当前页码
          current: type === 'listy' ? current : 1,
        })
      },
    }
    if (request && newPropsPagination) {
      delete newPropsPagination.onChange
      delete newPropsPagination.onShowSizeChange
    }
    return mergePagination<T>(
      newPropsPagination,
      pageConfig,
      intl.value,
    )
  })
}

const InternalProTable = defineComponent(<
  T extends Record<string, any>,
  U extends ParamsType,
  ValueType extends (ProFieldValueType | ProFieldValueObjectType),
>(props: ProTableProps<T, U, ValueType>,
  { slots, expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>,
) => {
  const config = useConfig()
  const formRef = shallowRef<ProFormRef<T>>()
  const prefixCls = computed(() => props.prefixCls ?? config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table`)
  const intl = useIntl()

  // ============================ Render ============================
  const { token } = proTheme?.useToken()
  /** 通用的来操作子节点的工具类 */
  const actionRef = shallowRef<ActionType<Record<string, any>, T> | undefined>()
  const counter = useTableContextInject<T, U, ValueType>()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  /** 单选多选的相关逻辑 */
  const [selectedRowKeys, setSelectedRowKeys] = useMountMergeState(
    props.rowSelection ? props.rowSelection?.defaultSelectedRowKeys || [] : undefined,
    {
      value: computed(() =>
        props.rowSelection ? props.rowSelection.selectedRowKeys : undefined,
      ),
    },
  )
  // ============================ Render ============================

  const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
    // 如果手动模式，或者 search 不存在的时候设置为 undefined
    // undefined 就不会触发首次加载
    if (props.manualRequest || props.search !== false) {
      return undefined
    }
    return {}
  })

  const [proFilter, setProFilter] = useMountMergeState<Record<string, FilterValue>>({})

  const [proSort, setProSort] = useMountMergeState<Record<string, SortOrder>>({})

  const defaultProTableParams = computed(() => {
    const { sort, filter } = parseServerDefaultColumnConfig(
      flattenColumns(props.columns),
    )
    return {
      defaultProFilter: filter,
      defaultProSort: sort,
    }
  })
  /** 设置默认排序和筛选值 */
  useEffect(() => {
    setProFilter(defaultProTableParams.value.defaultProFilter)
    setProSort(defaultProTableParams.value.defaultProSort)
  }, [() => defaultProTableParams.value.defaultProFilter, () => defaultProTableParams.value.defaultProSort])

  /** 需要初始化 不然默认可能报错 这里取了 defaultCurrent 和 current 为了保证不会重复刷新 */
  const fetchPagination = computed(() =>
    typeof props.pagination === 'object'
      ? (props.pagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1 },
  )

  // ============================ useFetchData ============================
  const fetchData = computed(() => {
    if (!props.request)
      return undefined
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {}),
        ...formSearch.value,
        ...props.params,
      } as U & {
        _timestamp?: number
      }
      delete actionParams._timestamp
      const response = await props.request?.(
        actionParams,
        proSort.value,
        proFilter.value,
      )
      return response
    }
  })
  const action = useFetchData(fetchData, props.defaultData, {
    pageInfo: computed(() => (props.pagination === false ? false : fetchPagination.value)),
    loading: toRef(() => props.loading),
    dataSource: toRef(() => props.dataSource),
    onDataSourceChange: props.onDataSourceChange,
    onLoad: props.onLoad,
    onLoadingChange: props.onLoadingChange,
    onRequestError: props.onRequestError,
    postData: props.postData,
    revalidateOnFocus: toRef(() => props.revalidateOnFocus || false),
    manual: computed(() => formSearch.value === undefined),
    polling: toRef(() => props.polling),
    effects: [
      () => stringify(props.params),
      () => stringify(formSearch.value),
      () => stringify(proFilter.value),
      () => stringify(proSort.value),
    ],
    debounceTime: toRef(() => props.debounceTime),
    onPageInfoChange: (pageInfo) => {
      if (!props.pagination || !fetchData.value)
        return
      // 总是触发一下 onChange 和  onShowSizeChange
      // 目前只有 List 和 Table 支持分页, List 有分页的时候打断 Table 的分页
      props.pagination?.onChange?.(pageInfo.current, pageInfo.pageSize)
      props.pagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize)
    },
  })
  /** 聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
  useEffect(() => {
    if (
      props.manualRequest
      || !props.request
      || !props.revalidateOnFocus
      || props.form?.ignoreRules
    ) {
      return
    }
    // 聚焦时重新请求事件
    const visibilitychange = async () => {
      if (document.visibilityState === 'visible') {
        await action.reload()
      }
    }
    document.addEventListener('visibilitychange', visibilitychange)
    return () => document.removeEventListener('visibilitychange', visibilitychange)
  }, [])

  /** SelectedRowKeys受控处理selectRows */
  const preserveRecords = shallowRef(new Map<any, T>())
  // ============================ RowKey ============================
  const getRowKey = useRowKey(props)

  watchEffect(() => {
    if (action.dataSource.value?.length) {
      action.dataSource.value.forEach((data) => {
        const dataRowKey = getRowKey.value(data, -1)
        preserveRecords.value.set(dataRowKey, data)
      })
    }
  })
  /** 清空所有的选中项 */
  const onCleanSelected = () => {
    if (props.rowSelection && props.rowSelection.onChange) {
      props.rowSelection.onChange([], [], { type: 'all' })
    }
    setSelectedRowKeys([])
  }
  if (counter.propsRef) {
    counter.propsRef.value = props
  }
  // 设置 name 到 store 中，里面用了 ref ，所以不用担心直接 set
  if (counter.setPrefixName) {
    counter.setPrefixName(props.name)
  }

  /** 可编辑行的相关配置 */
  const editableUtils = useEditableArray<T>(
    {
      ...props.editable,
      editableKeys: computed(() => props.editable?.editableKeys),
      tableName: computed(() => props.name),
      getRowKey,
      childrenColumnName: computed(() => props.expandable?.childrenColumnName || 'children'),
      dataSource: computed(() => action?.dataSource.value || []),
      setDataSource: (data) => {
        props.editable?.onValuesChange?.(undefined, data)
        action?.setDataSource(data)
      },
    },
  )
  /** 绑定 action */
  actionRef.value = useActionType(action, {
    nativeElement: computed(() => counter.rootDomRef?.value),
    focus: () => {
      // 聚焦到表格根元素
      counter.rootDomRef?.value?.focus()
    },
    fullScreen: async () => {
      if (!counter.rootDomRef?.value || !document.fullscreenEnabled) {
        return
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      else {
        await counter.rootDomRef?.value.requestFullscreen()
      }
    },
    onCleanSelected: async () => {
      // 清空选中行
      onCleanSelected()
    },
    resetAll: async () => {
      // 清空选中行
      onCleanSelected()

      // 清空 toolbar 搜索
      counter.setKeyWords?.(undefined)
      // 重置页码
      action.setPageInfo({
        current: 1,
      })

      // 重置绑定筛选值
      setProFilter(defaultProTableParams.value.defaultProFilter)
      // 重置绑定排序值
      setProSort(defaultProTableParams.value.defaultProSort)

      // 重置表单
      formRef.value?.resetFields()
      setFormSearch({})
    },
    editableUtils,
  })

  /** 同步 action */
  counter.setAction?.(actionRef.value)

  // ---------- 列计算相关 start  -----------------
  const tableColumns = computed(() => genProColumnsToColumns<T, U, ValueType>({
    columns: props.columns,
    counter,
    columnEmptyText: props.columnEmptyText || '-',
    type: props.type,
    editableUtils,
    marginSM: token.value.marginSM,
    rowKey: props.rowKey || 'id',
    childrenColumnName: props.expandable?.childrenColumnName ?? 'children',
    proFilter: proFilter.value,
    proSort: proSort.value,
  })?.sort(columnSort(counter.columnsMap?.value!)),
  )
  useEffect(() => {
    if (tableColumns.value && tableColumns.value.length > 0) {
      // 重新生成key的字符串用于排序
      const columnKeys = tableColumns.value.map(item => genColumnKey(item.key, item.index))
      counter.setSortKeyColumns?.(columnKeys)
    }
  }, [() => tableColumns.value])

  const selectedRows = computed(() =>
    selectedRowKeys.value?.map(key => preserveRecords.value?.get(key)),
  )

  /** 页面编辑的计算 */
  const pagination = useMergedPagination<T, U, ValueType>({
    pagination: props.pagination,
    action,
    intl,
    request: props.request,
    type: props.type || 'table',
  })

  const onFormSearchSubmit = async (values: U) => {
    // 判断search.onSearch返回值决定是否更新formSearch
    if (props.options && props.options.search) {
      const { name = 'keyword' } = props.options.search === true ? {} : props.options.search
      /** 如果传入的 onSearch 返回值为 false，则不要把options.search.name对应的值set到formSearch */
      if (typeof props.options.search !== 'boolean') {
        const success = await props.options.search?.onSearch?.(
          counter.keyWords?.value!,
        )
        if (success) {
          setFormSearch({
            ...values,
            [name]: counter.keyWords?.value,
          })
          return
        }
      }
    }
    setFormSearch(values)
  }
  const loading = computed(() => {
    if (typeof action.loading.value === 'object') {
      return action.loading.value.spinning || false
    }
    return action.loading.value
  })
  /** 是不是 LightFilter, LightFilter 有一些特殊的处理 */
  const isLightFilter = computed(
    () => props.search !== false && props.search?.filterType === 'light',
  )
  const hideToolbar = computed(
    () =>
      props.options === false
      && !props.headerTitle
      && !props.toolBarRender
      && !props.toolbar
      && !isLightFilter.value,
  )
  expose({
    ...actionRef.value,
    formRef: useProFormInstanceExpose(formRef),
  })
  return () => {
    const {
      name: isEditorTable,
      tableAlertRender,
      tableAlertOptionRender,
      rowSelection: propsRowSelection = false,
      toolBarRender,
      headerTitle,
      toolbar,
      ghost,
      search,
      columns,
      form,
      type = 'table',
      manualRequest,
      onReset,
      onSubmit,
      searchFormRender,
      optionsRender,
      dateFormatter,
      beforeSearchSubmit,
      cardBordered,
      options,
      tooltip,
    } = props
    /** 行选择相关的问题 */
    const rowSelection: TableRowSelection<T> = {
      selectedRowKeys: selectedRowKeys.value,
      ...props.rowSelection,
      onChange: (keys, rows) => {
        if (props.rowSelection && props.rowSelection.onChange) {
          props.rowSelection.onChange(keys, rows, {
            type: 'all',
          })
        }
        setSelectedRowKeys(keys)
      },
    }
    const defaultSearchNode = search === false && type !== 'form' ? null : (
      <FormSearch
        pagination={pagination.value}
        beforeSearchSubmit={beforeSearchSubmit}
        action={actionRef.value}
        columns={columns}
        onFormSearchSubmit={onFormSearchSubmit}
        ghost={ghost}
        onReset={onReset}
        onSubmit={onSubmit}
        loading={!!loading.value}
        manualRequest={manualRequest}
        search={search}
        form={form}
        type={type}
        cardBordered={typeof cardBordered === 'string' ? true : cardBordered}
        dateFormatter={dateFormatter}
      />
    )

    const searchNode = searchFormRender && defaultSearchNode ? searchFormRender(props, defaultSearchNode) : defaultSearchNode
    /** 内置的工具栏 */
    const toolbarDom
      = toolBarRender === false ? null : (
        <Toolbar
          headerTitle={headerTitle}
          hideToolbar={hideToolbar.value}
          selectedRows={selectedRows.value}
          loading={loading.value}
          selectedRowKeys={selectedRowKeys.value!}
          columns={tableColumns.value}
          tooltip={tooltip}
          toolbar={toolbar}
          onFormSearchSubmit={newValues =>
            setFormSearch({
              ...formSearch.value,
              ...newValues,
            })}
          searchNode={isLightFilter.value && searchNode !== null ? <searchNode ref={formRef} /> : null}
          options={options}
          optionsRender={optionsRender}
          action={actionRef.value}
          toolBarRender={toolBarRender}
        />
      )
      /** 内置的多选操作栏 */
    const alertDom = propsRowSelection ? (
      <Alert
        selectedRowKeys={selectedRowKeys.value!}
        selectedRows={selectedRows.value}
        onCleanSelected={onCleanSelected}
        alertOptionRender={tableAlertOptionRender}
        alertInfoRender={tableAlertRender}
        alwaysShowAlert={propsRowSelection?.alwaysShowAlert}
      />
    ) : null
    return (
      <TableRender
        {...props}
        class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
        name={isEditorTable}
        prefixCls={baseClassName.value}
        size={counter.tableSize?.value}
        onSizeChange={counter.setTableSize}
        pagination={pagination.value}
        searchNode={searchNode !== null ? h(searchNode, { ref: formRef }) : null}
        rowSelection={propsRowSelection ? rowSelection : undefined}
        tableColums={tableColumns.value}
        isLightFilter={isLightFilter.value}
        action={action}
        alertDom={alertDom}
        toolbarDom={toolbarDom}
        hideToolbar={hideToolbar.value}
        onSortChange={(sortConfig) => {
          if (isEqual(proSort.value, sortConfig))
            return
          setProSort(sortConfig ?? {})
        }}
        onFilterChange={(filterConfig) => {
          if (isEqual(filterConfig, proFilter.value))
            return
          setProFilter(filterConfig ?? {})
        }}
        editableUtils={editableUtils}
        getRowKey={getRowKey.value}
        v-slots={slots}
      />
    )
  }
}, {
  name: 'InternalProTable',
  props: ['beforeSearchSubmit', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columnEmptyText', 'columns', 'columnsState', 'components', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSize', 'direction', 'dropdownPrefixCls', 'editable', 'errorBoundaryRender', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'headerTitle', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'measureRowRender', 'name', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSizeChange', 'onSubmit', 'options', 'optionsRender', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'search', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableAlertOptionRender', 'tableAlertRender', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableStyle', 'tableViewRender', 'tailor', 'title', 'toolBarRender', 'toolbar', 'tooltip', 'type', 'virtual'],
})

export default InternalProTable
