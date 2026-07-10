import type { GenerateStyle, ProTokenType } from '@antdv-next1/pro-provider'
import type { WithFalse } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { BreadcrumbProps, WatermarkProps } from 'antdv-next'
import type { AnyObject, VueNode } from 'antdv-next/dist/_util/type'
import type { ItemType } from 'antdv-next/dist/breadcrumb/Breadcrumb'
import type { App, CSSProperties, Plugin } from 'vue'
import type { HeaderViewProps } from './components/Header'
import type { MultiTabProps } from './components/MultiTab'
import type { SiderMenuProps } from './components/SiderMenu/SiderMenu'
import type { SiderMenuToken } from './components/SiderMenu/style'
import type { PureSettings } from './defaultSettings'
import type { GetPageTitleProps } from './getPageTitle'
import type { ErrorBoundaryRender, FooterRender, MultiTabRender, SlotsRenderType } from './RenderTypings'
import type { MenuDataItem, MessageDescriptor, RouterTypes } from './typing'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { ConfigProvider as AntdConfigProvider } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import { Logo } from './assert/Logo'
import BasicLayout from './BasicLayout'
import { useProLayoutRender } from './utils/useProLayoutRender'

type LayoutItemType = ItemType & { linkPath?: string, component?: string }

export interface LayoutBreadcrumbProps<T extends AnyObject = AnyObject> {
  minLength?: number
  itemRender?: (route: LayoutItemType, params: T, routes: LayoutItemType[], paths: string[]) => VueNode
}

type GlobalTypes = Omit<
  Partial<RouterTypes>
  & SiderMenuProps
  & HeaderViewProps & {
    token?: ProTokenType['layout']
  },
  'collapsed'
>

export type ProLayoutProps = GlobalTypes & {
  stylish?: {
    header?: GenerateStyle<SiderMenuToken>
    sider?: GenerateStyle<SiderMenuToken>
  }
  /**
   * @name Layout 的品牌配置，表现为一张背景图片
   */
  bgLayoutImgList?: {
    src?: string
    width?: string
    height?: string
    left?: number
    top?: number
    bottom?: number
    right?: number
  }[]
  /**
   * @name layout 的简约模式，设置了之后不渲染的任何 layout 的东西，但是会有 context，可以获取到当前菜单。
   *
   * @example pure={true}
   */
  pure?: boolean
  /**
   * @name logo 的配置，可以配置url，React 组件 和 false
   *
   * @example 设置 logo 为网络地址  logo="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"
   * @example 设置 logo 为组件  logo={<img src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"/>}
   * @example 设置 logo 为 false 不显示 logo  logo={false}
   * @example 设置 logo 为 方法  logo={()=> <img src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"/> }
   */
  logo?: VueNode | WithFalse<VueNode>
  /**
   * @name onPageChange 页面切换的时候触发
   *
   * @example 获取切换的页面地址 onPageChange={(location) => { console.log("切换到："+location.pathname) }}
   *
   */
  onPageChange?: (location?: RouterTypes['location']) => void
  /**
   * @name layout 的 loading 效果，设置完成之后只展示一个 loading
   *
   * @example loading={true}
   */
  loading?: boolean
  /**
   * @name 是否收起 layout 是严格受控的，可以 设置为 true，一直收起
   *
   * @example collapsed={true}
   */
  collapsed?: boolean
  /**
   * @name onCollapse 收起和展开的时候触发事件
   *
   * @example onCollapse=(collapsed)=>{ setCollapsed(collapsed) };
   */
  onCollapse?: (collapsed: boolean) => void
  compact?: PureSettings['compact']
  /**
   * @name multiTabProps 内置多标签页配置。默认不启用；传入对象时由外部控制标签数据和激活项。
   */
  multiTabProps?: MultiTabProps
  /**
   * @name multiTabRender 自定义多标签页区域渲染。优先级高于内置 multiTab。
   */
  multiTabRender?: MultiTabRender | false
  /**
   * @name footerRender 页脚的配置
   *
   * @example 不展示dom footerRender={false}
   * @example 使用 layout 的  DefaultFooter   footerRender={() => (<DefaultFooter copyright="这是一条测试文案"/>}
   */
  footerRender?: FooterRender | false
  /**
   * @name breadcrumbRender 设置 PageHeader 的面包屑，只能处理数据
   *
   * @example 手动设置 breadcrumbRender={(routes = []) => [ { path: '/', breadcrumbName: '主页'} ]
   * @example 增加一项 breadcrumbRender={(routes = []) => { return [{ path: '/', breadcrumbName: '主页'} ,...routers ]}
   * @example 删除首页 breadcrumbRender={(routes = []) => { return routes.filter(item => item.path !== '/')}
   * @example 不显示面包屑 breadcrumbRender={false}
   */
  breadcrumbRender?: ((routers: BreadcrumbProps['items']) => BreadcrumbProps['items']) | false
  /**
   * @name pageTitleRender 设置页面的标题
   *
   * @example 根据页面的路由设置标题 pageTitleRender={(props) => { return props.location.pathname }}
   * @example 不显示标题 pageTitleRender={false}
   * @example 根据默认的标题设置 pageTitleRender={(props,defaultPageTitle) => { return defaultPageTitle + '这是一个测试标题' }}
   * @example 根据 info 来自己组合标题 pageTitleRender={(props,defaultPageTitle,info) => { return info.title + "-" + info.pageName }
   */
  pageTitleRender?: ((options: {
    props: GetPageTitleProps
    defaultPageTitle?: string
    info?: {
      // 页面标题
      title: string
      // locale 的 title
      id: string
      // 页面标题不带默认的 title
      pageName: string
    }
  }) => string | undefined) | false
  /**
   * @name menuDataRender 处理 menuData 的数据，可以动态的控制数据
   * @see 请保持同步处理。Vue 项目中异步菜单通常应在路由守卫或 store 中加载，并通过 route.children 或 menuData 传给 ProLayout。
   *
   * @example 删除一些菜单 menuDataRender=((menuData) => { return menuData.filter(item => item.name !== 'test') })
   * @example 增加一些菜单 menuDataRender={(menuData) => { return menuData.concat({ path: '/test', name: '测试', icon: 'smile' }) }}
   * @example 修改菜单 menuDataRender={(menuData) => { return menuData.map(item => { if (item.name === 'test') { item.name = '测试' } return item }) }}
   * @example 打平数据 menuDataRender={(menuData) => { return menuData.reduce((pre, item) => { return pre.concat(item.children || []) }, []) }}
   */
  menuDataRender?: (menuData: MenuDataItem[]) => MenuDataItem[]
  /**
   * @name itemRender 处理每个面包屑的配置，需要直接返回 dom
   * @description (route: Route, params: any, routes: Array<Route>, paths: Array<string>) => React.ReactNode
   *
   * @example 设置 disabled： itemRender={(route, params, routes, paths) => { return <Button disabled>{route.breadcrumbName}</Button> }}
   * @example 拼接 path： itemRender={(route, params, routes, paths) => { return <a href={paths.join('/')}>{route.breadcrumbName}</a> }}
   */
  itemRender?: BreadcrumbProps['itemRender']
  formatMessage?: (message: MessageDescriptor) => string | undefined
  /**
   * @name disableMobile 是否禁用移动端模式
   *
   * @see disableMobile 有的管理系统不需要移动端模式，此属性设置为true即可
   * @example disableMobile={true}
   */
  disableMobile?: boolean
  /**
   * @name contentStyle  content 的样式
   *
   * @example 背景颜色为红色 contentStyle={{ backgroundColor: 'red '}}
   */
  contentStyle?: CSSProperties
  /**
   * @name breadcrumbProps PageHeader 的 BreadcrumbProps 配置，会透传下去
   */
  breadcrumbProps?: Omit<BreadcrumbProps, 'itemRender'> & LayoutBreadcrumbProps
  /** @name layout 的 水印的相关配置 */
  waterMarkProps?: WatermarkProps
  /**
   * @name errorBoundaryRender 错误处理组件
   *
   * @example errorBoundaryRender={MyErrorBoundary}
   */
  errorBoundaryRender?: ErrorBoundaryRender | false
  /**
   * @name  siderMenuType 侧边菜单的类型, menu.type 的快捷方式
   * @type "sub" | "group"
   * @example group
   */
  siderMenuType?: 'sub' | 'group'
  isChildrenLayout?: boolean
}
const _ProLayout = defineComponent<ProLayoutProps, {}, string, CustomSlotsType<
  SlotsRenderType & {
    default?: () => VueNode[]
  }
>>((props, { slots, attrs, expose }) => {
  const themeProps = computed(() => ({
    ...(props.navTheme !== undefined && { dark: props.navTheme === 'realDark' }),
    ...(props.compact !== undefined && { compact: props.compact }),
  }))
  const proLayoutRender = useProLayoutRender(slots, props)
  expose({})
  return () => {
    const { colorPrimary, prefixCls, token, logo } = props
    return (
      <AntdConfigProvider theme={colorPrimary ? { token: { colorPrimary } } : undefined}>
        <ProConfigProvider {...themeProps.value} token={token} prefixCls={prefixCls}>
          <BasicLayout {...attrs} {...props} {...proLayoutRender.value} logo={logo || <Logo />} v-slots={slots} />
        </ProConfigProvider>
      </AntdConfigProvider>
    )
  }
}, {
  name: 'ProLayout',
  inheritAttrs: false,
})

const ProLayout = _ProLayout as typeof _ProLayout & Plugin

ProLayout.install = (app: App) => {
  app.component(ProLayout.name!, ProLayout)
  return app
}

export default ProLayout
