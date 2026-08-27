import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'

export interface ProStatisticCardOperationProps {
  prefixCls?: string
}
const ProStatisticCardOperation = defineComponent<ProStatisticCardOperationProps, {}, string, CustomSlotsType<{
  default: () => VueNode[]
}>>((props, { expose, attrs, slots }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-statistic-card-operation`)
  expose({})
  return () => (<div {...attrs} class={classNames(baseClassName.value, attrs.class)}>{slots.default?.()}</div>)
}, {
  name: 'ProStatisticCardOperation',
  inheritAttrs: false,
})

export default ProStatisticCardOperation
