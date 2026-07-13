import type { RangePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDateRangePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { dateArrayFormatter } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

const valueType = 'dateWeekRange' as const

export type ProFormDateWeekRangePickerProps = ProFormFieldItemProps<RangePickerProps>

const ProFormDateWeekRangePicker = defineComponent<ProFormDateWeekRangePickerProps>(
  (props, { attrs, expose }) => {
    const { getPopupContainer } = useFieldContextInject()
    expose({})
    return () => {
      const { fieldProps, proFieldProps, ...rest } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            [valueType]: {
              render: (text, restProps) => (
                <FieldDateRangePicker {...restProps} text={text} />
              ),
              formItemRender: (text, restProps) => (
                <FieldDateRangePicker {...restProps} text={text} />
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
                  dateArrayFormatter(value, fieldProps?.format || 'YYYY-wo'),
              } as const
            }
          />
        </ProConfigProvider>
      )
    }
  },
  {
    name: 'ProFormDateWeekRangePicker',
    inheritAttrs: false,
  },
)

export default ProFormDateWeekRangePicker
