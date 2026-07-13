import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { DatePickerProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldDatePicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'

const valueType = 'dateTime' as const

export type ProFormDateTimePickerProps = ProFormFieldItemProps<DatePickerProps>

const _ProFormDateTimePicker = defineComponent<ProFormDateTimePickerProps, {}, string, CustomSlotsType<{
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
            showTime: true,
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
  name: 'ProFormDateTimePicker',
  inheritAttrs: false,

})
const ProFormDateTimePicker = _ProFormDateTimePicker as typeof _ProFormDateTimePicker & {
  __PRO_FORM_COMPONENT: boolean
}

// 标记是否是 ProForm 的组件
ProFormDateTimePicker.__PRO_FORM_COMPONENT = true

export default ProFormDateTimePicker
