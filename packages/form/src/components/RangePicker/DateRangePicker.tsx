import type { RangePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDateRangePicker } from '@antdv-next1/pro-field'
import ProConfigProvider from '@antdv-next1/pro-provider'
import { dateArrayFormatter } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

export type ProFormDateRangePickerProps = ProFormFieldItemProps<RangePickerProps>

const valueType = 'dateRange' as const

const ProFormDateRangePicker = defineComponent<ProFormDateRangePickerProps>((props, { slots, attrs }) => {
  const { getPopupContainer } = useFieldContextInject()
  return () => {
    const { fieldProps, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          [valueType]: {
            render: (text, restProps) => <FieldDateRangePicker {...restProps} text={text} />,
            formItemRender: (text, restProps) => <FieldDateRangePicker {...restProps} text={text} />,
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
          fieldConfig={
            rest.fieldConfig || {
              valueType,
              customLightMode: true,
              lightFilterLabelFormatter: value =>
                dateArrayFormatter(value, fieldProps?.format || 'YYYY-MM-DD'),
            }
          }
          proFieldProps={proFieldProps}
          v-slots={slots}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormDateRangePicker',
  inheritAttrs: false,
})
export default ProFormDateRangePicker
