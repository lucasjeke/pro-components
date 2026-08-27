import type { SlotsType } from 'vue'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { getAttrStyleAndClass } from 'antdv-next/dist/_util/hooks/index'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

export interface ProCardDividerProps {
  orientation?: 'horizontal' | 'vertical'
  type?: 'horizontal' | 'vertical'
}

export interface ProCardDividerEmits {
  [key: string]: (...args: any[]) => void
}

export interface ProCardDividerSlots {}

const ProCardDivider = defineComponent<
  ProCardDividerProps,
  ProCardDividerEmits,
  string,
  SlotsType<ProCardDividerSlots>
>((props, { attrs, expose }) => {
  const config = useConfig()
  const baseClassName = computed(() => `${config.value.getPrefixCls('pro')}-card`)
  const [hashId, cssVarCls] = useStyle(baseClassName)

  expose({})
  return () => {
    const { className, restAttrs, style } = getAttrStyleAndClass(attrs)
    const dividerClassName = `${baseClassName.value}-divider`
    const orientation = props.orientation ?? props.type

    return (
      <div
        {...restAttrs}
        class={classNames(dividerClassName, hashId.value, cssVarCls.value, {
          [`${dividerClassName}-horizontal`]: orientation === 'horizontal',
        }, className)}
        style={style}
      />
    )
  }
}, {
  name: 'ProCardDivider',
  inheritAttrs: false,
  props: ['orientation', 'type'],
})

export default ProCardDivider
