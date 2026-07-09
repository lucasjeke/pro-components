---
category: Components
group: Layout
title: ProLayout
cover: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
coverDark: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
---

ProLayout provides the standard application shell for admin systems: header, side navigation, content area, footer, breadcrumbs, page title, and runtime layout settings. It can generate menus from route data and share layout context with PageContainer, FooterToolbar, and other Pro components.

ProLayout supports four layout modes: `side`, `top`, `mix`, and `left`. The `left` layout keeps the first-level menu in a narrow rail and shows the second-level menu next to it, which is useful for systems with deep navigation and frequent module switching.

## When To Use {#when-to-use}

- When you need a standard admin application shell.
- When menus, breadcrumbs, and page titles should be generated from route data.
- When users need to switch layout mode, theme, fixed header, or fixed sider at runtime.
- When PageContainer should share page title, breadcrumb, content, and footer toolbar context.
- When parts of the layout need to be customized with `headerRender`, `menuRender`, `menuHeaderRender`, or other render hooks.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="550">Basic</demo>
  <demo src="./demo/multi-tab.vue" iframe="550">MultiTab</demo>
  <demo src="./demo/help.vue" iframe="360">Help</demo>
</demo-group>

## API

### ProLayout {#prolayout}

> All props ending with `Render` can be set to `false` to skip rendering that region. They can also be customized through slots with the same names.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Layout title, used by the menu header and document title | `string \| false` | `Antdv Next Pro` | - |
| logo | Logo in the menu header. Supports image URL, VNode, render function, or `false` | `VueNode \| false` | Built-in Logo | - |
| layout | Layout mode | `'side' \| 'top' \| 'mix' \| 'left'` | `'side'` | - |
| navTheme | Navigation theme | `'light' \| 'dark' \| 'realDark'` | `'dark'` | - |
| contentWidth | Content width, only works with `layout="top"` | `'Fluid' \| 'Fixed'` | `'Fluid'` | - |
| compact | Whether to enable compact layout | `boolean` | `false` | - |
| fixedHeader | Whether to fix the header | `boolean` | `false` | - |
| fixedSiderbar | Whether to fix the sider | `boolean` | `false` | - |
| splitMenus | Whether to split first-level and child menus, mainly for `mix` layout | `boolean` | `false` | - |
| suppressSiderWhenMenuEmpty | Whether to hide the sider when menu data is empty | `boolean` | `false` | - |
| siderWidth | Width of the side menu | `number` | `256` | - |
| collapsedWidth | Width of the collapsed side menu | `number` | `64` | - |
| collapsed | Controlled collapsed state of the side menu | `boolean` | - | - |
| defaultCollapsed | Default collapsed state | `boolean` | - | - |
| fixedHeaderSiderWidth | Sider offset used when calculating fixed Header width. Usually computed internally by `left` layout | `number` | - | - |
| breakpoint | Responsive collapse breakpoint. Set to `false` to disable it | `Breakpoint \| false` | `'lg'` | - |
| disableMobile | Disable mobile responsive mode | `boolean` | `false` | - |
| pure | Pure mode. Provides context without rendering the layout shell | `boolean` | `false` | - |
| loading | Layout loading state. When enabled, only the loading view is rendered | `boolean` | `false` | - |
| location | Manually specify current route location. Usually unnecessary because ProLayout reads `$route` from the Vue app instance; pass it manually when no router plugin is installed | `RouterTypes['location']` | `$route` or `/` | - |
| route | Route config. `children` is used as default menu data | `RouterTypes['route']` | - | - |
| menu | Menu behavior config | `MenuConfig` | - | - |
| menuData | Menu data passed directly. In Vue apps, load menus and register routes in router guards or stores before passing data to ProLayout | `MenuDataItem[]` | - | - |
| menuProps | Props passed to `Menu`. See antdv-next Menu | `MenuProps` | - | - |
| mode | Menu mode, usually controlled by the layout internally | `MenuProps['mode']` | - | - |
| selectedKeys | Controlled selected menu keys | `string[]` | - | - |
| openKeys | Controlled open menu keys. Set to `false` to disable open-key control | `string[] \| false` | - | - |
| menuDataRender | Transform menu data before rendering | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - | - |
| postMenuData | Final menu data transform before rendering. It skips later i18n and path processing | `(menuData?: MenuDataItem[]) => MenuDataItem[]` | - | - |
| formatMessage | Menu i18n formatter | `(message: MessageDescriptor) => string \| undefined` | - | - |
| breadcrumbRender | Customize breadcrumb data. Return `false` to hide breadcrumbs | `(routes: BreadcrumbProps['items']) => BreadcrumbProps['items'] \| false` | - | - |
| breadcrumbProps | Breadcrumb props passed to PageHeader | `BreadcrumbProps & LayoutBreadcrumbProps` | - | - |
| itemRender | Custom breadcrumb item rendering | `BreadcrumbProps['itemRender']` | - | - |
| pageTitleRender | Customize page title | `(options) => string \| undefined \| false` | - | - |
| contentStyle | Content area style | `CSSProperties` | - | - |
| bgLayoutImgList | Background image list for the layout | `BgLayoutImg[]` | - | - |
| colorPrimary | Primary color | `string` | `#1677FF` | - |
| colorWeak | Whether to enable color-weak mode | `boolean` | `false` | - |
| iconfontUrl | Custom iconfont Symbol script URL | `string` | - | - |
| iconPrefixes | Iconfont prefix for string menu icons | `string` | `'icon-'` | - |
| token | Component-level design token for Layout | `ProTokenType['layout']` | - | - |
| stylish | Custom style generators for Header and Sider | `{ header?: GenerateStyle; sider?: GenerateStyle }` | - | - |
| avatarProps | Avatar config | `AvatarPropsType` | - | - |
| appList | Cross-site app list | `AppListProps` | - | - |
| itemClick | Callback when an app-list item is clicked. When provided, automatic navigation is skipped | `(item: AppItemProps, popoverRef: ShallowRef) => void` | - | - |
| links | Shortcut links in the side menu footer | `VueNode[] \| LinkItem[] \| false` | - | - |
| siderProps | Props passed to `LayoutSider` | `SiderProps` | - | - |
| logoStyle | Style of the menu logo area | `CSSProperties` | - | - |
| waterMarkProps | Watermark config | `WatermarkProps` | - | - |
| errorBoundaryRender | Custom error boundary | `ErrorBoundaryRender \| false` | - | - |
| multiTab | Built-in MultiTab config. Disabled by default | `boolean \| MultiTabProps` | - | - |
| multiTabRender | Custom MultiTab area. Takes priority over built-in `multiTab` | `MultiTabRender \| false` | - | - |
| siderMenuType | Side menu aggregation mode, shorthand for `menu.type` | `'sub' \| 'group'` | `'sub'` | - |
| isChildrenLayout | Whether to render as a child layout | `boolean` | - | - |
| headerRender | Customize Header. Set to `false` to hide Header | `HeaderRender \| false` | - | - |
| menuRender | Customize menu region. Set to `false` to hide menu | `MenuRender \| false` | - | - |
| menuHeaderRender | Customize menu logo and title. Set to `false` to hide it | `MenuHeaderRender \| false` | - | - |
| menuItemRender | Custom leaf menu item rendering | `MenuItemRender \| false` | - | - |
| subMenuItemRender | Custom parent menu item rendering | `SubMenuItemRender \| false` | - | - |
| menuContentRender | Customize menu content | `MenuContentRender \| false` | - | - |
| menuExtraRender | Extra region below menu header | `MenuExtraRender \| false` | - | - |
| menuFooterRender | Custom menu footer | `MenuFooterRender \| false` | - | - |
| collapsedButtonRender | Custom collapsed button. Set to `false` to hide it | `CollapsedButtonRender \| false` | - | - |
| actionsRender | Custom action area in Header or Sider | `ActionsRender \| false` | - | - |
| appListRender | Custom cross-site app list rendering | `AppListRender \| false` | - | - |
| headerTitleRender | Custom Header title region | `HeaderTitleRender \| false` | - | - |
| headerContentRender | Custom Header content region | `HeaderContentRender \| false` | - | - |
| footerRender | Custom footer. Set to `false` to hide footer | `FooterRender \| false` | - | - |
| pageHeaderRender | Custom PageHeader rendering for PageContainer | `PageHeaderRender \| false` | - | - |
| footerToolbarContentRender | Custom FooterToolbar content rendering | `FooterToolbarContentRender` | - | - |

In addition to the table above, ProLayout can pass antdv-next Menu props through `menuProps`; `openKeys`, `openChange`, and `title` are managed by ProLayout itself.

### menu {#menu}

`menu` controls open behavior, collapsed behavior, and controlled loading state. For async menus, load data in Vue Router guards or stores; ProLayout only renders prepared `route.children` or `menuData`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| locale | Whether to enable menu i18n | `boolean` | `true` | - |
| loading | Menu loading state | `boolean` | `false` | - |
| defaultOpenAll | Expand all menu items by default. Only works before layout mount | `boolean` | `false` | - |
| autoClose | Whether selecting a menu item auto-closes the mobile menu. Set to `false` to disable it | `boolean` | `true` | - |
| ignoreFlatMenu | Ignore menu state collapsed manually by users | `boolean` | `false` | - |
| hideMenuWhenCollapsed | Completely hide menu content when collapsed | `boolean` | `false` | - |
| collapsedShowTitle | Show title when menu is collapsed | `boolean` | `false` | - |
| type | Menu aggregation mode | `'sub' \| 'group'` | - | - |

### SettingDrawer {#settingdrawer}

SettingDrawer is a visual settings panel for ProLayout. It is useful for demos or systems that allow users to configure layout at runtime.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| settings | Current layout settings | `Partial<ProSettings>` | `defaultSettings` | - |
| collapsed | Whether the settings panel is collapsed | `boolean` | - | - |
| colorList | Theme color candidates. Set to `false` to hide color selection | `{ key: string; color: string; title?: string }[] \| false` | Built-in palette | - |
| hideHintAlert | Hide the hint alert | `boolean` | `false` | - |
| hideCopyButton | Hide the copy settings button | `boolean` | `false` | - |

### Events {#events}

Events are registered with Vue event syntax, such as `@collapse`, `@menu-header-click`, and `@update:collapsed`.

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| pageChange | Triggered when page location changes | `(location?: RouterTypes['location']) => void` | - |
| collapse | Triggered when the side menu collapses or expands | `(collapsed: boolean) => void` | - |
| openChange | Triggered when menu open keys change | `(openKeys?: Key[] \| false) => void` | - |
| select | Triggered when selected menu keys change | `(selectedKeys: Key[]) => void` | - |
| menuHeaderClick | Triggered when the menu header is clicked | `(e: MouseEvent) => void` | - |
| itemClick | Triggered when an app-list item is clicked | `(item: AppItemProps, popoverRef: ShallowRef) => void` | - |
| SettingDrawer: settingChange | Triggered when SettingDrawer settings change | `(settings: Partial<ProSettings>) => void` | - |
| SettingDrawer: collapse | Triggered when SettingDrawer collapses or expands | `(collapsed: boolean) => void` | - |
| SettingDrawer: update:collapsed | `v-model:collapsed` update event | `(collapsed: boolean) => void` | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| headerRender | Custom Header rendering | `HeaderRender` | - |
| menuRender | Custom menu rendering | `MenuRender` | - |
| menuHeaderRender | Custom menu header rendering | `MenuHeaderRender` | - |
| headerTitleRender | Custom Header title rendering | `HeaderTitleRender` | - |
| headerContentRender | Custom Header content rendering | `HeaderContentRender` | - |
| actionsRender | Custom action area rendering | `ActionsRender` | - |
| footerRender | Custom footer rendering | `FooterRender` | - |
| multiTabRender | Custom MultiTab area rendering | `MultiTabRender` | - |
| footerToolbarContentRender | Custom FooterToolbar content rendering | `FooterToolbarContentRender` | - |
| collapsedButtonRender | Custom collapsed button rendering | `CollapsedButtonRender` | - |
| errorBoundaryRender | Custom error boundary rendering | `ErrorBoundaryRender` | - |
| appListRender | Custom app-list rendering | `AppListRender` | - |
| menuItemRender | Custom leaf menu item rendering | `MenuItemRender` | - |
| subMenuItemRender | Custom parent menu item rendering | `SubMenuItemRender` | - |
| menuContentRender | Custom menu content rendering | `MenuContentRender` | - |
| menuFooterRender | Custom menu footer rendering | `MenuFooterRender` | - |
| menuExtraRender | Custom extra region below menu header | `MenuExtraRender` | - |
| pageHeaderRender | Custom PageHeader rendering for PageContainer | `PageHeaderRender` | - |

## Design Token {#theme-variables}

Design Token is the basic element of the design system. You can customize Header, Sider, content, and menu colors through the `token` prop or ProConfigProvider.

<ComponentTokenTable component="ProLayout"></ComponentTokenTable>

## FAQ {#faq}

### How to choose a layout mode? {#layout-mode}

- `side`: the most common side navigation layout for admin systems.
- `top`: top navigation layout for a small number of navigation items and centered content.
- `mix`: first-level navigation in the header with child menus in the sider.
- `left`: first-level menu fixed in the left rail with the second-level menu expanded beside it.

### How to hide regions that are not needed? {#custom-layout}

ProLayout provides a group of `xxxRender` APIs for controlling layout regions. Pass a function to customize rendering, or pass `false` to hide the region.

- `headerRender` customizes or hides the header.
- `footerRender` customizes or hides the footer.
- `menuRender` customizes or hides the menu region.
- `menuHeaderRender` customizes or hides the menu header.
- `menuExtraRender` adds extra content between the menu header and menu list.
- `collapsedButtonRender` customizes or hides the menu collapse button.

![setting-drawer-render](https://gw.alipayobjects.com/zos/antfincdn/mCXDkK2pJ0/60298863-F5A5-4af2-923A-13EF912DB0E1.png)
