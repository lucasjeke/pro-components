import type { ProFieldFCMode } from '@antdv-next1/pro-provider'
import type { ProSchema, ProSchemaComponentTypes } from '@antdv-next1/pro-utils'
import type { VueNode } from '@v-c/util/dist/type'
import type { DescriptionsItemProps } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { CSSProperties, SlotsType } from 'vue'
import { DescriptionsItem } from 'antdv-next'
import { defineComponent } from 'vue'

export type ProDescriptionsItemProps<
  T = any,
  ValueType = 'text',
> = Omit<DescriptionsItemProps, 'content'> & {
  key?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['key']
  dataIndex?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['dataIndex']
  title?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['title']
  tooltip?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['tooltip']
  valueEnum?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['valueEnum']
  formItemProps?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['formItemProps']
  renderText?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['renderText']
  render?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['render']
  formItemRender?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['formItemRender']
  editable?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['editable']
  request?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['request']
  debounceTime?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['debounceTime']
  params?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['params']
  dependencies?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['dependencies']
  ignoreFormItem?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['ignoreFormItem']
  hideInDescriptions?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['hideInDescriptions']
  hideInForm?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['hideInForm']
  hideInTable?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['hideInTable']
  proFieldProps?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['proFieldProps']
  valueType?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['valueType']
  fieldProps?: ProSchema<T, DescriptionsItemProps, ProSchemaComponentTypes, ValueType>['fieldProps']
  content?: VueNode
  // 隐藏这个字段，是个语法糖，方便一下权限的控制
  hide?: boolean
  plain?: boolean
  copyable?: boolean
  ellipsis?: boolean | { showTitle?: boolean }
  mode?: ProFieldFCMode
  /**
   * 子项的排序
   */
  order?: number
  /**
   * 子项的索引
   */
  index?: number
}

export interface ProDescriptionsItemSlots {
  default?: () => VueNode
  content?: () => VueNode
  label?: () => VueNode
}

const ProDescriptionsItem = defineComponent<ProDescriptionsItemProps, {}, string, SlotsType<ProDescriptionsItemSlots>>((props, { attrs, slots, expose }) => {
  expose({})
  return () => {
    const { content, ...rest } = props
    return (
      <DescriptionsItem
        {...attrs}
        class={attrs.class as string}
        style={attrs.style as CSSProperties}
        {...{
          label: rest.label,
          classes: rest.classes,
          styles: rest.styles,
          span: rest.span,
          content: content as AntVueNode,
        }}
        v-slots={slots}
      />
    )
  }
}, {
  name: 'ProDescriptionsItem',
  inheritAttrs: false,
  props: ['classes', 'content', 'copyable', 'dataIndex', 'debounceTime', 'dependencies', 'editable', 'ellipsis', 'fieldProps', 'formItemProps', 'formItemRender', 'hide', 'hideInDescriptions', 'hideInForm', 'hideInTable', 'ignoreFormItem', 'index', 'key', 'label', 'mode', 'order', 'params', 'plain', 'prefixCls', 'proFieldProps', 'render', 'renderText', 'request', 'rootClass', 'span', 'styles', 'title', 'tooltip', 'valueEnum', 'valueType'],
})
export default ProDescriptionsItem
