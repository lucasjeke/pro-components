import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ErrorBoundaryRender, SlotsRenderType } from './RenderTypings'
import { ErrorBoundary, getSlot } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { LayoutContent } from 'antdv-next'
import { defineComponent } from 'vue'

export interface WrapContentProps {
  hasPageContainer?: number
  isChildrenLayout?: boolean
  prefixCls?: string
  location?: { path?: string }
  contentHeight?: number | string
  errorBoundaryRender?: ErrorBoundaryRender | false
  hasHeader?: boolean
  hashId?: string
  cssVarCls?: string
}

const WrapContent = defineComponent<WrapContentProps, {}, string, CustomSlotsType<
  Pick<SlotsRenderType, 'errorBoundaryRender'> & {
    default?: () => VueNode[]
  }
>>((props, { slots, attrs }) => {
  return () => {
    const { prefixCls, hasHeader, hasPageContainer, hashId, cssVarCls } = props
    const errorBoundaryRender = getSlot(slots, props, 'errorBoundaryRender')
    const contentClassName = classNames(`${prefixCls}-content`, hashId, cssVarCls, {
      [`${prefixCls}-has-header`]: hasHeader,
      [`${prefixCls}-content-has-page-container`]: (hasPageContainer || 0) > 0,
    })
    return errorBoundaryRender === false
      ? (
          <LayoutContent class={contentClassName} style={attrs.style}>
            {slots.default?.()}
          </LayoutContent>
        )
      : (
          <ErrorBoundary
            fallback={errorBoundaryRender}
            onError={(error) => {
              console.log(error)
            }}
          >
            <LayoutContent class={contentClassName} style={attrs.style}>
              {slots.default?.()}
            </LayoutContent>
          </ErrorBoundary>
        )
  }
}, {
  name: 'WrapContent',
  inheritAttrs: false,
})
export default WrapContent
