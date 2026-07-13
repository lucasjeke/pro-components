import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { MonthPickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDatePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

const valueType = 'dateMonth' as const

export type ProFormDateMonthPickerProps = ProFormFieldItemProps<MonthPickerProps>

const ProFormDateMonthPicker = defineComponent<ProFormDateMonthPickerProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  const { getPopupContainer } = useFieldContextInject()
  return () => {
    const { proFieldProps, fieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          [valueType]: {
            render: (text, restProps) => <FieldDatePicker {...restProps} text={text} />,
            formItemRender: (text, restProps) => <FieldDatePicker {...restProps} text={text} />,
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType={valueType}
          fieldProps={{
            getPopupContainer: getPopupContainer?.value,
            ...fieldProps,
          }}
          proFieldProps={proFieldProps}
          fieldConfig={
            rest.fieldConfig || {
              valueType,
              customLightMode: true,
            }
          }
          v-slots={slots}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormDateMonthPicker',
  inheritAttrs: false,
})
export default ProFormDateMonthPicker
