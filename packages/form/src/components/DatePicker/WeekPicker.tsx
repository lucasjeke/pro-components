import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { WeekPickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDatePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

const valueType = 'dateWeek' as const

export type ProFormDateWeekPickerProps = ProFormFieldItemProps<WeekPickerProps>

const ProFormDateWeekPicker = defineComponent<ProFormDateWeekPickerProps, {}, string, CustomSlotsType<{
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
  name: 'ProFormDateWeekPicker',
  inheritAttrs: false,
})
export default ProFormDateWeekPicker
