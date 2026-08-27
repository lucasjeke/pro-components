import type { ParamsType } from '@antdv-next1/pro-provider'
import type { Key, ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { GetRowKey } from 'antdv-next/dist/table/interface'
import type { SetupContext } from 'vue'
import type { ProColumns } from '../../typing'
import type { EditableProTableInstance, EditableProTableProps } from './InternalEditableTable'
import { useMemo, useState } from '@antdv-next1/pro-utils'
import { computed, defineComponent, shallowRef } from 'vue'
import EditableTable from '../EditableTable/EditableTable'
import { useEditableProTableInstanceExpose } from './InternalEditableTable'

const RowEditorTable = defineComponent(<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: EditableProTableProps<DataType, Params, ValueType>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const [editableKeys, setEditableRowKeys] = useState<Key[]>([])
  const rowKey = computed(() => props.rowKey || 'id')
  const editableTableRef = shallowRef<EditableProTableInstance<DataType> | null>(null)
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

  expose(useEditableProTableInstanceExpose(editableTableRef))
  return () => (
    <EditableTable
      {...props}
      ref={editableTableRef}
      bordered={props.bordered || true}
      pagination={props.pagination || false}
      editable={{
        editableKeys: editableKeys.value,
        ...props.editable,
      }}
      columns={
        (props?.columns?.map((item) => {
          return {
            ...item,
            onCell: (record: any, rowIndex: any) => ({
              onDblclick: () => setEditableRowKeys([getRowKey.value(record, rowIndex)]),
              onBlur: () => setEditableRowKeys([]),
            }),
          }
        }) as ProColumns[]) || []
      }
      v-slots={slots}
    />
  )
}, {
  name: 'RowEditorTable',
  inheritAttrs: false,
  props: ['beforeSearchSubmit', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columnEmptyText', 'columns', 'columnsState', 'components', 'controlled', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSize', 'defaultValue', 'direction', 'dropdownPrefixCls', 'editable', 'errorBoundaryRender', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'formItemProps', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'headerTitle', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'maxLength', 'measureRowRender', 'name', 'onChange', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSizeChange', 'onSubmit', 'onTableChange', 'onValuesChange', 'options', 'optionsRender', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'recordCreatorProps', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'search', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableAlertOptionRender', 'tableAlertRender', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableStyle', 'tableViewRender', 'tailor', 'title', 'toolBarRender', 'toolbar', 'tooltip', 'type', 'value', 'virtual'],
})

export default RowEditorTable
