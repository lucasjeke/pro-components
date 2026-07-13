import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { PureSettings } from '../../defaultSettings'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import { useRouteContext } from '../../context/RouteContext'
import useStyle from './style'

export interface GridContentProps {
  prefixCls?: string
  contentWidth?: PureSettings['contentWidth']
}

//  slots: Object as
/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 */
const GridContent = defineComponent<GridContentProps, {}, string, CustomSlotsType<{
  default: () => VueNode
}>>((props, { slots, attrs }) => {
  const routeContext = useRouteContext()
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const contentWidth = computed(() => props.contentWidth || routeContext.value.contentWidth)
  const baseClassName = computed(() => `${prefixCls.value}-grid-content`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const isWide = computed(() => contentWidth.value === 'Fixed' && routeContext.value.layout === 'top')
  return () => {
    return (
      <div
        class={classNames(baseClassName.value, hashId?.value, cssVarCls?.value, attrs.class, {
          [`${baseClassName.value}-wide`]: isWide.value,
        })}
        style={attrs.style}
      >
        <div class={classNames(`${prefixCls.value}-grid-content-children`, hashId?.value, cssVarCls?.value)}>{slots.default?.()}</div>
      </div>
    )
  }
}, {
  name: 'GridContent',
  inheritAttrs: false,
})
export default GridContent
