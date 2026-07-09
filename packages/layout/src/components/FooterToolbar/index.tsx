import type { GenerateStyle } from '@antdv-next1/pro-provider'
import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { CSSProperties, VNode } from 'vue'
import type { FooterToolbarContentRender, SlotsRenderType } from '../../RenderTypings'
import type { stylishToken } from './style/stylish'
import { getSlot, isBrowser, useEffect } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, Fragment, Teleport } from 'vue'
import { useRouteContext } from '../../context/RouteContext'
import useStyle from './style'
import { useStylish } from './style/stylish'

export interface FooterToolbarProps {
  extra?: VNode
  footerToolbarContentRender?: FooterToolbarContentRender
  prefixCls?: string
  stylish?: GenerateStyle<stylishToken>
  portalDom?: boolean
}

const FooterToolbar = defineComponent<FooterToolbarProps, {}, string, CustomSlotsType<Pick<SlotsRenderType, 'footerToolbarContentRender'> & {
  default: () => VueNode[]
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-footer-bar`)
  const routeContext = useRouteContext()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const width = computed(() => {
    const { hasSiderMenu, isMobile, siderWidth } = routeContext.value
    if (!hasSiderMenu) {
      return undefined
    }
    // 0 or undefined
    if (!siderWidth) {
      return '100%'
    }
    return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`
  })
  const containerDom = computed(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return null
      // 只读取一次就行了，不然总是的渲染
    return config.value.getTargetContainer?.() || document.body
  })

  useStylish(
    computed(() => `${baseClassName.value}.${baseClassName.value}-stylish`),
    {
      stylish: computed(() => props.stylish as GenerateStyle<stylishToken>),
    },
  )

  /** 告诉 props 是否存在 footerBar */
  useEffect(() => {
    if (!routeContext.value || !routeContext.value?.setHasFooterToolbar) {
      return () => {}
    }
    routeContext.value?.setHasFooterToolbar?.(true)
    return () => {
      routeContext.value?.setHasFooterToolbar?.(false)
    }
  }, [])

  return () => {
    const { extra, portalDom = true } = props
    const footerToolbarContentRender = getSlot(slots, props, 'footerToolbarContentRender')
    const dom = (
      <>
        <div class={classNames(`${baseClassName.value}-left`, hashId?.value, cssVarCls?.value)}>{extra}</div>
        <div class={classNames(`${baseClassName.value}-right`, hashId?.value, cssVarCls?.value)}>{slots.default?.()}</div>
      </>
    )
    const renderDom = (
      <div
        class={classNames(baseClassName.value, attrs.class, hashId?.value, cssVarCls?.value, {
          [`${baseClassName.value}-stylish`]: !!props.stylish,
        })}
        style={{ width: width.value, ...(attrs.style || {}) as CSSProperties }}
      >
        {footerToolbarContentRender
          ? footerToolbarContentRender({
              props: {
                ...props,
                ...routeContext.value,
                leftWidth: width.value,
              },
              dom,
            })
          : dom}
      </div>
    )
    return (
      <Fragment key={baseClassName.value}>
        {!isBrowser() || !portalDom || !containerDom.value
          ? <>{renderDom}</>
          : (
              <Teleport to={containerDom.value}>
                {renderDom}
              </Teleport>
            )}
      </Fragment>
    )
  }
}, {
  name: 'FooterToolbar',
  inheritAttrs: false,
})
export default FooterToolbar
