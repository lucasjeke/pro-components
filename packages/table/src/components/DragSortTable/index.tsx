import type { ParamsType } from '@antdv-next1/pro-provider'
import type { ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ProTableProps } from '../../typing'
import { useToken } from '@antdv-next1/pro-provider'
import { HolderOutlined } from '@antdv-next/icons'
import { classNames, useMergedState } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, toRef } from 'vue'
import ProTable from '../../Table'
import { useDragSort } from '../../utils/useDragSort'
import useStyle from './style'

export type DragSortTableProps<T, U, ValueType> = ProTableProps<T, U, ValueType> & {
  /** @name dragSortKey 拖动排序列key值 如配置此参数，则会在该 key 对应的行显示拖拽排序把手，允许拖拽排序 */
  dragSortKey?: string
  /** @name dragSortHandlerRender 渲染自定义拖动排序把手的函数 如配置了 dragSortKey 但未配置此参数，则使用默认把手图标 */
  dragSortHandlerRender?: (rowData: Record<string, any>, idx: number) => VueNode
  /** @name onDragSortEnd 拖动排序完成回调 */
  onDragSortEnd?: (
    beforeIndex?: number | string,
    afterIndex?: number | string,
    newDataSource?: Record<string, any>[],
  ) => Promise<void> | void
}

const DragSortTable = defineComponent(<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: DragSortTableProps<DataType, Params, ValueType>, { slots, attrs, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const config = useConfig()
  const [dataSource, setDataSource] = useMergedState<DataType[]>(
    () => props.defaultData || [],
    {
      value: computed(() => props.dataSource!),
      onChange: props.onDataSourceChange,
    },
  )
  const { token } = useToken()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table-drag`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  // 默认拖拽把手
  const DragHandle = (dragHandleProps: any) => {
    const { rowData, index, className, ref: $ref, ...rest } = dragHandleProps
    const defaultDom = (
      <HolderOutlined
        {...rest}
        class={classNames(`${baseClassName.value}-icon`, className, hashId.value, cssVarCls.value)}
      />
    )

    const handle = props.dragSortHandlerRender
      ? props.dragSortHandlerRender(dragHandleProps?.rowData, dragHandleProps?.index)
      : defaultDom
    return (
      <div ref={$ref} {...rest}>
        {handle}
      </div>
    )
  }
  // 使用自定义hooks获取拖拽相关组件的components集合
  const { DndContext, components } = useDragSort({
    dataSource: computed(() => dataSource.value?.slice()),
    dragSortKey: toRef(() => props.dragSortKey),
    onDragSortEnd: props.onDragSortEnd,
    token,
    components: toRef(() => props.components),
    rowKey: toRef(() => props.rowKey),
    dragHandle: DragHandle,
  })

  const wrapOnload = async (ds: DataType[]) => {
    setDataSource(ds)
    return props.onLoad?.(ds)
  }
  expose({})
  return () => {
    const {
      rowKey,
      dragSortKey,
      dragSortHandlerRender,
      onDragSortEnd,
      onDataSourceChange,
      defaultData,
      dataSource: originDataSource,
      onLoad,
      ...otherProps
    } = props
    return (
      <ProTable
        {...otherProps}
        class={classNames(attrs.class, baseClassName.value, hashId.value, cssVarCls.value)}
        columns={otherProps.columns?.map((item) => {
          if (item.dataIndex === dragSortKey || item.key === dragSortKey) {
            if (!item.render) {
              item.render = () => null
            }
          }
          return item
        })}
        onLoad={wrapOnload}
        rowKey={rowKey}
        tableViewRender={(_, defaultDom) => <DndContext>{defaultDom}</DndContext>}
        components={components}
        dataSource={dataSource.value}
        onDataSourceChange={onDataSourceChange}
        v-slots={slots}
      />
    )
  }
}, {
  name: 'DragSortTable',
  inheritAttrs: false,
  props: ['tableAlertRender', 'dragSortKey', 'dragSortHandlerRender', 'onDragSortEnd', 'tableAlertOptionRender', 'beforeSearchSubmit', 'columnEmptyText', 'editable', 'options', 'tooltip', 'search', 'headerTitle', 'tableStyle', 'toolBarRender', 'optionsRender', 'columnsState', 'onSizeChange', 'toolbar', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columns', 'components', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'direction', 'dropdownPrefixCls', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'measureRowRender', 'name', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSubmit', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableViewRender', 'tailor', 'title', 'type', 'virtual'],
})

export default DragSortTable
