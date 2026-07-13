import type { TimeRangePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldTimeRangePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { dateArrayFormatter } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

const valueType = 'timeRange' as const

export type ProFormTimeRangePickerProps = ProFormFieldItemProps<TimeRangePickerProps>

const ProFormTimeRangePicker = defineComponent<ProFormTimeRangePickerProps>((props, { attrs, expose }) => {
  const { getPopupContainer } = useFieldContextInject()
  expose({})
  return () => {
    const { fieldProps, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          [valueType]: {
            render: (text, restProps) => (
              <FieldTimeRangePicker {...restProps} text={text} />
            ),
            formItemRender: (text, restProps) => (
              <FieldTimeRangePicker {...restProps} text={text} />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          fieldProps={{
            getPopupContainer: getPopupContainer?.value,
            ...fieldProps,
          }}
          valueType={valueType}
          proFieldProps={proFieldProps}
          fieldConfig={
            rest.fieldConfig || {
              valueType,
              customLightMode: true,
              lightFilterLabelFormatter: value =>
                dateArrayFormatter(value, fieldProps?.format || 'HH:mm:ss'),
            } as const
          }
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormTimeRangePicker',
  inheritAttrs: false,
})

export default ProFormTimeRangePicker
