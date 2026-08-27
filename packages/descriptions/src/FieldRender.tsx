import type { Key, ProCoreActionType, ProFieldValueObjectType, ProFieldValueType, ProSchemaValueEnumMap, ProSchemaValueEnumObj, UseEditableMapUtilType, VueNode } from '@antdv-next1/pro-utils'
import type { FormInstance } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { CSSProperties } from 'vue'
import type { ProDescriptionsItemProps } from './Item'
import ProField from '@antdv-next1/pro-field'
import ProForm, { ProFormField } from '@antdv-next1/pro-form'
import { proTheme } from '@antdv-next1/pro-provider'
import { getFieldPropsOrFormItemProps, InlineErrorFormItem } from '@antdv-next1/pro-utils'
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
import { computed, defineComponent } from 'vue'

export type FieldRenderProps<T extends Record<string, any>, ValueType = 'text'> = ProDescriptionsItemProps<T, ValueType> & {
  text: any
  valueType: ProFieldValueType
  entity: any
  action: ProCoreActionType<T, any>
  index: number
  editableUtils?: UseEditableMapUtilType
  emptyText?: VueNode
}

const FieldRender = defineComponent(<RecordType extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: FieldRenderProps<RecordType, ValueType>) => {
  const form = ProForm.useFormInstance()
  const { token } = proTheme.useToken?.()
  const fieldConfig = computed(() => {
    const resolvedParams = typeof props.params === 'function'
      ? props.params(props.entity as RecordType, props as any)
      : props.params
    const proFieldRender = props.render
      ? (finText: string) => {
          return props.render?.(finText, props.entity, props.index, props.action, {
            ...props,
            content: props.content as AntVueNode,
            type: 'descriptions',
          })
        }
      : props.proFieldProps?.render

    return {
      text: props.text,
      valueEnum: typeof props.valueEnum === 'function'
        ? props.valueEnum(props.entity as RecordType)
        : props.valueEnum,
      mode: props.mode || 'read',
      proFieldProps: {
        ...props.proFieldProps,
        emptyText: props.emptyText ?? props.proFieldProps?.emptyText,
        render: proFieldRender,
      },
      ignoreFormItem: true,
      valueType: props.valueType,
      request: props.request
        ? (requestParams: Record<string, any>, requestProps: Record<string, any>) => props.request!(
            { ...resolvedParams, ...requestParams },
            requestProps,
          )
        : undefined,
      debounceTime: props.debounceTime,
      params: resolvedParams,
      plain: props.plain,
    }
  })
  const renderDom = () => {
    const { dataIndex, text } = props
    const formItemProps = getFieldPropsOrFormItemProps(
      props.formItemProps,
      form as FormInstance,
      {
        ...props,
        rowKey: dataIndex,
        isEditable: true,
      },
    )
    const fieldProps = getFieldPropsOrFormItemProps(
      props.fieldProps,
      form as FormInstance,
      {
        ...props,
        rowKey: dataIndex,
        isEditable: true,
      },
    )

    return (
      <div
        style={{ display: 'flex', gap: `${token.value.marginXS}px`, alignItems: 'baseline' }}
      >
        <InlineErrorFormItem
          name={dataIndex}
          {...formItemProps}
          {...({
            style: {
              margin: 0,
              ...(formItemProps?.style || {}) as CSSProperties,
            },
          })}
          initialValue={text ?? formItemProps?.initialValue}
        >
          <ProFormField
            {...fieldConfig.value}
            proFieldProps={{ ...fieldConfig.value.proFieldProps }}
            formItemRender={
              props.formItemRender
                ? () =>
                    props.formItemRender?.(
                      {
                        ...props,
                        content: props.content as AntVueNode,
                        type: 'descriptions',
                      },
                      {
                        isEditable: true,
                        recordKey: dataIndex as Key,
                        record: form.getFieldValue(
                          [dataIndex].flat(1) as (string | number)[],
                        ),
                        defaultRender: () => (
                          <ProFormField
                            {...fieldConfig.value}
                            fieldProps={fieldProps}
                          />
                        ),
                        type: 'descriptions',
                      },
                      form as FormInstance,
                    )
                : undefined
            }
            fieldProps={fieldProps}
          />
        </InlineErrorFormItem>
        <div
          style={{
            display: 'flex',
            maxHeight: `${token.value.controlHeight}px`,
            alignItems: 'center',
            gap: `${token.value.marginXS}px`,
          }}
        >
          {props.editableUtils?.actionRender?.((dataIndex ?? props.index) as Key, {
            cancelText: <CloseOutlined />,
            saveText: <CheckOutlined />,
            deleteText: false,
          })}
        </div>
      </div>
    ) as VueNode
  }

  return () => {
    const { mode, valueType, dataIndex } = props
    /** 如果是只读模式，fieldProps 的 form是空的，所以需要兜底处理 */
    if (mode === 'read' || !mode || valueType === 'option') {
      const fieldProps = getFieldPropsOrFormItemProps(
        props.fieldProps,
        undefined,
        {
          ...props,
          rowKey: dataIndex,
          isEditable: false,
        },
      )
      return (
        <ProField
          {...fieldConfig.value.proFieldProps}
          text={fieldConfig.value.text}
          mode="read"
          valueType={fieldConfig.value.valueType}
          valueEnum={fieldConfig.value.valueEnum as ProSchemaValueEnumObj | ProSchemaValueEnumMap}
          request={fieldConfig.value.request}
          fieldProps={{
            ...fieldProps,
            debounceTime: fieldConfig.value.debounceTime ?? fieldProps?.debounceTime,
          }}
        />
      )
    }
    return (
      <div
        style={{
          marginTop: '-5px',
          marginBottom: '-5px',
          marginLeft: 0,
          marginRight: 0,
          width: '100%',
        }}
      >
        {renderDom()}
      </div>
    )
  }
}, {
  name: 'FieldRender',
  inheritAttrs: false,
  props: ['action', 'classes', 'content', 'copyable', 'dataIndex', 'debounceTime', 'dependencies', 'editable', 'editableUtils', 'ellipsis', 'emptyText', 'entity', 'fieldProps', 'formItemProps', 'formItemRender', 'hide', 'hideInDescriptions', 'hideInForm', 'hideInTable', 'ignoreFormItem', 'index', 'label', 'mode', 'order', 'params', 'plain', 'prefixCls', 'proFieldProps', 'render', 'renderText', 'request', 'rootClass', 'span', 'styles', 'text', 'title', 'tooltip', 'valueEnum', 'valueType'],
})
export default FieldRender
