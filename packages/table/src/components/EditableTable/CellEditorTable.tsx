import type { ParamsType } from '@antdv-next1/pro-provider'
import type { Key, ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { GetRowKey } from 'antdv-next/dist/table/interface'
import type { SetupContext } from 'vue'
import type { ProColumns } from '../../typing'
import type { EditableProTableInstance, EditableProTableProps } from './InternalEditableTable'
import { useMemo, useState } from '@antdv-next1/pro-utils'
import { computed, defineComponent, shallowRef } from 'vue'
import { resolveEditingPayloadForRowEditableOnChange } from '../../utils'
import EditableTable from '../EditableTable/EditableTable'
import { useEditableProTableInstanceExpose } from './InternalEditableTable'

const CellEditorProTable = defineComponent(<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: EditableProTableProps<DataType, Params, ValueType>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const editableTableRef = shallowRef<EditableProTableInstance<DataType> | null>(null)
  const [editableKeys, setEditableRowKeys] = useState<Key[]>(props.editable?.editableKeys ?? [])
  const [dataIndex, setDataIndex] = useState<any[]>([])
  const rowKey = computed(() => props.rowKey || 'id')
  // 用于延迟退出编辑的定时器，避免点击下拉面板等场景误关编辑态
  const blurTimerRef = shallowRef<ReturnType<typeof setTimeout>>()
  // ============================ RowKey ============================
  const getRowKey = useMemo<GetRowKey<any>>(() => {
    if (typeof rowKey.value === 'function') {
      return rowKey.value
    }
    return (record: Record<string, any>, index?: number) => {
      if (index === -1) {
        return (record as Record<string, any>)?.[rowKey.value as string]
      }
      // 如果 props 中有name 的话，用index 来做行号，这样方便转化为 index
      if (props.name) {
        return index?.toString()
      }
      return (record as any)?.[rowKey.value as string] ?? index?.toString()
    }
  }, [() => props.name, rowKey])
  const cancelExitEditing = () => {
    if (blurTimerRef.value) {
      clearTimeout(blurTimerRef.value)
      blurTimerRef.value = undefined
    }
  }
  const handleEditableKeysChange = (keys: Key[]) => {
    const cleanKeys = keys.filter(key => key !== undefined)
    setEditableRowKeys(cleanKeys)
    const editingPayload = resolveEditingPayloadForRowEditableOnChange(
      cleanKeys,
      props.value as readonly DataType[] | undefined,
      getRowKey.value,
      props.editable?.type,
    )
    props.editable?.onChange?.(cleanKeys, editingPayload)
  }
  expose(useEditableProTableInstanceExpose(editableTableRef))
  return () => (
    <EditableTable
      ref={editableTableRef}
      {...props}
      bordered={props.bordered || true}
      pagination={props.pagination || false}
      editable={{
        ...props.editable,
        editableKeys: editableKeys.value,
      }}
      columns={
        (props?.columns?.map((item) => {
          return {
            ...item,
            editable:
                dataIndex.value.flat(1).join('.') === [item.dataIndex || item.key].flat(1).join('.')
                  ? undefined
                  : false,
            onCell: (record: any, rowIndex: any) => ({
              onDblclick: () => {
                cancelExitEditing()
                handleEditableKeysChange([getRowKey.value(record, rowIndex)])
                setDataIndex([item.dataIndex || (item.key as string)])
              },
              onBlur: () => setEditableRowKeys([]),
              onFocus: cancelExitEditing,
            }),
          }
        }) as ProColumns[]) || []
      }
      v-slots={slots}
    />
  )
}, {
  name: 'CellEditorProTable',
  inheritAttrs: false,
  props: ['beforeSearchSubmit', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columnEmptyText', 'columns', 'columnsState', 'components', 'controlled', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSize', 'defaultValue', 'direction', 'dropdownPrefixCls', 'editable', 'errorBoundaryRender', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'formItemProps', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'headerTitle', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'maxLength', 'measureRowRender', 'name', 'onChange', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSizeChange', 'onSubmit', 'onTableChange', 'onValuesChange', 'options', 'optionsRender', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'recordCreatorProps', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'search', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableAlertOptionRender', 'tableAlertRender', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableStyle', 'tableViewRender', 'tailor', 'title', 'toolBarRender', 'toolbar', 'tooltip', 'type', 'value', 'virtual'],
})

export default CellEditorProTable
