import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { RadioGroupProps } from 'antdv-next'
import type {
  ProFormFieldItemProps,
  ProFormFieldRemoteProps,
} from '../../typing'
import { FieldRadio } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { runFunction } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormRadioGroupProps = ProFormFieldItemProps<
  RadioGroupProps
> & {
  layout?: 'horizontal' | 'vertical'
  radioType?: 'button' | 'radio'
  options?: RadioGroupProps['options']
  debounceTime?: ProFormFieldRemoteProps['debounceTime']
  request?: ProFormFieldRemoteProps['request']
  valueEnum?: ProFormFieldRemoteProps['valueEnum']
  params?: ProFormFieldRemoteProps['params']
}

const ProFormRadioGroup = defineComponent<ProFormRadioGroupProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  return () => {
    const { fieldProps, options, radioType, layout, proFieldProps, valueEnum, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          radio: {
            render: (text, restProps) => <FieldRadio {...restProps} text={text} />,
            formItemRender: (text, restProps) => (
              <FieldRadio {...restProps} text={text} />
            ),
          },
          radioButton: {
            render: (text, restProps) => {
              return <FieldRadio radioType="button" {...restProps} text={text} />
            },
            formItemRender: (text, restProps) => (
              <FieldRadio radioType="button" {...restProps} text={text} />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType={radioType === 'button' ? 'radioButton' : 'radio'}
          valueEnum={runFunction<[any]>(valueEnum, undefined)}
          fieldProps={{
            options,
            layout,
            ...fieldProps,
          }}
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
}, {
  name: 'ProFormRadioGroup',
  inheritAttrs: false,
})

export default ProFormRadioGroup
