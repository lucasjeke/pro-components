import type { ProFormInstance } from '@antdv-next1/pro-form'
import type { ParamsType } from '@antdv-next1/pro-provider'
import type { ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { App, Plugin, SetupContext } from 'vue'
import type { EditableProTableInstance, EditableProTableProps } from './InternalEditableTable'
import ProForm from '@antdv-next1/pro-form'
import {
  FormItem,
} from '@antdv-next1/pro-utils'
import { defineComponent, shallowRef } from 'vue'
import InternalEditableTable, { RecordCreator, useEditableProTableInstanceExpose } from './InternalEditableTable'

const _EditableProTable = defineComponent(<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: EditableProTableProps<DataType, Params, ValueType>, { slots, attrs, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
  tableViewRender?: () => VueNode
  tableExtraRender?: () => VueNode
  toolBarRender?: () => VueNode
  optionsRender?: () => VueNode
  tableRender?: () => VueNode
}>>) => {
  const form = ProForm.useFormInstance()
  const editableTableRef = shallowRef<EditableProTableInstance<DataType> | null>(null)
  expose(useEditableProTableInstanceExpose(editableTableRef))
  return () => {
    if (!props.name) {
      return (
        <InternalEditableTable
          {...attrs}
          ref={editableTableRef}
          {...props}
          tableLayout={props.tableLayout || 'fixed'}
          scroll={props.scroll || {
            x: 'max-content',
          }}
          v-slots={slots}
        />
      )
    }
    return (
      <FormItem
        style={{
          maxWidth: '100%',
        }}
        {...props?.formItemProps}
        name={props.name}
      >
        <InternalEditableTable
          {...attrs}
          {...props}
          ref={editableTableRef}
          tableLayout={props.tableLayout || 'fixed'}
          scroll={props.scroll || {
            x: 'max-content',
          }}
          editable={{
            ...props.editable,
            form: form as ProFormInstance,
          }}
          v-slots={slots}
        />
      </FormItem>
    )
  }
}, {
  name: 'EditableProTable',
  inheritAttrs: false,
  props: ['beforeSearchSubmit', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columnEmptyText', 'columns', 'columnsState', 'components', 'controlled', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSize', 'defaultValue', 'direction', 'dropdownPrefixCls', 'editable', 'errorBoundaryRender', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'formItemProps', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'headerTitle', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'maxLength', 'measureRowRender', 'name', 'onChange', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSizeChange', 'onSubmit', 'onTableChange', 'onValuesChange', 'options', 'optionsRender', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'recordCreatorProps', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'search', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableAlertOptionRender', 'tableAlertRender', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableStyle', 'tableViewRender', 'tailor', 'title', 'toolBarRender', 'toolbar', 'tooltip', 'type', 'value', 'virtual'],
})
const EditableProTable = _EditableProTable as typeof _EditableProTable & Plugin & {
  RecordCreator: typeof RecordCreator
}
EditableProTable.RecordCreator = RecordCreator
EditableProTable.install = (app: App) => {
  app.component(EditableProTable.name!, EditableProTable)
  app.component(RecordCreator.displayName!, RecordCreator)
  return app
}
export default EditableProTable
