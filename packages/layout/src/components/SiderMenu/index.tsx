import type { ProTokenType } from '@antdv-next1/pro-provider'
import type { CSSProperties } from 'vue'
import type { PrivateSiderMenuProps, SiderMenuProps } from './SiderMenu'
import { useProConfig } from '@antdv-next1/pro-provider'
import { useEffect } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { Drawer } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent } from 'vue'
import SiderMenu from './SiderMenu'
import { useStyle } from './style'

export type SiderMenuWrapperProps = {
  token?: ProTokenType['layout']
  getContainer?: string | HTMLElement
  hide?: boolean
} & SiderMenuProps & PrivateSiderMenuProps

const SiderMenuWrapper = defineComponent<SiderMenuWrapperProps>((props, { attrs }) => {
  const proProvide = useProConfig()
  const config = useConfig()
  const baseClassName = computed(() => `${props.prefixCls}-sider`)
  useEffect(() => {
    if (props.isMobile === true) {
      props.onCollapse?.(true)
    }
  }, [() => props.isMobile])

  const [hashId, cssVarCls] = useStyle(baseClassName, {
    proLayoutCollapsedWidth: 64,
  })

  const drawerMenuBackground = computed(() => {
    if (
      (props.navTheme === 'realDark' && props.layout !== 'mix')
      || (props.navTheme === 'dark' && props.layout !== 'mix')
      || (props.layout === 'mix' && props.isMobile && props.navTheme === 'realDark')
      || (props.layout === 'mix' && props.isMobile && props.navTheme === 'dark')
    ) {
      return props.token?.sider?.colorMenuBackground || '#001529'
    }
    return proProvide.value.token.layout?.sider?.colorMenuBackground || 'transparent'
  })

  return () => {
    const { prefixCls, collapsed, siderWidth, isMobile, onCollapse, getContainer } = props
    const { direction } = config.value
    if (props.hide) {
      return null
    }
    return props.isMobile
      ? (
          <Drawer
            placement={direction === 'rtl' ? 'right' : 'left'}
            class={classNames(`${prefixCls}-drawer-sider`, attrs.class, hashId?.value, cssVarCls?.value)}
            open={!collapsed}
            style={{
              padding: 0,
              height: '100vh',
              ...(attrs.style as CSSProperties),
            }}
            onClose={() => onCollapse?.(true)}
            closable={false}
            getContainer={getContainer}
            mask={{
              closable: true,
            }}
            width={siderWidth}
            styles={{
              body: {
                height: '100vh',
                padding: 0,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: drawerMenuBackground.value,
              },
            }}
          >
            <SiderMenu
              {...props}
              isMobile={true}
              class={classNames(baseClassName.value, attrs.class)}
              collapsed={isMobile ? false : collapsed}
              splitMenus={false}
              originCollapsed={collapsed}
            />
          </Drawer>
        )
      : (
          <SiderMenu {...props} class={classNames(baseClassName.value, attrs.class)} originCollapsed={collapsed} />
        )
  }
}, {
  name: 'SiderMenuWrapper',
  inheritAttrs: false,
})

export default SiderMenuWrapper
