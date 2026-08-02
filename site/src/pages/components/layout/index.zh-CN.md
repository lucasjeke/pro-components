---
category: Components
group: 布局
title: ProLayout
subtitle: 高级布局
cover: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
coverDark: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
---

ProLayout 提供中后台应用常用的页面框架能力：顶部栏、侧边菜单、内容区、页脚、面包屑、页面标题和运行时布局配置。它会根据路由数据自动生成菜单，并将页面上下文提供给 PageContainer、FooterToolbar 等组件。

ProLayout 支持 `side`、`top`、`mix` 和 `left` 四种布局形态。`left` 布局会将一级菜单固定在最左侧，二级菜单按当前一级菜单展开，适合导航层级较深且需要快速切换一级模块的系统。

## 何时使用 {#when-to-use}

- 需要搭建标准中后台应用外框时。
- 需要从路由数据自动生成菜单、面包屑和页面标题时。
- 需要在运行时切换布局、主题、固定 Header 或固定 Sider 时。
- 需要配合 PageContainer 统一页面标题、面包屑、内容区和页脚工具栏时。
- 需要通过 `headerRender`、`menuRender`、`menuHeaderRender` 等渲染函数定制布局局部区域时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="550">基础使用</demo>
  <demo src="./demo/multi-tab.vue" iframe="550">多标签</demo>
  <demo src="./demo/help.vue" iframe="360">高级帮助</demo>
</demo-group>

## API

### ProLayout {#prolayout}

> 所有以 `Render` 为后缀的方法都可以通过传入 `false` 来关闭对应区域渲染，也可以通过同名插槽进行定制。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 布局标题，会用于菜单头和浏览器标题 | `string \| false` | `Antdv Next Pro` | - |
| logo | 菜单头 Logo，支持图片地址、VNode、渲染函数或 `false` | `VueNode \| false` | 内置 Logo | - |
| layout | 布局形态 | `'side' \| 'top' \| 'mix' \| 'left'` | `'side'` | - |
| navTheme | 导航菜单主题 | `'light' \| 'dark' \| 'realDark'` | `'dark'` | - |
| contentWidth | 内容区宽度，仅在 `layout="top"` 时生效 | `'Fluid' \| 'Fixed'` | `'Fluid'` | - |
| compact | 是否启用紧凑布局 | `boolean` | `false` | - |
| fixedHeader | 是否固定 Header | `boolean` | `false` | - |
| fixedSiderbar | 是否固定侧边栏 | `boolean` | `false` | - |
| splitMenus | 是否拆分一级菜单和子菜单，主要用于 `mix` 布局 | `boolean` | `false` | - |
| suppressSiderWhenMenuEmpty | 菜单为空时是否隐藏 Sider | `boolean` | `false` | - |
| siderWidth | 侧边菜单宽度 | `number` | `256` | - |
| collapsedWidth | 侧边菜单收起宽度 | `number` | `64` | - |
| collapsed | 受控的侧边菜单收起状态 | `boolean` | - | - |
| defaultCollapsed | 默认收起状态 | `boolean` | - | - |
| fixedHeaderSiderWidth | 固定 Header 计算宽度时使用的侧边栏偏移量，通常由 `left` 布局内部计算 | `number` | - | - |
| breakpoint | 触发响应式收起的断点，设为 `false` 可禁用 | `Breakpoint \| false` | `'lg'` | - |
| disableMobile | 是否禁用移动端响应式布局 | `boolean` | `false` | - |
| pure | 简约模式，只提供上下文，不渲染布局外框 | `boolean` | `false` | - |
| loading | 布局加载状态，开启后只展示 Loading | `boolean` | `false` | - |
| location | 手动指定当前路由位置。通常无需设置，默认读取 Vue 应用实例上的 `$route`；未安装路由插件时可手动传入 | `RouterTypes['location']` | `$route` 或 `/` | - |
| route | 路由配置，`children` 会作为默认菜单数据 | `RouterTypes['route']` | - | - |
| menu | 菜单行为配置 | `MenuConfig` | - | - |
| menuData | 直接传入菜单数据。Vue 项目推荐在路由守卫或 store 中加载菜单并注册路由后传入 | `MenuDataItem[]` | - | - |
| menuProps | 透传给 `Menu` 的属性，参考 antdv-next Menu | `MenuProps` | - | - |
| mode | 菜单模式，通常由布局内部决定 | `MenuProps['mode']` | - | - |
| selectedKeys | 受控的菜单选中项 | `string[]` | - | - |
| openKeys | 受控的菜单展开项，传 `false` 可关闭展开控制 | `string[] \| false` | - | - |
| menuDataRender | 菜单数据渲染前的处理函数 | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - | - |
| postMenuData | 菜单数据渲染前的最终处理函数，不再进行国际化和路径拼接处理 | `(menuData?: MenuDataItem[]) => MenuDataItem[]` | - | - |
| formatMessage | 菜单国际化格式化函数 | `(message: MessageDescriptor) => string \| undefined` | - | - |
| breadcrumbRender | 自定义面包屑数据，返回 `false` 可隐藏面包屑 | `(routes: BreadcrumbProps['items']) => BreadcrumbProps['items'] \| false` | - | - |
| breadcrumbProps | 传递给 PageHeader 的面包屑配置 | `BreadcrumbProps & LayoutBreadcrumbProps` | - | - |
| itemRender | 自定义面包屑项渲染 | `BreadcrumbProps['itemRender']` | - | - |
| pageTitleRender | 自定义页面标题 | `(options) => string \| undefined \| false` | - | - |
| contentStyle | 内容区样式 | `CSSProperties` | - | - |
| bgLayoutImgList | 布局背景图片列表 | `BgLayoutImg[]` | - | - |
| colorPrimary | 主色 | `string` | `#1677FF` | - |
| colorWeak | 是否启用色弱模式 | `boolean` | `false` | - |
| iconfontUrl | 自定义 iconfont Symbol 脚本地址 | `string` | - | - |
| iconPrefixes | 菜单字符串图标的 iconfont 前缀 | `string` | `'icon-'` | - |
| token | Layout 组件级设计 Token | `ProTokenType['layout']` | - | - |
| stylish | 自定义 Header、Sider 样式生成函数 | `{ header?: GenerateStyle; sider?: GenerateStyle }` | - | - |
| avatarProps | 头像配置 | `AvatarPropsType` | - | - |
| appList | 跨站点导航列表 | `AppListProps` | - | - |
| itemClick | 跨站点导航列表项点击回调，存在时不会自动跳转 | `(item: AppItemProps, popoverRef: ShallowRef) => void` | - | - |
| links | 侧边菜单底部快捷链接 | `VueNode[] \| LinkItem[] \| false` | - | - |
| siderProps | 透传给 `LayoutSider` 的属性 | `SiderProps` | - | - |
| logoStyle | 菜单 Logo 区域样式 | `CSSProperties` | - | - |
| waterMarkProps | 水印配置 | `WatermarkProps` | - | - |
| errorBoundaryRender | 自定义错误边界 | `ErrorBoundaryRender \| false` | - | - |
| multiTabProps | 内置 MultiTab 多标签页配置，默认不启用；推荐新代码使用 | `MultiTabProps` | - | - |
| multiTab | 内置 MultiTab 多标签页兼容配置；建议迁移到 `multiTabProps` | `boolean \| MultiTabProps` | - | - |
| multiTabRender | 自定义 MultiTab 区域，优先级高于内置 MultiTab | `MultiTabRender \| false` | - | - |
| siderMenuType | 侧边菜单聚合模式，是 `menu.type` 的快捷方式 | `'sub' \| 'group'` | `'sub'` | - |
| isChildrenLayout | 是否作为子布局渲染 | `boolean` | - | - |
| headerRender | 自定义 Header，传 `false` 不渲染 Header | `HeaderRender \| false` | - | - |
| menuRender | 自定义菜单区域，传 `false` 不渲染菜单 | `MenuRender \| false` | - | - |
| menuHeaderRender | 自定义菜单头 Logo 和标题区域，传 `false` 不渲染 | `MenuHeaderRender \| false` | - | - |
| menuItemRender | 自定义叶子菜单项渲染 | `MenuItemRender \| false` | - | - |
| subMenuItemRender | 自定义父级菜单项渲染 | `SubMenuItemRender \| false` | - | - |
| menuContentRender | 自定义菜单内容区域 | `MenuContentRender \| false` | - | - |
| menuExtraRender | 自定义菜单头下方额外区域 | `MenuExtraRender \| false` | - | - |
| menuFooterRender | 自定义菜单底部区域 | `MenuFooterRender \| false` | - | - |
| collapsedButtonRender | 自定义菜单收起按钮，传 `false` 不渲染 | `CollapsedButtonRender \| false` | - | - |
| actionsRender | 自定义 Header 或 Sider 操作区 | `ActionsRender \| false` | - | - |
| appListRender | 自定义跨站点导航渲染 | `AppListRender \| false` | - | - |
| headerTitleRender | 自定义 Header 标题区域 | `HeaderTitleRender \| false` | - | - |
| headerContentRender | 自定义 Header 内容区域 | `HeaderContentRender \| false` | - | - |
| footerRender | 自定义页脚，传 `false` 不渲染页脚 | `FooterRender \| false` | - | - |
| pageHeaderRender | 自定义 PageContainer 的 PageHeader 渲染 | `PageHeaderRender \| false` | - | - |
| footerToolbarContentRender | 自定义 FooterToolbar 内容渲染 | `FooterToolbarContentRender` | - | - |

除上表外，ProLayout 还会通过 `menuProps` 透传 antdv-next Menu 的属性；其中 `openKeys`、`openChange`、`title` 已由 ProLayout 单独接管。

### menu {#menu}

`menu` 用于配置菜单展开行为、折叠行为和受控加载状态。异步菜单建议在 Vue Router 路由守卫或 store 中加载，ProLayout 只负责渲染已经准备好的 `route.children` 或 `menuData`。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| locale | 是否启用菜单国际化 | `boolean` | `true` | - |
| loading | 菜单加载状态 | `boolean` | `false` | - |
| defaultOpenAll | 默认展开所有菜单项，仅在布局挂载前生效 | `boolean` | `false` | - |
| autoClose | 选中菜单后是否自动关闭移动端菜单，传 `false` 可关闭 | `boolean` | `true` | - |
| ignoreFlatMenu | 是否忽略用户手动折叠菜单的状态 | `boolean` | `false` | - |
| hideMenuWhenCollapsed | 收起时是否完全隐藏菜单内容 | `boolean` | `false` | - |
| collapsedShowTitle | 菜单收起时是否展示标题 | `boolean` | `false` | - |
| type | 菜单聚合模式 | `'sub' \| 'group'` | - | - |

### SettingDrawer {#settingdrawer}

SettingDrawer 是 ProLayout 的可视化配置面板，适合在演示站点或需要运行时配置布局的系统中使用。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| settings | 当前布局配置 | `Partial<ProSettings>` | `defaultSettings` | - |
| collapsed | 是否收起配置面板 | `boolean` | - | - |
| colorList | 主题色候选列表，传 `false` 可隐藏主题色选择 | `{ key: string; color: string; title?: string }[] \| false` | 内置色板 | - |
| hideHintAlert | 是否隐藏提示说明 | `boolean` | `false` | - |
| hideCopyButton | 是否隐藏复制配置按钮 | `boolean` | `false` | - |

### 事件 {#events}

事件通过 Vue 事件语法注册，例如 `@collapse`、`@menu-header-click`、`@update:collapsed`。

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| pageChange | 页面位置变化时触发 | `(location?: RouterTypes['location']) => void` | - |
| collapse | 侧边菜单收起或展开时触发 | `(collapsed: boolean) => void` | - |
| openChange | 菜单展开项变化时触发 | `(openKeys?: Key[] \| false) => void` | - |
| select | 菜单选中项变化时触发 | `(selectedKeys: Key[]) => void` | - |
| menuHeaderClick | 菜单头点击事件 | `(e: MouseEvent) => void` | - |
| itemClick | 跨站点导航列表项点击事件 | `(item: AppItemProps, popoverRef: ShallowRef) => void` | - |
| SettingDrawer: settingChange | SettingDrawer 配置变化时触发 | `(settings: Partial<ProSettings>) => void` | - |
| SettingDrawer: collapse | SettingDrawer 展开收起变化时触发 | `(collapsed: boolean) => void` | - |
| SettingDrawer: update:collapsed | `v-model:collapsed` 更新事件 | `(collapsed: boolean) => void` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| headerRender | 自定义 Header 渲染 | `HeaderRender` | - |
| menuRender | 自定义菜单区域渲染 | `MenuRender` | - |
| menuHeaderRender | 自定义菜单头渲染 | `MenuHeaderRender` | - |
| headerTitleRender | 自定义 Header 标题渲染 | `HeaderTitleRender` | - |
| headerContentRender | 自定义 Header 内容渲染 | `HeaderContentRender` | - |
| actionsRender | 自定义操作区渲染 | `ActionsRender` | - |
| footerRender | 自定义页脚渲染 | `FooterRender` | - |
| multiTabRender | 自定义 MultiTab 区域渲染 | `MultiTabRender` | - |
| footerToolbarContentRender | 自定义 FooterToolbar 内容渲染 | `FooterToolbarContentRender` | - |
| collapsedButtonRender | 自定义菜单收起按钮渲染 | `CollapsedButtonRender` | - |
| errorBoundaryRender | 自定义错误边界渲染 | `ErrorBoundaryRender` | - |
| appListRender | 自定义跨站点导航列表渲染 | `AppListRender` | - |
| menuItemRender | 自定义叶子菜单项渲染 | `MenuItemRender` | - |
| subMenuItemRender | 自定义父级菜单项渲染 | `SubMenuItemRender` | - |
| menuContentRender | 自定义菜单内容区域渲染 | `MenuContentRender` | - |
| menuFooterRender | 自定义菜单底部区域渲染 | `MenuFooterRender` | - |
| menuExtraRender | 自定义菜单头下方额外区域渲染 | `MenuExtraRender` | - |
| pageHeaderRender | 自定义 PageContainer 的 PageHeader 渲染 | `PageHeaderRender` | - |

## 主题变量（Design Token）{#theme-variables}

Token 是设计系统的基本元素，可以通过 `token` 属性或 ProConfigProvider 修改 ProLayout 的 Header、Sider、内容区和菜单颜色。

<ComponentTokenTable component="ProLayout"></ComponentTokenTable>

## FAQ {#faq}

### 如何选择布局形态？ {#layout-mode}

- `side`：最常见的中后台侧边菜单布局。
- `top`：导航项较少、希望内容区横向居中的顶部导航布局。
- `mix`：顶部一级导航配合侧边子菜单，适合一级模块较少但二级页面较多的系统。
- `left`：一级菜单固定在最左侧，二级菜单在旁边展开，适合需要频繁切换一级业务模块的系统。

### 如何隐藏不需要的区域？ {#custom-layout}

ProLayout 提供了一组 `xxxRender` API 来控制各个区域。传入函数可以自定义渲染，传入 `false` 可以关闭对应区域。

- `headerRender` 可以自定义或关闭顶栏。
- `footerRender` 可以自定义或关闭页脚。
- `menuRender` 可以自定义或关闭菜单区域。
- `menuHeaderRender` 可以自定义或关闭菜单头区域。
- `menuExtraRender` 可以在菜单头和菜单之间增加额外内容。
- `collapsedButtonRender` 可以自定义或关闭菜单折叠按钮。

![setting-drawer-render](https://gw.alipayobjects.com/zos/antfincdn/mCXDkK2pJ0/60298863-F5A5-4af2-923A-13EF912DB0E1.png)
