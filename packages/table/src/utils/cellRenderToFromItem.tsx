import type { ProFieldEmptyText } from '@antdv-next1/pro-field'
import type { ProFormFieldProps } from '@antdv-next1/pro-form'
import type { ProFieldValueObjectType, ProFieldValueType, ProSchemaComponentTypes, UseEditableUtilType } from '@antdv-next1/pro-utils'
import type { AnyObject, CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { SetupContext } from 'vue'
import type { ContainerReturnType } from '../Store/Provide'
import type { ProColumnType } from '../typing'
import { ProForm, ProFormField, useFieldContextInject } from '@antdv-next1/pro-form'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  FormItem,
  getFieldPropsOrFormItemProps,
  InlineErrorFormItem,
  runFunction,
} from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'

const SHOW_EMPTY_TEXT_LIST = ['', null, undefined]

interface CellRenderFromItemProps<T extends AnyObject, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> {
  text: VueNode
  valueType: ProColumnType<T, ValueType>['valueType']
  index: number
  rowData?: T
  columnEmptyText?: ProFieldEmptyText
  columnProps?: ProColumnType<T, ValueType> & {
    entity: T
  }
  type?: ProSchemaComponentTypes
  // 行的唯一 key
  recordKey?: Key
  mode: 'edit' | 'read'
  /**
   * If there is, use EditableTable in the Form
   */
  prefixName?: NamePath<string | number | boolean>
  counter?: ContainerReturnType<T, U, ValueType>
  proFieldProps?: ProFormFieldProps
  subName?: string[]
  editableUtils?: UseEditableUtilType<T>
}

/**
 * 拼接用于编辑的 key
 */
export function spellNamePath(...rest: any[]): Key[] {
  return rest
    .filter(index => index !== undefined)
    .map((item) => {
      if (typeof item === 'number') {
        return item.toString()
      }
      return item
    })
    .flat(1)
}
const CellRenderFromItem = defineComponent(<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: CellRenderFromItemProps<T, U, ValueType>, { expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const intl = useIntl()
  const formContext = useFieldContextInject()
  const editableForm = ProForm.useFormInstance()
  expose({})
  return () => {
    const {
      columnProps,
      prefixName,
      text,
      counter,
      rowData,
      index,
      recordKey,
      subName,
      proFieldProps,
      editableUtils,
    } = props
    const key = recordKey || index
    const realIndex = editableUtils?.getRealIndex?.(rowData!) ?? index
    const formItemName = spellNamePath(
      prefixName,
      prefixName ? subName : [],
      prefixName ? realIndex : key,
      columnProps?.key ?? columnProps?.dataIndex ?? index,
    )
    const rowName = formItemName.slice(0, -1)

    const needProps = [
      editableForm,
      {
        ...columnProps,
        rowKey: rowName,
        rowIndex: index,
        isEditable: true,
      },
    ] as const

    const generateFormItem = () => {
      const formItemProps = {
        ...getFieldPropsOrFormItemProps(columnProps?.formItemProps, ...needProps),
      }
      formItemProps.messageVariables = {
        label: (columnProps?.title as string) || intl.value.getMessage({ id: 'editableTable.defaultFieldLabel', defaultMessage: '此项' }),
        type: (columnProps?.valueType as string) || intl.value.getMessage({ id: 'editableTable.defaultFieldType', defaultMessage: '文本' }),
        ...formItemProps?.messageVariables,
      }
      formItemProps.initialValue
        = (prefixName ? null : text)
          ?? formItemProps?.initialValue
          ?? columnProps?.initialValue
      let fieldDom: VueNode = (
        <ProFormField
          key={formItemName.join('-')}
          name={formItemName}
          proFormFieldKey={key}
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
            ...getFieldPropsOrFormItemProps(columnProps?.fieldProps, ...needProps),
          }}
          {...proFieldProps}
        />
      )
      /**
       * 如果没有自定义直接返回
       */
      if (columnProps?.formItemRender) {
        fieldDom = columnProps.formItemRender(
          {
            ...columnProps,
            index,
            isEditable: true,
            type: 'table',
          },
          {
            defaultRender: () => <>{fieldDom}</>,
            type: 'form',
            recordKey,
            record: {
              ...rowData,
              ...editableForm?.getFieldsValue([key]),
            } as T,
            isEditable: true,
          },
          editableForm!,
          props.editableUtils,
        )
        // 如果需要完全自定义可以不要name
        if (columnProps.ignoreFormItem)
          return <>{fieldDom}</>
      }
      return (
        <InlineErrorFormItem
          key={formItemName.join('-')}
          {...formItemProps}
          errorType="popover"
          popoverProps={{
            getPopupContainer:
            formContext.getPopupContainer?.value! as () => HTMLElement
            || (() => counter?.rootDomRef?.value! || document.body),
          }}
          name={formItemName}
        >
          {fieldDom}
        </InlineErrorFormItem>
      )
    }
    if (formItemName.length === 0)
      return null
    if (
      typeof columnProps?.formItemRender === 'function'
      || typeof columnProps?.fieldProps === 'function'
      || typeof columnProps?.formItemProps === 'function'
    ) {
      return <FormItem noStyle>{() => generateFormItem()}</FormItem>
    }
    return generateFormItem()
  }
}, {
  name: 'CellRenderFromItem',
  inheritAttrs: false,
  props: ['columnEmptyText', 'columnProps', 'counter', 'editableUtils', 'index', 'mode', 'mode', 'prefixName', 'proFieldProps', 'recordKey', 'rowData', 'subName', 'text', 'type', 'valueType'],
})

/**
 * 根据不同的类型来转化数值
 *
 * @param config
 */
function cellRenderToFromItem<T extends AnyObject, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(config: CellRenderFromItemProps<T, U, ValueType>) {
  const { text, valueType, rowData, columnProps, index } = config
  // 如果 valueType === text ，没必要多走一次 render
  if (
    (!valueType || ['textarea', 'text'].includes(valueType.toString()))
    // valueEnum 存在说明是个select
    && !columnProps?.valueEnum
    && config.mode === 'read'
  ) {
    // 如果是''、null、undefined 显示columnEmptyText
    return SHOW_EMPTY_TEXT_LIST.includes(text as string) ? config.columnEmptyText! : text
  }

  if (typeof valueType === 'function' && rowData) {
    // 防止valueType是函数,并且text是''、null、undefined跳过显式设置的columnEmptyText
    return cellRenderToFromItem({
      ...config,
      valueType: valueType(rowData, config.type) || 'text',
    })
  }

  const columnKey = columnProps?.key || columnProps?.dataIndex?.toString()

  const dependencies = columnProps?.dependencies
    ? ([
        config.prefixName,
        config.prefixName ? index?.toString() : config.recordKey?.toString(),
        columnProps?.dependencies,
      ]
        .filter(Boolean)
        .flat(1))
    : []

  /**
   * 生成公用的 proField dom 配置
   */
  const proFieldProps: ProFormFieldProps = {
    valueEnum: runFunction<[T | undefined]>(columnProps?.valueEnum, rowData),
    request: columnProps?.request,
    dependencies: columnProps?.dependencies ? [dependencies] as NamePath<string | number | boolean>[] : undefined,
    originDependencies: columnProps?.dependencies
      ? [columnProps?.dependencies] as NamePath<string | number | boolean>[]
      : undefined,
    params: runFunction(columnProps?.params, rowData, columnProps),
    readonly: columnProps?.readonly,
    text: valueType === 'index' || valueType === 'indexBorder' ? index : text,
    mode: config.mode,
    formItemRender: undefined,
    valueType,
    record: rowData,
    proFieldProps: {
      emptyText: config.columnEmptyText,
      proFieldKey: columnKey ? `table-field-${columnKey}` : undefined,
    },
  }
  /** 只读模式直接返回就好了，不需要处理 formItem */
  if (config.mode !== 'edit') {
    return (
      <ProFormField
        mode="read"
        ignoreFormItem
        fieldProps={getFieldPropsOrFormItemProps(columnProps?.fieldProps, null, columnProps)}
        {...proFieldProps}
      />
    )
  }

  return (
    <CellRenderFromItem<T, U, ValueType>
      key={config.recordKey}
      {...config}
      proFieldProps={proFieldProps}
    />
  )
}
export default cellRenderToFromItem
