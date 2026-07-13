import type { TimePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldTimePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'
import { ProFormTimeRangePicker } from '../RangePicker'

const valueType = 'time' as const

export type ProFormTimePickerProps = ProFormFieldItemProps<TimePickerProps>

const _ProFormTimePicker = defineComponent<ProFormTimePickerProps>((props) => {
  const { getPopupContainer } = useFieldContextInject()
  return () => {
    const { fieldProps, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          [valueType]: {
            render: (text, restProps) => <FieldTimePicker {...restProps} text={text} />,
            formItemRender: (text, restProps) => (
              <FieldTimePicker {...restProps} text={text} />
            ),
          },
        }}
      >
        <ProFormField
          fieldProps={{
            getPopupContainer: getPopupContainer?.value,
            ...fieldProps,
          }}
          valueType={valueType}
          proFieldProps={proFieldProps}
          fieldConfig={
            rest.fieldConfig || {
              customLightMode: true,
              valueType,
            } as const
          }
          {...rest}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormTimePicker',
  inheritAttrs: false,
})

const ProFormTimePicker = _ProFormTimePicker as typeof _ProFormTimePicker & {
  RangePicker: typeof ProFormTimeRangePicker
}

ProFormTimePicker.RangePicker = ProFormTimeRangePicker

export default ProFormTimePicker
