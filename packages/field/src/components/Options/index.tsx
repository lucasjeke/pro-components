import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ProFieldFC } from '../../typing'
import { proTheme } from '@antdv-next1/pro-provider'
import { isSpecialNode } from '@antdv-next1/pro-utils'
import { useConfig } from 'antdv-next/config-provider/context'
import { cloneVNode, computed, defineComponent, Fragment, isVNode } from 'vue'

export type FieldOptionsProps = ProFieldFC<{
  text?: VueNode
}>

function addArrayKeys(doms: VueNode[]) {
  return doms.map((dom, index) => {
    if (!isVNode(dom) || (isVNode(dom) && isSpecialNode(dom))) {
      return <Fragment key={index}>{dom}</Fragment>
    }
    return cloneVNode(dom, {
      // key: index,
      ...dom?.props,
      style: {
        ...dom?.props?.style,
      },
    })
  })
}

const FieldOptions = defineComponent<FieldOptionsProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props) => {
    const config = useConfig()
    const baseClassName = computed(() => config.value.getPrefixCls('pro-field-option'))
    const { token } = proTheme.useToken()

    return () => {
      const { text, render, mode: type, formItemRender, fieldProps, ...rest } = props
      if (render) {
        const doms = render(
          text,
          { mode: type, fieldProps, ...rest },
          <></>,
        ) as VueNode[]
        if (!doms || doms?.length < 1 || !Array.isArray(doms)) {
          return null
        }

        return (
          <div
            style={{
              display: 'flex',
              gap: token.value.margin,
              alignItems: 'center',
            }}
            class={baseClassName.value}
          >
            {addArrayKeys(doms)}
          </div>
        )
      }
      if (!text || !Array.isArray(text)) {
        if (!isVNode(text)) {
          return null
        }
        return text
      }

      return (
        <div
          style={{
            display: 'flex',
            gap: token.value.margin,
            alignItems: 'center',
          }}
          class={baseClassName.value}
        >
          {addArrayKeys(text)}
        </div>
      )
    }
  },
  {
    name: 'FieldOptions',
    inheritAttrs: false,
  },
)

export default FieldOptions
