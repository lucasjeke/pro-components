import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CheckboxGroupProps } from 'antdv-next'
import type { ProFormFieldItemProps, ProFormFieldRemoteProps } from '../../typing'
import { FieldCheckbox } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { runFunction } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormCheckboxGroupProps = ProFormFieldItemProps<
  CheckboxGroupProps
> & {
  layout?: 'horizontal' | 'vertical'
  options?: CheckboxGroupProps['options']
  debounceTime?: ProFormFieldRemoteProps['debounceTime']
  request?: ProFormFieldRemoteProps['request']
  valueEnum?: ProFormFieldRemoteProps['valueEnum']
  params?: ProFormFieldRemoteProps['params']
}

const ProFormCheckboxGroup = defineComponent<ProFormCheckboxGroupProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  return () => {
    const { options, fieldProps, proFieldProps, valueEnum, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          checkbox: {
            render: (text, restProps) => <FieldCheckbox {...restProps} text={text} />,
            formItemRender: (text, restProps) => <FieldCheckbox {...restProps} text={text} />,
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="checkbox"
          valueEnum={runFunction<[any]>(valueEnum, undefined)}
          fieldProps={{
            ...fieldProps,
            options: fieldProps?.options || options,
          }}
          lightProps={{
            ...rest.lightProps,
            labelFormatter: rest.lightProps?.labelFormatter || (() => (
              <ProFormField
                {...rest}
                valueType="checkbox"
                mode="read"
                valueEnum={runFunction<[any]>(valueEnum, undefined)}
                fieldConfig={
                  rest.fieldConfig || {
                    customLightMode: true,
                  }
                }
                fieldProps={{
                  ...fieldProps,
                  options: fieldProps?.options || options,
                }}
                proFieldProps={proFieldProps}
              />
            )),
          }}
          proFieldProps={proFieldProps}
          v-slots={slots}
        />
      </ProConfigProvider>

    )
  }
}, {
  name: 'ProFormCheckboxGroup',
  inheritAttrs: false,
})

export default ProFormCheckboxGroup
