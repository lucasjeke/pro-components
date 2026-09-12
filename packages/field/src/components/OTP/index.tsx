import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputOTPProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { InputOTP } from 'antdv-next'
import { defineComponent } from 'vue'

export type FieldOTPProps = ProFieldFC<{
  text?: VueNode
  emptyText?: VueNode
  placeholder?: string
}, InputOTPProps & { class?: string, style?: CSSProperties }>

const FieldOTP = defineComponent<FieldOTPProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose }) => {
  const intl = useIntl()
  expose({})
  return () => {
    const { mode, formItemRender, placeholder: propsPlaceholder, text, fieldProps, ...rest } = props
    if (mode === 'edit' || mode === 'update') {
      const placeholder = propsPlaceholder || intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' })
      const { autoFocus, ...restFieldProps } = fieldProps!
      const dom = (
        <InputOTP placeholder={placeholder} {...restFieldProps} />
      )
      if (formItemRender) {
        return <>{formItemRender(text, { mode, ...rest, fieldProps }, dom)}</>
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldOTP',
  inheritAttrs: false,
})

export default FieldOTP
