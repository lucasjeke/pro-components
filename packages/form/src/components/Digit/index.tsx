import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputNumberProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDigit } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormDigitProps = ProFormFieldItemProps<
  InputNumberProps
> & {
  min?: InputNumberProps['min']
  max?: InputNumberProps['max']
}
const ProFormDigit = defineComponent<ProFormDigitProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  return () => {
    const { fieldProps, max, min, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          digit: {
            render: (text, restProps) => (
              <FieldDigit
                {...restProps}
                text={text}
                placeholder={restProps.placeholder as string}
              />
            ),
            formItemRender: (text, restProps) => (
              <FieldDigit
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
          valueType="digit"
          fieldProps={{
            min,
            max,
            ...fieldProps,
          }}
          fieldConfig={
            rest.fieldConfig || {
              defaultProps: {
                width: '100%',
              },
            }
          }
          proFieldProps={proFieldProps}
          v-slots={slots}
        />
      </ProConfigProvider>

    )
  }
}, {
  name: 'ProFormDigit',
  inheritAttrs: false,

})
export default ProFormDigit
