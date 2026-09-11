import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { AutoCompleteProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import { useIntl } from '@antdv-next1/pro-provider'
import { AutoComplete } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useFieldFetchData } from '../Select'

export type FieldAutoCompleteProps = ProFieldFC<{
  text?: VueNode
  emptyText?: VueNode
  placeholder?: string
  prefixCls?: string
  variant?: 'outlined' | 'borderless' | 'filled'
}, AutoCompleteProps & { class?: string, style?: CSSProperties }> & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'text' | 'light' | 'plain'>

export interface FieldAutoCompleteRef {
  fetchData: (keyWord: string) => void
}

const FieldAutoComplete = defineComponent<FieldAutoCompleteProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-field-autoComplete`)
  const [, options, fetchData] = useFieldFetchData(props)

  const inputRef = shallowRef<null>(null)
  const intl = useIntl()
  expose({
    fetchData,
  } as FieldAutoCompleteRef)
  return () => {
    const { mode, emptyText = '-', formItemRender, placeholder: propsPlaceholder, render, text, fieldProps, ...rest } = props
    const { prefix = '', suffix = '' } = fieldProps || {}
    if (mode === 'read') {
      const dom = (
        <>
          {prefix}
          {text ?? emptyText}
          {suffix}
        </>
      )
      if (render) {
        return <>{ render(text, { mode, ...rest, fieldProps }, dom) ?? emptyText}</>
      }
      return dom
    }
    if (mode === 'edit' || mode === 'update') {
      const placeholder = propsPlaceholder || intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' })
      const { autoFocus, ...restFieldProps } = fieldProps!
      const dom = (
        <AutoComplete
          ref={inputRef}
          placeholder={placeholder}
          allowClear
          {...restFieldProps}
          class={baseClassName.value}
          options={options.value! as AutoCompleteProps['options']}
        />
      )
      if (formItemRender) {
        return <>{formItemRender(text, { mode, ...rest, fieldProps, placeholder }, dom)}</>
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldAutoComplete',
  inheritAttrs: false,
})

export default FieldAutoComplete
