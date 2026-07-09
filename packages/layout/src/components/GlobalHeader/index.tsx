import type { ProTokenType } from '@antdv-next1/pro-provider'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { MenuProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { Events, ShallowRef } from 'vue'
import type { PureSettings } from '../../defaultSettings'
import type { ActionsRender, AppListRender, HeaderContentRender, HeaderTitleRender, MenuHeaderRender, MenuRender, SlotsRenderType } from '../../RenderTypings'
import type { MenuDataItem, MessageDescriptor } from '../../typing'
import type { AppItemProps, AppListProps } from '../AppsLogoComponents/typing'
import type { PrivateSiderMenuProps, SiderMenuProps } from '../SiderMenu/SiderMenu'
import type { AvatarPropsType } from './ActionsContent'
import { useProConfig } from '@antdv-next1/pro-provider'
import { getSlot } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent } from 'vue'
import defaultSettings from '../../defaultSettings'
import { clearMenuItem } from '../../utils'
import AppsLogoComponents, { defaultRenderLogo } from '../AppsLogoComponents'
import CollapsedIcon from '../CollapsedIcon'
import { renderLogoAndTitle } from '../SiderMenu/SiderMenu'
import TopNavHeader from '../TopNavHeader'
import ActionsContent from './ActionsContent'
import useStyle from './style'

function renderLogo(menuHeaderRender: SiderMenuProps['menuHeaderRender'], logoDom: VueNode, props: SiderMenuProps) {
  if (menuHeaderRender === false) {
    return null
  }
  if (menuHeaderRender) {
    return menuHeaderRender({ logo: logoDom, title: null, props })
  }
  return logoDom
}

export type GlobalHeaderProps = {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  isMobile?: boolean
  /** 品牌logo的标识 */
  logo?: VueNode
  /**
   * @name menuRender 虽然叫menuRender，但是其实是整个 SiderMenu 面板的渲染函数
   *
   * @example 收起时完成不展示菜单 menuRender={(props,defaultDom)=> props.collapsed ? null : defaultDom}
   * @example 不展示菜单 menuRender={false}
   */
  menuRender?: MenuRender | false
  /**
   * @name menuProps 要给菜单的props, 参考ant-menu的属性
   */
  menuProps?: MenuProps
  prefixCls?: string
  /** 相关品牌的列表 */
  appList?: AppListProps
  /** 相关品牌的列表项 点击事件，当事件存在时，appList 内配置的 url 不在自动跳转 */
  itemClick?: (item: AppItemProps, popoverRef: ShallowRef<HTMLSpanElement | null>) => void
  menuData?: MenuDataItem[]
  /**
   * @name onMenuHeaderClick 菜单顶部logo 和 title 区域的点击事件
   *
   * @example 点击跳转到首页 onMenuHeaderClick={()=>{ router.push('/') }}
   */
  onMenuHeaderClick?: (e: Events['onClick']) => void
  menuHeaderRender?: MenuHeaderRender | false
  headerTitleRender?: HeaderTitleRender | false
  token?: ProTokenType['layout']
  /**
   * @name headerContentRender 顶部区域的渲染，包含内部的 menu
   *
   * @example headerContentRender={(props) => <div>管理控制台 </div>}
   */
  headerContentRender?: HeaderContentRender | false
  /**
   * @name actionsRender Layout的操作功能列表，不同的 layout 会放到不同的位置
   */
  actionsRender?: ActionsRender | false
  /** 头像的设置 */
  avatarProps?: AvatarPropsType
  formatMessage?: (message: MessageDescriptor) => string | undefined
  /** 相关品牌的列表自定义渲染 */
  appListRender?: AppListRender | false
} & Partial<PureSettings>

const GlobalHeader = defineComponent<GlobalHeaderProps & PrivateSiderMenuProps, {}, string, CustomSlotsType<
  Pick<SlotsRenderType, 'actionsRender' | 'menuHeaderRender' | 'headerTitleRender' | 'menuRender' | 'appListRender'> & {
    default: () => VueNode[]
  }
>>((props = defaultSettings, { slots, attrs }) => {
  const config = useConfig()
  const proProvide = useProConfig()
  const baseClassName = computed(() => `${props.prefixCls || config.value.getPrefixCls('pro')}-global-header`)
  const [hashId, cssVarCls] = useStyle(baseClassName)

  const showCollapsed = computed(() => {
    const { matchMenuKeys = [] } = props
    let { menuData = [] } = props
    if (matchMenuKeys.length) {
      menuData = menuData?.find(item => item.key === matchMenuKeys[0])?.children || []
    }
    else {
      menuData = []
    }
    if (!menuData.length) {
      return false
    }
    return true
  })
  return () => {
    const { navTheme, layout, isMobile, onCollapse, avatarProps, onMenuHeaderClick, logo, menuData = [], splitMenus, collapsed } = props
    const menuHeaderRender = getSlot(slots, props, 'menuHeaderRender')
    const actionsRender = getSlot(slots, props, 'actionsRender')
    const headerTitleRender = getSlot(slots, props, 'headerTitleRender')
    const menuRender = getSlot(slots, props, 'menuRender')
    const appListRender = getSlot(slots, props, 'appListRender')
    if (layout === 'mix' && !isMobile && splitMenus) {
      const noChildrenMenuData = menuData.map(item => ({
        ...item,
        children: undefined,
      }))
      const clearMenuData = clearMenuItem(noChildrenMenuData)
      return (
        <TopNavHeader
          {...attrs}
          {...props}
          menuHeaderRender={menuHeaderRender}
          actionsRender={actionsRender}
          headerTitleRender={headerTitleRender}
          menuRender={menuRender}
          appListRender={appListRender}
          mode="horizontal"
          splitMenus={false}
          menuData={clearMenuData}
        />
      )
    }

    const logoClassNames = classNames(`${baseClassName.value}-logo`, hashId?.value, cssVarCls?.value, {
      [`${baseClassName.value}-logo-rtl`]: config.value.direction === 'rtl',
      [`${baseClassName.value}-logo-mix`]: layout === 'mix',
      [`${baseClassName.value}-logo-mobile`]: isMobile,
    })
    const logoDom = (
      <span class={logoClassNames} key="logo">
        <a>{defaultRenderLogo(logo)}</a>
      </span>
    )

    return (
      <div
        class={classNames(attrs.class, baseClassName.value, hashId?.value, cssVarCls?.value, {
          [`${baseClassName.value}-light`]: navTheme === 'light' || ['side', 'left'].includes(layout!) || isMobile,
          [`${baseClassName.value}-dark`]: navTheme === 'dark' && !['side', 'left'].includes(layout!) && !isMobile,
          [`${baseClassName.value}-realDark`]: navTheme === 'realDark' && !['top', 'mix'].includes(layout!),
        })}
      >
        {isMobile && renderLogo(menuHeaderRender, logoDom, props)}
        {layout === 'mix' && !isMobile && menuHeaderRender !== false && (
          <>
            <AppsLogoComponents {...props} appListRender={appListRender} />
            <div class={logoClassNames} onClick={onMenuHeaderClick}>
              {renderLogoAndTitle({ ...props, headerTitleRender, menuHeaderRender, collapsed: false }, 'headerTitleRender')}
            </div>
          </>
        )}
        {(isMobile || layout === 'side' || (layout === 'left' && showCollapsed.value)) && menuRender !== false
          ? (
              <span
                class={classNames(`${baseClassName.value}-collapsed-button`, hashId?.value, cssVarCls?.value)}
                style={{
                  marginInlineStart: `${proProvide.value.token.marginXS}px`,
                }}
                onClick={() => {
                  onCollapse?.(!collapsed)
                }}
              >
                <CollapsedIcon collapsed={collapsed!} tabIndex={-1} />
              </span>
            )
          : null}

        <div style={{ flex: 1 }}>{slots.default?.()}</div>
        {(actionsRender || avatarProps) && <ActionsContent {...props} actionsRender={actionsRender} prefixCls={baseClassName.value} />}
      </div>
    )
  }
}, {
  name: 'GlobalHeader',
  inheritAttrs: false,
})

export default GlobalHeader
