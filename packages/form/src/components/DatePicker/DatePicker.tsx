import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { DatePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDatePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'
import ProFormDateMonthPicker from './MonthPicker'
import ProFormDateQuarterPicker from './QuarterPicker'
import ProFormDateWeekPicker from './WeekPicker'
import ProFormDateYearPicker from './YearPicker'

const valueType = 'date' as const

export type ProFormDatePickerProps = ProFormFieldItemProps<DatePickerProps>

const _ProFormDatePicker = defineComponent<ProFormDatePickerProps, {}, string, CustomSlotsType<{
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
  name: 'ProFormDatePicker',
  inheritAttrs: false,

})
const ProFormDatePicker = _ProFormDatePicker as typeof _ProFormDatePicker & {
  Week: typeof ProFormDateWeekPicker
  Month: typeof ProFormDateMonthPicker
  Year: typeof ProFormDateYearPicker
  Quarter: typeof ProFormDateQuarterPicker
}
ProFormDatePicker.Week = ProFormDateWeekPicker
ProFormDatePicker.Month = ProFormDateMonthPicker
ProFormDatePicker.Year = ProFormDateYearPicker
ProFormDatePicker.Quarter = ProFormDateQuarterPicker

// 标记是否是 ProForm 的组件
// ProFormDatePicker.__PRO_FORM_COMPONENT = true

export default ProFormDatePicker
