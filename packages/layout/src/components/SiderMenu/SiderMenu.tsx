import type { GenerateStyle } from '@antdv-next1/pro-provider'
import type { VueNode, WithFalse } from '@antdv-next1/pro-utils'
import type { Breakpoint } from 'antdv-next/dist/_util/responsiveObserver'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { SiderProps } from 'antdv-next/dist/layout/index'
import type { ItemType } from 'antdv-next/dist/menu/interface'
import type { CSSProperties, Events, ShallowRef, VNode } from 'vue'
import type { ActionsRender, AppListRender, CollapsedButtonRender, HeaderRender, HeaderTitleRender, MenuContentRender, MenuExtraRender, MenuFooterRender, MenuHeaderRender } from '../../RenderTypings'
import type { AppItemProps, AppListProps } from '../AppsLogoComponents/typing'
import type { AvatarPropsType } from '../GlobalHeader/ActionsContent'
import type { BaseMenuProps } from './BaseMenu'
import type { SiderMenuToken } from './style/stylish'
import { useProConfig } from '@antdv-next1/pro-provider'
import { classNames } from '@v-c/util'
import { Avatar, LayoutSider, Menu, Space } from 'antdv-next'
import { computed, defineComponent, isVNode } from 'vue'
import { clearMenuItem } from '../../utils'
import AppsLogoComponents, { defaultRenderLogo } from '../AppsLogoComponents'
import CollapsedIcon from '../CollapsedIcon'
import BaseMenu from './BaseMenu'
// import { getLeftMenuItemTitle, getLeftMenuSelectedItem, getMenuKey, hasLeftSubMenu, renderLeftMenuIcon } from './leftMenu'
import { useStylish } from './style/stylish'

export type HeaderRenderKey = 'menuHeaderRender' | 'headerTitleRender'
/**
 * 渲染 title 和 logo
 *
 * @param props
 * @param renderKey
 */
export function renderLogoAndTitle(props: Partial<
  SiderMenuProps & {
    headerTitleRender: WithFalse<HeaderTitleRender>
  }
>, renderKey: HeaderRenderKey = 'menuHeaderRender'): VueNode {
  const { logo, title, layout } = props
  const renderFunction = props[renderKey as 'menuHeaderRender']
  if (renderFunction === false) {
    return null
  }
  const logoDom = defaultRenderLogo(logo)

  const titleDom = <h1>{title ?? 'Antdv Next Pro'}</h1>
  if (layout === 'left') {
    return (
      <a key="title">
        {titleDom}
      </a>
    )
  }
  if (renderFunction) {
    // when collapsed, no render title
    return renderFunction({ logo: logoDom, title: props.collapsed ? null : titleDom, props })
  }
  if (layout === 'mix' && renderKey === 'menuHeaderRender' && !props.isMobile)
    return false
  if (props.collapsed) {
    return <a key="title">{logoDom}</a>
  }
  return (
    <a key="title">
      {logoDom}
      {titleDom}
    </a>
  )
}
export type SiderMenuProps = BaseMenuProps & {
  collapsedWidth?: number
  firstMenuWidth?: number
  theme?: SiderProps['theme']
  /** 品牌logo的标识 */
  logo?: AntVueNode
  /** 相关品牌的列表 */
  appList?: AppListProps
  /** 相关品牌的列表自定义渲染 */
  appListRender?: AppListRender | false
  /** 相关品牌的列表项 点击事件，当事件存在时，appList 内配置的 url 不在自动跳转 */
  itemClick?: (item: AppItemProps, popoverRef: ShallowRef<HTMLSpanElement | null>) => void
  /**
   * @name links 侧边菜单底部的一些快捷链接
   *
   * @example links={[<a href="ant.design"> 访问官网 </a>,<a href="help.ant.design"> 帮助 </a>]}
   */
  links?: ({
    icon?: VNode
    title?: string
    label?: VNode
  }[] | VueNode[]) | false
  /** 菜单的宽度 */
  siderWidth?: number
  /**
   * @name menuHeaderRender  菜单 logo 和 title 区域的渲染
   *
   * @example 不要logo : menuHeaderRender={(logo,title)=> title}
   * @example 不要title : menuHeaderRender={(logo,title)=> logo}
   * @example 展开的时候显示title,收起显示 logo： menuHeaderRender={(logo,title,props)=> props.collapsed ? logo : title}
   * @example 不要这个区域了 : menuHeaderRender={false}
   */
  menuHeaderRender?: MenuHeaderRender | false
  /**
   * @name  侧边菜单，菜单区域的处理,可以单独处理菜单的dom
   *
   * @example 增加菜单区域的背景颜色 menuContentRender={(props,defaultDom)=><div style.ts={{backgroundColor:"red"}}>{defaultDom}</div>}
   * @example 某些情况下不显示菜单 menuContentRender={(props)=> return <div>不显示菜单</div>}
   */
  menuContentRender?: MenuContentRender | false
  /**
   * @name menuFooterRender 侧边菜单底部的配置，可以增加一些底部操作
   *
   * @example 底部增加超链接 menuFooterRender={()=><a href="https://pro.ant.design">pro.ant.design</a>}
   * @example 根据收起展开配置不同的 dom  menuFooterRender={()=>collapsed? null :<a href="https://pro.ant.design">pro.ant.design</a>}
   */
  menuFooterRender?: MenuFooterRender | false
  /**
   * @name collapsedButtonRender 自定义展开收起按钮的渲染
   *
   * @example 使用文字渲染 collapsedButtonRender={(collapsed)=>collapsed?"展开":"收起"})}
   * @example 使用icon渲染 collapsedButtonRender={(collapsed)=>collapsed?<MenuUnfoldOutlined />:<MenuFoldOutlined />}
   * @example 不渲染按钮 collapsedButtonRender={false}
   */
  collapsedButtonRender?: CollapsedButtonRender | false
  siderProps?: SiderProps
  /**
   * @name breakpoint 菜单是否收起的断点，设置成false 可以禁用
   *
   * @example 禁用断点  breakpoint={false}
   * @example 最小的屏幕再收起 breakpoint={"xs"}
   */
  breakpoint?: Breakpoint | false
  /** 头像的设置 */
  avatarProps?: AvatarPropsType
  /**
   * @name actionsRender Layout的操作功能列表，不同的 layout 会放到不同的位置
   */
  actionsRender?: ActionsRender | false
  /**
   * @name menuExtraRender 侧边菜单 title 和 logo 下面区域的渲染，一般会增加个搜索框
   *
   * @example  增加一个搜索框 menuExtraRender={()=>(<Search placeholder="请输入" />)}
   * @example  根据收起展开配置不同的 dom： menuExtraRender={()=>collapsed? null : <Search placeholder="请输入" />}
   */
  menuExtraRender?: MenuExtraRender | false
  /**
   * @name onMenuHeaderClick 菜单顶部logo 和 title 区域的点击事件
   *
   * @example 点击跳转到首页 onMenuHeaderClick={()=>{ router.push('/') }}
   */
  onMenuHeaderClick?: (e: Events['onClick']) => void
  /**
   * @name logoStyle 侧边菜单的logo的样式，可以调整下大小
   *
   * @example 设置logo的大小为 42px logoStyle={{width: '42px', height: '42px'}}
   */
  logoStyle?: CSSProperties
  headerRender?: HeaderRender | false
}
export interface PrivateSiderMenuProps {
  matchMenuKeys?: string[]
  originCollapsed?: boolean
  menuRenderType?: 'header' | 'sider'
  stylish?: GenerateStyle<SiderMenuToken>
}

/**
 *  默认渲染菜单折叠切换按钮
 * @param collapsed
 * @param tabIndex
 * @returns
 */

const SiderMenu = defineComponent<SiderMenuProps & PrivateSiderMenuProps>((props, { attrs }) => {
  const proProvide = useProConfig()
  const baseClassName = computed(() => `${props.prefixCls}-sider`)
  const prefixCls = computed(() => `${baseClassName.value} ${baseClassName.value}-stylish`)
  /* Using the useMemo hook to create a CSS class that will hide the menu when the menu is collapsed. */
  const hideMenuWhenCollapsedClassName = computed(() => {
    const { menu, collapsed } = props
    // 收起时完全隐藏菜单
    if (menu?.hideMenuWhenCollapsed && collapsed) {
      return `${baseClassName.value}-hide-menu-collapsed`
    }
    return null
  })

  const showSiderExtraDom = computed(() => {
    const { isMobile, layout } = props
    if (isMobile)
      return false
    return layout !== 'mix'
  })

  // 收起的宽度
  const collapsedWidth = computed(() => props.collapsedWidth || 64)
  const firstMenuWidth = computed(() => props.firstMenuWidth || 80)
  const appsDom = computed(() => (
    <AppsLogoComponents onItemClick={props.itemClick} appListRender={props.appListRender} appList={props.appList} prefixCls={props.prefixCls} />
  ))
  // 之所以这样写是为了提升样式优先级，不然会被sider 自带的覆盖掉
  const [hashId, cssVarCls] = useStylish(prefixCls, {
    stylish: props.stylish,
    proLayoutCollapsedWidth: collapsedWidth.value,
    proLayoutFirstMenuWidth: firstMenuWidth.value,
  })
  const avatarDom = computed(() => {
    if (!props.avatarProps)
      return null
    const { title, render, ...rest } = props.avatarProps
    const dom = (
      <div class={`${baseClassName.value}-actions-avatar ${hashId?.value}`}>
        {rest?.src || rest?.srcSet || rest.icon ? <Avatar size={28} {...rest} /> : null}
        {props.avatarProps.title && !props.collapsed && <span>{title}</span>}
      </div>
    )
    if (render) {
      return render(props.avatarProps, dom, props)
    }
    return dom
  })

  const actionsDom = computed(() => {
    if (!props.actionsRender)
      return null
    return (
      <Space
        align="center"
        size={4}
        orientation={props.collapsed ? 'vertical' : 'horizontal'}
        class={classNames([
          `${baseClassName.value}-actions-list`,
          props.collapsed && `${baseClassName.value}-actions-list-collapsed`,
          cssVarCls?.value,
          hashId?.value,
        ])}
      >
        {[props.actionsRender?.({ props })].flat(1).map((item, index) => {
          return (
            <div key={index} class={classNames(`${baseClassName.value}-actions-list-item`, cssVarCls?.value, hashId?.value)}>
              {item}
            </div>
          )
        })}
      </Space>
    )
  })

  /** 操作区域的dom */
  const actionAreaDom = computed(() => {
    if (!avatarDom.value && !actionsDom.value)
      return null
    return (
      <div class={classNames(`${baseClassName.value}-actions`, cssVarCls?.value, hashId?.value, props.collapsed && `${baseClassName.value}-actions-collapsed`)}>
        {avatarDom.value}
        {actionsDom.value}
      </div>
    )
  })
  const theme = computed(() => {
    if (props.layout === 'left' && !props.isMobile) {
      return props.navTheme === 'light' && !proProvide.value.dark ? 'light' : 'dark'
    }
    if (props.layout === 'mix' && !props.isMobile) {
      return 'light'
    }
    if (props.navTheme === 'realDark') {
      return 'dark'
    }
    return props.navTheme
  })

  const collapsedDom = computed(() => {
    if (props.collapsedButtonRender === false || props.layout !== 'mix')
      return null
    const collapsedButton = {
      class: `${baseClassName.value}-collapsed-button-menu-icon`,
      key: 'collapsed-button-icon',
      title: '',
      label: <>&#8203;</>,
      icon: <CollapsedIcon collapsed={props.collapsed as boolean} />,
    }
    if (props.collapsedButtonRender) {
      return props.collapsedButtonRender({
        collapsed: props.collapsed,
        dom: <CollapsedIcon collapsed={props.collapsed as boolean} />,
      })
    }
    return (
      <Menu
        inlineIndent={16}
        class={classNames(`${baseClassName.value}-collapsed-button-menu`, cssVarCls?.value, hashId?.value)}
        selectedKeys={[]}
        openKeys={[]}
        theme={theme.value}
        mode="inline"
        onClick={() => props.onCollapse?.(!props.collapsed)}
        items={[collapsedButton]}
      />
    )
  })
  const headerDom = computed(() => renderLogoAndTitle(props))
  const extraDom = computed(() => props.menuExtraRender && props.menuExtraRender({ props }))
  const menuFooterDom = computed(() => props.menuFooterRender && props.menuFooterRender?.({ props }))
  const menuDom = computed(
    () => {
      let { menuData } = props
      if (props.menuContentRender === false) {
        return
      }
      if (props.layout === 'left' && props.splitMenus) {
        const keys = props.matchMenuKeys || props.selectedKeys
        if (keys?.length) {
          menuData = menuData?.find(item => item.key === keys[0])?.children || []
        }
        else {
          menuData = []
        }
        if (!menuData.length) {
          return null
        }
        return (
          <BaseMenu
            {...props}
            menuData={menuData}
            mode={props.collapsed && !props.isMobile ? 'vertical' : 'inline'}
            theme="light"
            class={`${baseClassName.value}-menu`}
          />
        )
      }
      return (
        <BaseMenu
          {...props}
          mode={props.collapsed && !props.isMobile ? 'vertical' : 'inline'}
          theme={theme.value}
          class={`${baseClassName.value}-menu`}
        />
      )
    },
  )
  const menuRenderDom = computed(() => (props.menuContentRender ? props.menuContentRender({ props, dom: menuDom.value }) : menuDom.value))

  const linksMenuItems = computed<ItemType[]>(() =>
    (props.links || []).map((node, key) => {
      const menuItem: ItemType = {
        class: `${baseClassName.value}-link`,
        key,
      }
      if (isVNode(node) && Array.isArray(node.children) && node.children.length > 0) {
        if (((node as VNode).children as VNode[])?.length >= 2) {
          menuItem.title = ((node.children as VNode[])[1]!.children as VNode[])[0]?.children as string
          menuItem.label = (node.children as VNode[])[1]
          menuItem.icon = (node.children as VNode[])[0]
        }
        else {
          const children = node.children as VNode[]
          const title = children[0]?.children as string
          const label = title.substring(1)
          const icon = (
            <span class={classNames(`${proProvide.value.token?.antCls}-icon`, `${proProvide.value.token?.antCls}-menu-item-icon`)}>
              {title.trim().charAt(0).toUpperCase()}
            </span>
          )
          menuItem.title = title
          menuItem.icon = icon
          menuItem.label = label
        }
      }
      else {
        const link = node as {
          icon?: VNode
          title?: string
          label?: VNode
        }
        menuItem.label = link.label
        menuItem.title = link.title
        menuItem.icon = link.icon
      }
      return menuItem
    }),
  )
  const railMenuItem = computed(() => {
    const { menuData = [], collapsed, defaultCollapsed, inlineCollapsed, originCollapsed, onCollapse, mode, ...rest } = props
    const noChildrenMenuData = menuData.map(item => ({
      ...item,
      children: undefined,
    }))
    const clearMenuData = clearMenuItem(noChildrenMenuData)
    return (
      <div>
        <BaseMenu {...rest} mode="vertical" inlineCollapsed={false} theme={theme.value} menuData={clearMenuData} />
      </div>
    )
  })
  const menuDomItems = computed(() => {
    if (props.layout === 'left') {
      return menuRenderDom.value ? (
        <>
          {props.title !== false && !props.collapsed && (
            <div
              class={classNames(`${baseClassName.value}-logo-title`, cssVarCls?.value, hashId?.value, {
              })}
            >
              <a>
                <h1>{props.title ?? 'Antdv Next Pro'}</h1>
              </a>
              {!props.isMobile && appsDom.value}
            </div>
          )}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {menuRenderDom.value}
          </div>
        </>
      ) : null
    }
    return (
      <>
        {headerDom.value && (
          <div
            class={classNames(`${baseClassName.value}-logo`, cssVarCls?.value, hashId?.value, {
              [`${baseClassName.value}-logo-collapsed`]: props.collapsed,
            })}
            onClick={showSiderExtraDom.value ? props.onMenuHeaderClick : undefined}
            id="logo"
            style={props.logoStyle}
          >
            {headerDom.value}
            {!props.isMobile && appsDom.value}
          </div>
        )}
        {extraDom.value && (
          <div class={classNames(`${baseClassName.value}-extra`, {
            [`${baseClassName.value}-extra-no-logo`]: !headerDom.value,
          }, cssVarCls?.value, hashId?.value)}
          >
            {extraDom.value}
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {menuRenderDom.value}
        </div>
        {props.links
          ? (
              <div class={classNames(`${baseClassName.value}-links`, cssVarCls?.value, hashId?.value)}>
                <Menu
                  inlineIndent={16}
                  class={classNames(`${baseClassName.value}-link-menu`, cssVarCls?.value, hashId?.value)}
                  selectedKeys={[]}
                  openKeys={[]}
                  theme={props.theme}
                  mode="inline"
                  items={linksMenuItems.value}
                />
              </div>
            )
          : null}
        {showSiderExtraDom.value && props.headerRender === false && actionAreaDom.value}
        {menuFooterDom.value && (
          <div class={classNames([`${baseClassName.value}-footer`, cssVarCls?.value, hashId?.value, { [`${baseClassName.value}-footer-collapsed`]: props.collapsed }])}>
            {menuFooterDom.value}
          </div>
        )}
      </>
    )
  })
  return () => {
    const {
      breakpoint = 'lg',
      stylish,
      navTheme,
      layout,
      siderProps,
      collapsed,
      siderWidth = 256,
      fixedSiderbar,
      isMobile,
      onCollapse,
      logo,
    } = props
    const siderClassName = classNames(attrs.class, cssVarCls?.value, hashId?.value, {
      [`${baseClassName.value}-fixed`]: fixedSiderbar,
      [`${baseClassName.value}-fixed-mix`]: layout === 'mix' && !isMobile && fixedSiderbar,
      [`${baseClassName.value}-collapsed`]: collapsed && layout !== 'left',
      [`${baseClassName.value}-${layout}`]: layout && !isMobile,
      [`${baseClassName.value}-light`]: navTheme === 'light' || (layout === 'mix' && navTheme !== 'realDark'),
      [`${baseClassName.value}-dark`]: navTheme === 'dark' && (!['mix', 'left'].includes(layout!)),
      [`${baseClassName.value}-realDark`]: layout === 'mix' && navTheme === 'realDark',
      [`${baseClassName.value}-mix`]: layout === 'mix' && !isMobile,
      [`${baseClassName.value}-stylish`]: !!stylish,
    })
    return (
      <>
        {fixedSiderbar && !isMobile && !hideMenuWhenCollapsedClassName.value && (
          <div
            style={{
              width: `${collapsed ? collapsedWidth.value : siderWidth}px`,
              overflow: 'hidden',
              flex: `0 0 ${collapsed ? collapsedWidth.value : siderWidth}px`,
              maxWidth: `${collapsed ? collapsedWidth.value : siderWidth}px`,
              minWidth: `${collapsed ? collapsedWidth.value : siderWidth}px`,
              transition: 'all 0.2s ease 0s',
            }}
          />
        )}
        {layout === 'left' ? (
          <LayoutSider
            class={classNames(siderClassName, hideMenuWhenCollapsedClassName.value)}
            theme={theme.value}
            collapsed={false}
            collapsible={false}
            defaultCollapsed={false}
            width={menuDomItems.value ? (collapsed ? (firstMenuWidth.value + collapsedWidth.value) : siderWidth) : firstMenuWidth.value}
          >
            <div class={`${baseClassName.value}-left-container`}>
              <div class={classNames(`${baseClassName.value}-left-rail`, cssVarCls?.value, hashId?.value)}>
                { logo && (
                  <div
                    class={classNames(`${baseClassName.value}-left-logo`, cssVarCls?.value, hashId?.value)}
                    onClick={showSiderExtraDom.value ? props.onMenuHeaderClick : undefined}
                    id="logo"
                    style={props.logoStyle}
                  >
                    {defaultRenderLogo(logo)}
                  </div>
                ) }
                {railMenuItem.value}
              </div>
              {menuDomItems.value && (
                <div class={classNames(`${baseClassName.value}-left-menu`, cssVarCls?.value, hashId?.value)}>
                  <LayoutSider
                    theme="light"
                    collapsed={collapsed}
                    collapsedWidth={menuDomItems.value ? collapsedWidth.value : 0}
                    collapsible
                    breakpoint={breakpoint === false ? undefined : breakpoint}
                    onCollapse={(collapse: boolean) => {
                      if (isMobile)
                        return
                      onCollapse?.(collapse)
                    }}
                    width={menuDomItems.value ? (siderWidth - firstMenuWidth.value) : 0}
                  >
                    {menuDomItems.value}
                  </LayoutSider>
                </div>
              )}

            </div>
          </LayoutSider>
        ) : (
          <LayoutSider
            class={classNames(siderClassName, hideMenuWhenCollapsedClassName.value)}
            style={attrs.style}
            collapsed={collapsed}
            collapsedWidth={collapsedWidth.value}
            collapsible
            breakpoint={breakpoint === false ? undefined : breakpoint}
            theme={theme.value}
            onCollapse={(collapse: boolean) => {
              if (isMobile)
                return
              onCollapse?.(collapse)
            }}
            width={siderWidth}
            {...siderProps}
          >
            {hideMenuWhenCollapsedClassName.value
              ? (
                  <div
                    class={classNames(`${baseClassName.value}-hide-when-collapsed`, cssVarCls?.value, hashId?.value)}
                    style={{
                      height: '100%',
                      width: '100%',
                      opacity: hideMenuWhenCollapsedClassName.value ? 0 : 1,
                    }}
                  >
                    {menuDomItems.value}
                  </div>
                )
              : (
                  menuDomItems.value
                )}
            {collapsedDom.value && <div class={classNames(`${baseClassName.value}-collapsed-button`, cssVarCls?.value, hashId?.value)}>{collapsedDom.value}</div> }
          </LayoutSider>
        ) }
      </>
    )
  }
}, {
  name: 'SiderMenu',
  inheritAttrs: false,
})

export default SiderMenu
