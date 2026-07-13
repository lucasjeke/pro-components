import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputNumberProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDigitRange } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type Value = string | number | undefined

export type ValuePair = Value[]

export type RangeInputNumberProps = Omit<
  InputNumberProps,
  'value' | 'defaultValue' | 'onChange' | 'placeholder'
> & {
  value?: ValuePair
  defaultValue?: ValuePair
  onChange?: (value?: ValuePair) => void
}

export type ProFormDigitRangeProps
  = ProFormFieldItemProps<RangeInputNumberProps> & {
    separator?: string
    separatorWidth?: number
  }

const ProFormDigitRange = defineComponent<ProFormDigitRangeProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  return () => {
    const { fieldProps, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          digitRange: {
            render: (text, restProps) => (
              <FieldDigitRange
                {...restProps}
                text={text}
                placeholder={restProps.placeholder as string[]}
              />
            ),
            formItemRender: (text, restProps) => (
              <FieldDigitRange
                {...restProps}
                text={text}
                placeholder={restProps.placeholder as string[]}
              />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="digitRange"
          fieldProps={fieldProps}
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
  name: 'ProFormDigitRange',
  inheritAttrs: false,

})
export default ProFormDigitRange
