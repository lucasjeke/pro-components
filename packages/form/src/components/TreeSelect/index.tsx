import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { TreeSelectProps } from 'antdv-next'
import type { SetupContext } from 'vue'
import type {
  ProFormFieldItemProps,
  ProFormFieldRemoteProps,
} from '../../typing'
import { FieldTreeSelect } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormTreeSelectProps<T = any> = ProFormFieldItemProps<
  TreeSelectProps<T> & {
    /**
     * 当搜索关键词发生变化时是否请求远程数据
     *
     * @default true
     */
    fetchDataOnSearch?: boolean
  }
>
& ProFormFieldRemoteProps

const ProFormTreeSelect = defineComponent(
  <T extends Record<string, any>>(props: ProFormTreeSelectProps<T>, { slots, attrs }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    return () => {
      const { fieldProps, fieldConfig, proFieldProps, ...rest } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            treeSelect: {
              render: (text, restProps) => <FieldTreeSelect {...restProps} text={text} />,
              formItemRender: (text, restProps) => (
                <FieldTreeSelect {...restProps} text={text} />
              ),
            },
          }}
        >
          <ProFormField
            {...attrs}
            {...rest}
            valueType="treeSelect"
            fieldProps={fieldProps}
            fieldConfig={
              fieldConfig || {
                customLightMode: true,
              }
            }
            proFieldProps={proFieldProps}
            v-slots={slots}
          />
        </ProConfigProvider>

      )
    }
  },
  {
    name: 'ProFormTreeSelect',
    inheritAttrs: false,
    props: ['_internalItemRender', 'addonAfter', 'addonBefore', 'addonWarpStyle', 'allowClear', 'bordered', 'colProps', 'colSize', 'colon', 'convertValue', 'dataFormat', 'debounceTime', 'dependencies', 'disabled', 'emptyText', 'extra', 'fieldConfig', 'fieldId', 'fieldProps', 'footerRender', 'formItemProps', 'getValueFromEvent', 'getValueProps', 'hasFeedback', 'help', 'hidden', 'htmlFor', 'id', 'ignoreFormItem', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'layout', 'lightProps', 'messageVariables', 'mode', 'name', 'noStyle', 'params', 'placeholder', 'prefixCls', 'proFieldProps', 'proFormFieldKey', 'readonly', 'record', 'request', 'required', 'rootClass', 'rules', 'secondary', 'status', 'tooltip', 'transform', 'trigger', 'validateDebounce', 'validateFirst', 'validateStatus', 'validateTrigger', 'valueEnum', 'valuePropName', 'vertical', 'width', 'wrapperCol'],
  },
)
export default ProFormTreeSelect
