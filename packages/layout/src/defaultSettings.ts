export type ContentWidth = 'Fluid' | 'Fixed'

export interface RenderSetting {
  headerRender?: false
  footerRender?: false
  menuRender?: false
  menuHeaderRender?: false
}
//  * @deprecated `layout="mix"` 仍会被接受，运行时按 `side` 处理，见 ProLayout 内注释

export interface PureSettings {
  /**
   * @name theme for nav menu
   *
   * @type  'realDark' | 'light' | 'dark'
   */
  navTheme?: 'realDark' | 'light' | 'dark'
  /**
   * @name layout 的布局方式
   * @type  'side' | 'top' | 'mix' | 'left'
   *
   * @example 顶部菜单 layout="top"
   * @example 侧边菜单 layout="side"
   * @example 顶栏一级菜单 + 侧栏子菜单：layout="side" 且 `splitMenus`，或用 `headerMenuRender` 自定义顶栏菜单
   */
  layout?: 'side' | 'top' | 'mix' | 'left'
  /** @name layout of content: `Fluid` or `Fixed`, only works when layout is top */
  contentWidth?: ContentWidth
  /**
   * @name compact 紧凑布局
   */
  compact?: boolean
  /** @name fixedHeader  固定头部 */
  fixedHeader?: boolean
  /** @name fixedSiderbar 固定侧边栏 */
  fixedSiderbar?: boolean
  /**
   * @name menu 相关的一些配置，可以配置菜单的行为
   *
   * @example 关闭菜单国际化  menu={ locale: false }
   * @example 默认打开所有的菜单 menu={ defaultOpenAll:true }
   * @example 使用 MenuGroup 来聚合菜单 menu={ mode: 'group' }
   * @example 取消自动关闭菜单 menu={ autoClose: false }
   * @example 忽略收起时自动关闭菜单 menu={ ignoreFlatMenu: true }
   */
  menu?: {
    /**
     *@name locale 菜单国际化的配置
     */
    locale?: boolean
    /**
     *@name hideMenuWhenCollapsed 折叠时隐藏菜单
     */
    hideMenuWhenCollapsed?: boolean
    /**
     * @name collapsedShowTitle 收起时也展示标题
     */
    collapsedShowTitle?: boolean
    /**
     * @name defaultOpenAll 默认打开所有的菜单
     */
    defaultOpenAll?: boolean
    /**
     * @name ignoreFlatMenu 是否忽略用户手动折叠过的菜单状态，如选择忽略，折叠按钮切换之后也可实现展开所有菜单
     */
    ignoreFlatMenu?: boolean

    /**
     * @name type 菜单聚合的模式
     */
    type?: 'sub' | 'group'
    /**
     * @name autoClose 取消自动关闭菜单
     */
    autoClose?: false
  }
  /**
   * 设置为 false，在 layout 中只展示 pageName，而不是 pageName - title
   *
   * @name Layout 的 title，也会显示在浏览器标签上
   */
  title?: string | false
  /**
   * Your custom iconfont Symbol script Url eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
   * 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理 Usage: https://github.com/ant-design/ant-design-pro/pull/3517
   */
  iconfontUrl?: string
  /** @name colorPrimary 主色 */
  colorPrimary?: string
  /** @name colorWeak 全局增加滤镜 */
  colorWeak?: boolean
  /**
   * 只在 mix 模式下生效
   *
   * @name splitMenus 切割菜单
   */
  splitMenus?: boolean
  /**
   * @name suppressSiderWhenMenuEmpty 在菜单为空时隐藏Sider
   */
  suppressSiderWhenMenuEmpty?: boolean
  /**
   * 侧边菜单模式
   */
  siderMenuType?: 'sub' | 'group'
  /**
   * @name fixedMultiTab 固定多页签
   */
  fixedMultiTab?: boolean
  /**
   * @name multiTab 多页签
   */
  multiTab?: boolean
}

export type ProSettings = PureSettings & RenderSetting

const defaultSettings: ProSettings = {
  navTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixedSiderbar: false,
  iconfontUrl: '',
  colorPrimary: '#1677FF',
  splitMenus: false,
  siderMenuType: 'sub',
  multiTab: false,
  fixedMultiTab: false,
}

export default defaultSettings
