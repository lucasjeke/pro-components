import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

export interface FieldIndexColumnProps {
  border?: boolean
  children?: number | string
  prefixCls?: string
}

const FieldIndexColumn = defineComponent<
  FieldIndexColumnProps,
  {},
  string,
  CustomSlotsType<{
    default?: () => VueNode
  }>
>((props) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-field-index-column`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  return () =>
    (
      <div
        class={classNames(prefixCls.value, hashId.value, cssVarCls.value, {
          [`${prefixCls.value}-border`]: props.border,
          'top-three': (Number(props.children) as number) > 3,
        })}
      >
        {props.children}
      </div>
    )
}, {
  name: 'IndexColumn',
  inheritAttrs: false,
})

export default FieldIndexColumn
