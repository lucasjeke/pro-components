import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputOTPProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import { InputOTP } from 'antdv-next'
import { defineComponent } from 'vue'

export type FieldOTPProps = ProFieldFC<{
  text?: VueNode
  emptyText?: VueNode
}, InputOTPProps & { class?: string, style?: CSSProperties }>

const FieldOTP = defineComponent<FieldOTPProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose }) => {
  expose({})
  return () => {
    const { mode, formItemRender, text, fieldProps, ...rest } = props
    if (mode === 'edit' || mode === 'update') {
      const dom = (
        <InputOTP />
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
