import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CascaderProps } from 'antdv-next'
import type { SetupContext } from 'vue'
import type {
  ProFormFieldItemProps,
  ProFormFieldRemoteProps,
} from '../../typing'
import { FieldCascader } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

export type ProFormCascaderProps<T extends Record<string, any>> = ProFormFieldItemProps<CascaderProps<T>> & ProFormFieldRemoteProps & {
  variant?: CascaderProps<T>['variant']
}

const ProFormCascader = defineComponent(
  <T extends Record<string, any>>(props: ProFormCascaderProps<T>, { slots, attrs }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const { getPopupContainer } = useFieldContextInject()
    return () => {
      const { fieldProps, request, params, proFieldProps, ...rest } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            cascader: {
              render: (text, restProps) => (
                <FieldCascader
                  {...restProps}
                  text={text}
                  placeholder={restProps.placeholder as string}
                />
              ),
              formItemRender: (text, restProps) => (
                <FieldCascader
                  {...restProps}
                  text={text}
                  placeholder={restProps.placeholder as string}
                />
              ),
            },
          }}
        >
          <ProFormField
            {...attrs}
            {...rest}
            valueType="cascader"
            fieldProps={{
              getPopupContainer: getPopupContainer?.value,
              ...fieldProps,
            }}
            request={request}
            params={params}
            fieldConfig={
              rest.fieldConfig || {
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
    name: 'ProFormCascader',
    inheritAttrs: false,
    props: ['_internalItemRender', 'addonAfter', 'addonBefore', 'addonWarpStyle', 'allowClear', 'bordered', 'colProps', 'colSize', 'colon', 'convertValue', 'dataFormat', 'debounceTime', 'dependencies', 'disabled', 'emptyText', 'extra', 'fieldConfig', 'fieldId', 'fieldProps', 'footerRender', 'formItemProps', 'getValueFromEvent', 'getValueProps', 'hasFeedback', 'help', 'hidden', 'htmlFor', 'id', 'ignoreFormItem', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'layout', 'lightProps', 'messageVariables', 'mode', 'name', 'noStyle', 'params', 'placeholder', 'prefixCls', 'proFieldProps', 'proFormFieldKey', 'readonly', 'record', 'request', 'required', 'rootClass', 'rules', 'secondary', 'status', 'tooltip', 'transform', 'trigger', 'validateDebounce', 'validateFirst', 'validateStatus', 'validateTrigger', 'variant', 'valueEnum', 'valuePropName', 'vertical', 'width', 'wrapperCol'],
  },
)
export default ProFormCascader
