import type { ProFieldEmptyText } from '@antdv-next1/pro-field'
import type {
  ProFieldValueObjectType,
  ProFieldValueType,
  ProSchemaComponentTypes,
  ProTableEditableFnType,
  UseEditableUtilType,
} from '@antdv-next1/pro-utils'
import type { AnyObject, CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ContainerReturnType } from '../Store/Provide'
import type { ProColumns } from '../typing'
import { genCopyable, isNil, LabelIconTip } from '@antdv-next1/pro-utils'
import get from '@v-c/util/dist/utils/get'
import { Divider, Flex, Space } from 'antdv-next'
import { defineComponent, isVNode } from 'vue'
import cellRenderToFromItem from './cellRenderToFromItem'

/** 转化列的定义 */
interface ColumnRenderInterface<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> {
  columnProps: ProColumns<T, ValueType>
  text: VueNode
  rowData: T
  index: number
  columnEmptyText?: ProFieldEmptyText
  type: ProSchemaComponentTypes
  counter?: ContainerReturnType<T, U, ValueType>
  editableUtils?: UseEditableUtilType<T>
  subName?: string[]
  marginSM?: number
}

export function isMergeCell(dom: VueNode) {
  return dom && isVNode(dom) && dom?.props?.colSpan
}

/**
 * 增加了 icon 的功能 render title
 *
 * @param item
 */
export function renderColumnsTitle<T extends Record<string, any>, P extends (ProFieldValueType | ProFieldValueObjectType)>(item: ProColumns<T, P>) {
  const { title } = item
  const ellipsis = typeof item?.ellipsis === 'boolean' ? item?.ellipsis : item?.ellipsis?.showTitle
  if (title && typeof title === 'function') {
    return <>{title(item, 'table', <LabelIconTip label={null} tooltip={item.tooltip} />)}</>
  }
  return <LabelIconTip label={title} tooltip={item.tooltip} ellipsis={ellipsis} />
}

/** 判断是否为不可编辑的单元格 */
function isNotEditableCell<T extends Record<string, any>>(
  text: VueNode,
  record: T,
  index: number,
  editable?: ProTableEditableFnType<T> | boolean,
) {
  if (typeof editable === 'boolean') {
    return !editable
  }
  return editable?.(text, record, index) === false
}

/**
 * 默认的 filter 方法
 *
 * @param value
 * @param record
 * @param dataIndex
 */
export function defaultOnFilter(value: string, record: any, dataIndex: string | string[]) {
  const recordElement = Array.isArray(dataIndex)
    ? get(record, dataIndex as string[])
    : record[dataIndex]
  const itemValue = String(recordElement) as string

  return String(itemValue) === String(value)
}

interface EditableOptionActionsProps<T, ValueType> {
  editableUtils?: UseEditableUtilType<T>
  rowData?: T
  index: number
  type: ProSchemaComponentTypes
  marginSM?: number
  columnProps?: ProColumns<T, ValueType>
}

const EditableOptionActions = defineComponent(<T extends AnyObject, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: EditableOptionActionsProps<T, ValueType>, { expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  expose({})
  return () => {
    const { editableUtils, rowData, index, columnProps, marginSM, type } = props
    const actions = editableUtils?.actionRender?.({
      ...rowData!,
      index,
    })
    if (!actions) {
      return null
    }
    return type === 'table' ? (
      <Space align="center" size={0} separator={<Divider orientation="vertical" />}>
        {actions}
      </Space>
    ) : (<Flex align="center" gap={marginSM} justify={columnProps?.align === 'center' ? 'center' : 'flex-start'}>{actions}</Flex>)
  }
}, {
  name: 'EditableOptionActions',
  inheritAttrs: false,
  props: ['editableUtils', 'rowData', 'index', 'columnProps', 'type', 'marginSM'],
})

/**
 * 这个组件负责单元格的具体渲染
 *
 */
function columnRender<T extends AnyObject, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>({
  columnProps,
  text,
  rowData,
  index,
  columnEmptyText,
  counter,
  type,
  marginSM,
  subName,
  editableUtils,
}: ColumnRenderInterface<T, U, ValueType>) {
  const { action, prefixName } = counter!
  const { isEditable, recordKey } = editableUtils?.isEditable?.({
    ...rowData,
    index,
  })!
  const { renderText = (val: VueNode) => val } = columnProps
  const renderTextStr = renderText(text, rowData, index, action?.value)
  const mode = isEditable && !isNotEditableCell(text, rowData, index, columnProps?.editable) ? 'edit' : 'read'

  const textDom = cellRenderToFromItem<T, U, ValueType>({
    text: renderTextStr,
    valueType: (columnProps.valueType as ProFieldValueType) || 'text',
    index,
    rowData,
    subName,
    columnProps: {
      ...columnProps,
      entity: rowData,
    },
    counter,
    columnEmptyText,
    type,
    recordKey,
    mode,
    prefixName: prefixName?.value,
    editableUtils,
  })
  const dom = mode === 'edit' ? textDom : genCopyable(textDom, columnProps, renderTextStr, text)

  /** 如果是编辑模式，并且 renderFormItem 存在直接走 renderFormItem */
  if (mode === 'edit') {
    if (columnProps.valueType === 'option') {
      return <EditableOptionActions type={type} marginSM={marginSM} columnProps={columnProps} editableUtils={editableUtils} rowData={rowData} index={columnProps.index || index} />
    }
    return dom
  }

  if (!columnProps.render) {
    const isVueRenderNode = isVNode(dom) || ['string', 'number'].includes(typeof dom)
    return !isNil(dom) && isVueRenderNode ? dom : null
  }
  const renderDom = columnProps.render(
    dom,
    rowData,
    index,
    {
      ...action?.value,
      ...editableUtils,
    },
    {
      ...columnProps,
      isEditable,
      type: 'table',
    },
  )

  // 如果是合并单元格的，直接返回对象
  if (isMergeCell(renderDom)) {
    return renderDom
  }
  if (renderDom && columnProps.valueType === 'option' && Array.isArray(renderDom)) {
    return type === 'table' ? <Space align="center" size={0} separator={<Divider orientation="vertical" />}>{renderDom}</Space>
      : <Flex gap={8} align="center" justify="flex-start">{renderDom}</Flex>
  }
  return renderDom
}

export default columnRender
