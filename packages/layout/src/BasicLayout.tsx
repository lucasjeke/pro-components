import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { PrivateSiderMenuProps } from './components/SiderMenu/SiderMenu'
import type { ProSettings } from './defaultSettings'
import type { GetPageTitleProps } from './getPageTitle'
import type { ProLayoutProps } from './ProLayout'
import type { SlotsRenderType } from './RenderTypings'
import type { MenuDataItem, MessageDescriptor } from './typing'
import { useProConfig } from '@antdv-next1/pro-provider'
import { useBreakpoint, useDocumentTitle, useMountMergeState, useState } from '@antdv-next1/pro-utils'
import { getMatchMenu } from '@antdv-next1/route-utils'
import { classNames, omit } from '@v-c/util'
import { ConfigProvider, Layout } from 'antdv-next'
import warning from 'antdv-next/dist/_util/warning'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, shallowRef, toRef } from 'vue'
import Footer from './components/Footer'
import Header from './components/Header'
import MultiTab from './components/MultiTab'
import PageLoading from './components/PageLoading'
import SiderMenu from './components/SiderMenu'
import { useRouteContext, useRouteContextProvider } from './context/RouteContext'
import { getPageTitleInfo } from './getPageTitle'
import { gLocaleObject } from './locales'
import useStyle from './style'
import { clearMenuItem } from './utils'
import { getBreadcrumbProps } from './utils/getBreadcrumbProps'
import { getMenuData } from './utils/getMenuData'
import useCurrentMenuLayoutProps from './utils/useCurrentMenuLayoutProps'
import { useProLayoutLocation } from './utils/useProLayoutLocation'
import { useProLayoutRender } from './utils/useProLayoutRender'
import WrapContent from './WrapContent'

function headerRender(props: ProLayoutProps & Omit<PrivateSiderMenuProps, 'stylish'> & { hasSiderMenu: boolean, isMobile: boolean }, matchMenuKeys: string[]) {
  const { headerRender, pure, stylish } = props
  if (headerRender === false || pure) {
    return null
  }
  return <Header {...props} matchMenuKeys={matchMenuKeys} stylish={stylish?.header} />
}

function renderSiderMenu(props: ProLayoutProps & Omit<PrivateSiderMenuProps, 'stylish'>, matchMenuKeys: string[]) {
  const { layout, isMobile, selectedKeys, openKeys, pure, splitMenus, suppressSiderWhenMenuEmpty, menuRender } = props
  if (menuRender === false || pure)
    return null
  let { menuData } = props
  /** 如果是分割菜单模式，需要专门实现一下 */
  if (splitMenus && layout !== 'left' && (openKeys !== false || layout === 'mix') && !isMobile) {
    const [key] = matchMenuKeys || selectedKeys
    if (key) {
      menuData = menuData?.find(item => item.key === key)?.children || []
    }
    else {
      menuData = []
    }
  }
  // 这里走了可以少一次循环
  const clearMenuData = clearMenuItem(menuData || [])
  if (clearMenuData && clearMenuData?.length < 1 && (splitMenus || suppressSiderWhenMenuEmpty))
    return null
  if (layout === 'top' && !isMobile) {
    return <SiderMenu {...props} matchMenuKeys={matchMenuKeys} hide stylish={props.stylish?.sider} />
  }
  const defaultDom = (
    <SiderMenu
      matchMenuKeys={props.matchMenuKeys || matchMenuKeys}
      {...props}
      // 这里走了可以少一次循环
      menuData={clearMenuData}
      stylish={props.stylish?.sider}
    />
  )
  if (menuRender) {
    return menuRender({ props, dom: defaultDom })
  }
  return defaultDom
}

function footerRender(props: ProLayoutProps) {
  const { footerRender, pure } = props
  if (footerRender === false || pure)
    return null
  if (footerRender)
    return footerRender({ props, dom: <Footer /> })
  return null
}

function defaultPageTitleRender(pageProps: GetPageTitleProps, props: ProLayoutProps): {
  title: string
  id: string
  pageName: string
} {
  const { pageTitleRender } = props
  const pageTitleInfo = getPageTitleInfo(pageProps)
  if (pageTitleRender === false) {
    return {
      title: props.title || '',
      id: '',
      pageName: '',
    }
  }
  if (pageTitleRender) {
    const title = pageTitleRender({
      props: pageProps,
      defaultPageTitle: pageTitleInfo.title,
      info: pageTitleInfo,
    })
    if (typeof title === 'string') {
      return getPageTitleInfo({
        ...pageTitleInfo,
        title,
      })
    }
    warning(title === undefined, 'pro-layout: ', 'renderPageTitle return value should be a string')
  }
  return pageTitleInfo
}
export type BasicLayoutContext = { [K in 'location']: ProLayoutProps[K] } & {
  breadcrumb: Record<string, MenuDataItem>
}
function getPaddingInlineStart(hasLeftPadding: boolean, collapsed: boolean | undefined, siderWidth: number, collapsedWidth: number, firstMenuWidth: number, layout: ProSettings['layout']): number | undefined {
  if (hasLeftPadding) {
    return collapsed ? (layout === 'left' ? siderWidth < (collapsedWidth + firstMenuWidth) ? siderWidth : (collapsedWidth + firstMenuWidth) : collapsedWidth) : siderWidth
    // (siderWidth < (collapsedWidth + firstMenuWidth) ? siderWidth : collapsedWidth) : siderWidth
    // return collapsed ? collapsedWidth : siderWidth
  }
  return 0
}

/**
 * 🌃 Powerful and easy to use beautiful layout 🏄‍ Support multiple topics and layout types
 *
 * @param props
 */
const BasicLayout = defineComponent<ProLayoutProps, {}, string, CustomSlotsType<
  SlotsRenderType & {
    default: () => VueNode[]
  }
>>((props, { slots, attrs, expose }) => {
  const config = useConfig()
  const proProvide = useProConfig()
  const layoutRef = shallowRef<InstanceType<typeof Layout> | null>(null)
  const prefixCls = computed(() => props.prefixCls ?? config.value.getPrefixCls('pro'))
  const proLayoutClassName = computed(() => `${prefixCls.value}-basicLayout`)
  const [hashId, cssVarCls] = useStyle(proLayoutClassName)
  const routeContextProvide = useRouteContext()
  const proLayoutRender = useProLayoutRender(slots, props)

  const collapsedWidth = computed(() => props.collapsedWidth || 64)

  /**
   * 处理国际化相关 formatMessage
   * 如果有用户配置的以用户为主
   * 如果没有用自己实现的
   */
  const formatMessage = ({ id, defaultMessage, ...restParams }: MessageDescriptor) => {
    if (props.formatMessage) {
      return props.formatMessage({
        id,
        defaultMessage,
        ...restParams,
      })
    }
    const locales = gLocaleObject()
    return locales[id] ? locales[id] : defaultMessage
  }
  // 如果 props 中定义，以 props 为准
  const isChildrenLayout = computed(() => (props.isChildrenLayout !== undefined ? props.isChildrenLayout : routeContextProvide.value.isChildrenLayout))

  const currentLocation = useProLayoutLocation(() => props.location)

  const menuInfoData = computed(() => {
    const { route, menu, menuData, menuDataRender } = props
    return getMenuData(menuData || route?.children || [], menu, formatMessage, menuDataRender)
  })
  const matchMenus = computed(() => {
    const { menuData } = menuInfoData.value
    return getMatchMenu(currentLocation.value?.path || '/', menuData || [], true)
  })
  const matchMenuKeys = computed(() => Array.from(new Set(matchMenus.value.map(item => item.key || item.path || ''))))
  // 当前选中的menu，一般不会为空
  const currentMenu = computed(
    () =>
      (matchMenus.value[matchMenus.value.length - 1] || {}) as MenuDataItem & {
        meta: Pick<MenuDataItem, 'meta'> & ProSettings
      },
  )

  const siderWidth = computed(() => {
    if (props.siderWidth) {
      return props.siderWidth
    }
    if (props.layout === 'mix') {
      return 215
    }
    if (props.layout === 'left') {
      const [key] = matchMenuKeys.value || props.selectedKeys
      if (key) {
        const { menuData } = menuInfoData.value
        const menus = menuData.find(item => item.key === key)?.children || []
        if (menus.length) {
          return 320
        }
      }
      return 80
    }
    return 256
  })
  const currentMenuLayoutProps = useCurrentMenuLayoutProps(currentMenu)
  const defaultProps = computed(() => {
    const { menu, siderMenuType } = props
    return omit(
      {
        ...omit(props, ['headerRender', 'footerRender', 'menuRender', 'menuHeaderRender', 'menuItemRender', 'subMenuItemRender', 'menuExtraRender', 'menuContentRender', 'headerContentRender', 'headerTitleRender', 'appListRender', 'actionsRender', 'collapsedButtonRender', 'errorBoundaryRender', 'menuFooterRender', 'multiTabRender', 'multiTab']),
        ...proLayoutRender.value,
        location: currentLocation.value,
        prefixCls: prefixCls.value,
        siderWidth: siderWidth.value,
        ...currentMenuLayoutProps.value,
        formatMessage,
        breadcrumb: menuInfoData.value.breadcrumb,
        menu: {
          ...menu,
          type: siderMenuType || menu?.type,
        },
      },
      ['breadcrumbRender'],
    )
  })

  const [hasFooterToolbar, setHasFooterToolbar] = useState(false)
  /**
   * 使用number是因为多标签页的时候有多个 PageContainer，只有有任意一个就应该展示这个class
   */
  const [hasPageContainer, setHasPageContainer] = useState(0)
  const colSize = useBreakpoint()

  const isMobile = computed(() => {
    const { disableMobile } = props
    return (colSize.value === 'sm' || colSize.value === 'xs') && !disableMobile
  })
  // gen page title
  const pageTitleInfo = computed(() =>
    defaultPageTitleRender(
      {
        ...defaultProps.value,
        path: currentLocation.value?.path || '/',
        breadcrumbMap: menuInfoData.value.breadcrumbMap,
      },
      props,
    ),
  )
  // gen breadcrumbProps, parameter for pageHeader
  const breadcrumbProps = computed(() =>
    getBreadcrumbProps(
      {
        ...defaultProps.value,
        breadcrumbRender: props.breadcrumbRender,
        breadcrumbMap: menuInfoData.value.breadcrumbMap,
      },
      props,
    ),
  )
  // If it is a fix menu, calculate padding
  // don't need padding in phone mode
  /* Checking if the menu is loading and if it is, it will return a skeleton loading screen. */
  const hasLeftPadding = computed(() => props.layout !== 'top' && !isMobile.value)
  const [collapsed, onCollapse] = useMountMergeState<boolean>(
    () => {
      if (props.defaultCollapsed !== undefined)
        return props.defaultCollapsed
      if (isMobile.value)
        return true
      return colSize.value === 'md'
    },
    {
      value: toRef(() => props.collapsed!),
      onChange: props.onCollapse,
    },
  )
  /** 计算 slider 的宽度 */
  const layoutSiderWidth = computed(() => getPaddingInlineStart(
    hasLeftPadding.value,
    collapsed.value,
    siderWidth.value,
    collapsedWidth.value,
    props.firstMenuWidth || 80,
    props.layout,
  ))

  const bgImgStyleList = computed(() => {
    const { bgLayoutImgList } = props
    if (bgLayoutImgList && bgLayoutImgList.length > 0) {
      return bgLayoutImgList.map(({ src, ...rest }, index) => {
        return (
          <img
            key={index}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              ...Object.entries(rest).reduce((pre, [key, value]) => {
                return {
                  ...pre,
                  [key]: typeof value === 'number' ? `${value}px` : value,
                }
              }, {}),
            }}
          />
        )
      })
    }
    return null
  })
  const siderMenuDom = computed(() => {
    const { menuData } = menuInfoData.value
    return renderSiderMenu(
      {
        ...defaultProps.value,
        menuData,
        onCollapse,
        isMobile: isMobile.value,
        collapsed: collapsed.value,
        siderWidth: siderWidth.value,
      },
      matchMenuKeys.value,
    )
  })
  // render header dom
  const headerDom = computed(() =>
    headerRender(
      {
        ...defaultProps.value,
        hasSiderMenu: !!siderMenuDom.value,
        menuData: menuInfoData.value.menuData,
        isMobile: isMobile.value,
        collapsed: collapsed.value,
        onCollapse,
      },
      matchMenuKeys.value,
    ),
  )

  // render footer dom
  const footerDom = computed(() =>
    footerRender({
      ...defaultProps.value,
      isMobile: isMobile.value,
      collapsed: collapsed.value,
    }),
  )

  const multiTabDom = computed(() => {
    const { multiTabRender } = proLayoutRender.value
    if (multiTabRender === false)
      return null
    const layoutProps = {
      ...defaultProps.value,
      isMobile: isMobile.value,
      collapsed: collapsed.value,
    } as ProLayoutProps
    if (multiTabRender)
      return multiTabRender(layoutProps)
    if (!props.multiTab)
      return null
    const multiTabProps = props.multiTab === true
      ? { items: [] }
      : props.multiTab
    return (
      <MultiTab
        prefixCls={prefixCls.value}
        formatMessage={formatMessage}
        {...multiTabProps}
      />
    )
  })

  useDocumentTitle(
    pageTitleInfo,
    computed(() => props.title || false),
  )

  const routeContextProps = computed(() => ({
    ...defaultProps.value,
    breadcrumb: breadcrumbProps.value,
    menuData: menuInfoData.value.menuData,
    isMobile: isMobile.value,
    collapsed: collapsed.value,
    title: pageTitleInfo.value.pageName,
    pageTitleInfo: pageTitleInfo.value,
    hasSiderMenu: !!siderMenuDom.value,
    hasHeader: !!headerDom.value,
    isChildrenLayout: true,
    siderWidth: layoutSiderWidth.value,
    matchMenus: matchMenus.value,
    matchMenuKeys: matchMenuKeys.value,
    currentMenu: currentMenu.value,
    hasFooter: !!footerDom.value,
    hasFooterToolbar: hasFooterToolbar.value,
    hasPageContainer: hasPageContainer.value,
    setHasFooterToolbar,
    setHasPageContainer,
  }))

  useRouteContextProvider(routeContextProps)
  expose({})
  return () => {
    const { fixedSiderbar, pure, contentStyle, navTheme, loading, ...rest } = { ...props, ...currentMenuLayoutProps.value }
    return (
      <>
        {props.pure ? slots.default?.() : (
          <ConfigProvider getTargetContainer={config.value.getPopupContainer || (() => layoutRef.value?.$el)}>
            <Layout
              ref={layoutRef}
              class={classNames(proLayoutClassName.value, {
                [`screen-${colSize.value}`]: colSize.value,
                [`${proLayoutClassName.value}-is-children`]: isChildrenLayout.value,
                [`${proLayoutClassName.value}-fix-siderbar`]: fixedSiderbar,
                [`${proLayoutClassName.value}-${props.layout}`]: props.layout,
                [`${proLayoutClassName.value}-${props.navTheme}`]: props.navTheme,
              }, attrs.class, hashId?.value, cssVarCls?.value)}
              style={attrs.style}
            >
              {bgImgStyleList.value && <div class={classNames(`${proLayoutClassName.value}-bg-list`, hashId?.value, cssVarCls?.value)}>{bgImgStyleList.value}</div>}
              <ConfigProvider>{siderMenuDom.value}</ConfigProvider>
              <Layout>
                {headerDom.value}
                {multiTabDom.value}
                <WrapContent
                  {...rest}
                  hasPageContainer={hasPageContainer.value}
                  isChildrenLayout={isChildrenLayout.value}
                  hasHeader={!!headerDom.value}
                  hashId={hashId?.value}
                  cssVarCls={cssVarCls?.value}
                  prefixCls={proLayoutClassName.value}
                  style={contentStyle}
                  v-slots={slots}
                >
                  {loading ? <PageLoading /> : slots.default?.()}
                </WrapContent>
                {footerDom.value}
                {hasFooterToolbar.value && (
                  <div
                    class={classNames(`${proLayoutClassName.value}-has-footer`, hashId?.value, cssVarCls?.value)}
                    style={{
                      height: '44px',
                      marginBlockStart: `${proProvide.value.token.layout?.pageContainer?.paddingBlockPageContainerContent}px`,
                    }}
                  />
                )}
              </Layout>
            </Layout>
          </ConfigProvider>
        )}
      </>
    )
  }
}, {
  name: 'BasicLayout',
  inheritAttrs: false,
})
export default BasicLayout
