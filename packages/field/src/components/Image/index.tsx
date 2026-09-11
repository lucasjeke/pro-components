import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ImageProps, InputProps, InputRef } from 'antdv-next'
import type { ProFieldFC } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { Image, Input } from 'antdv-next'
import { defineComponent, shallowRef } from 'vue'

export type FieldImageProps = ProFieldFC<{
  text: string
  width?: number
  placeholder?: string
}, ImageProps | InputProps>

const FieldImage = defineComponent<FieldImageProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { expose }) => {
    const imageRef = shallowRef<InstanceType<typeof Image> | InputRef | null>(null)
    const intl = useIntl()
    expose({})
    return () => {
      const { text, mode: type, render, formItemRender, placeholder, width, ...rest } = props

      if (type === 'read') {
        const dom = (
          <Image ref={imageRef} width={width || 32} src={text} {...rest.fieldProps as ImageProps} />
        )
        if (render) {
          return <>{render(text, { mode: type, ...rest }, dom)}</>
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        const placeholderValue
          = placeholder || intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' })
        const dom = (
          <Input ref={imageRef} placeholder={placeholderValue} {...rest.fieldProps as InputProps} />
        )
        if (formItemRender) {
          return <>{formItemRender(text, { mode: type, ...rest, placeholder: placeholderValue }, dom)}</>
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldImage',
    inheritAttrs: false,
  },
)
export default FieldImage
