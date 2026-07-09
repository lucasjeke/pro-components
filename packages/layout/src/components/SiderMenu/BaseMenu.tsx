import type { ProTokenType } from '@antdv-next1/pro-provider'
import type { Key, WithFalse } from '@antdv-next1/pro-utils'
import type { MenuProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { ItemType } from 'antdv-next/dist/menu/interface'
import type { ConcreteComponent, DefineSetupFnComponent, VNode } from 'vue'
import type { PureSettings } from '../../defaultSettings'
import type { MenuItemRender, SubMenuItemRender } from '../../RenderTypings'
import type { MenuDataItem, MessageDescriptor, RouterTypes } from '../../typing'
import type { PrivateSiderMenuProps } from './SiderMenu'
import { isBrowser, isImg, isUrl, useEffect, useMountMergeState } from '@antdv-next1/pro-utils'
import { createFromIconfontCN } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Menu } from 'antdv-next'
import toList from 'antdv-next/dist/_util/toList'
import { computed, defineComponent, Fragment, h, isVNode, resolveComponent, toRef } from 'vue'
import defaultSettings from '../../defaultSettings'
import { getOpenKeysFromMenuData } from '../../utils'
import { useStyle } from './style/menu'

export type BaseMenuProps = {
  defaultCollapsed?: boolean
  collapsed?: boolean
  isMobile?: boolean
  onOpenChange?: (openKeys?: Key[] | false) => void
  menuData?: MenuDataItem[]
  onCollapse?: (collapsed: boolean) => void
  openKeys?: string[] | false
  mode?: MenuProps['mode']
  /**
   * @name menuProps 要给菜单的props, 参考ant-menu的属性
   */
  menuProps?: MenuProps
  /**
   * @name menuItemRender 处理菜单的 props，可以复写菜单的点击功能，一般结合 VueRouter 框架使用
   * @see 非子级的菜单要使用 subMenuItemRender 来处理
   *
   * @example 使用 a 标签 menuItemRender={(item, defaultDom) => { return <a onClick={()=> router.push(item.path) }>{defaultDom}</a> }}
   * @example 使用 Link 标签 menuItemRender={(item, defaultDom) => { return <RouterLink to={item.path}>{defaultDom}</RouterLink> }}
   */
  menuItemRender?: MenuItemRender | false

  /**
   * @name subMenuItemRender 处理父级菜单的 props，可以复写菜单的点击功能，一般用于埋点
   * @see 子级的菜单要使用 menuItemRender 来处理
   *
   * @example 使用 a 标签跳转到特殊的地址 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> router.push(item.path) }>{defaultDom}</a> }}
   * @example 增加埋点 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> log.click(item.name) }>{defaultDom}</a> }}
   */
  subMenuItemRender?: SubMenuItemRender | false
  iconPrefixes?: string
  formatMessage?: (message: MessageDescriptor) => string | undefined
  /**
   * @name postMenuData 处理 menuData 的方法，与 menuDataRender 不同，postMenuData处理完成后会直接渲染，不再进行国际化和拼接处理
   *
   * @example 增加菜单图标 postMenuData={(menuData) => { return menuData.map(item => { return { ...item, icon: <Icon type={item.icon} /> } }) }}
   */
  postMenuData?: (menusData?: MenuDataItem[]) => MenuDataItem[]
  onSelect?: (selectedKeys: Key[]) => void
} & Partial<RouterTypes>
& Omit<MenuProps, 'openKeys' | 'onOpenChange' | 'title'>
& Partial<PureSettings>

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
})

function isDefineSetupFnComponentIcon(icon: VueNode | DefineSetupFnComponent<Record<string, any>>) {
  return typeof icon === 'boolean' || typeof icon === 'string' || typeof icon === 'number' || icon === null || icon === undefined
}
// Allow menu.js config icon as string or VueNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: '/favicon.png',
//   icon: <Icon type="setting" />,
export function getIcon(icon: VueNode | DefineSetupFnComponent<Record<string, any>>, iconPrefixes: string = 'icon-', className: string) {
  if (!icon) {
    return null
  }
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return <img width={16} key={icon} src={icon} alt="icon" class={className} />
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />
    }
    const DynamicIcon = resolveComponent(icon as string)
    return typeof DynamicIcon === 'function' && h(DynamicIcon)
  }
  if (isVNode(icon)) {
    return icon
  }
  return typeof icon === 'function' ? h(icon) : icon
}

function getMenuTitleSymbol(title: VueNode) {
  if (title && typeof title === 'string') {
    return title.substring(0, 1).toUpperCase()
  }
  return null
}

class MenuUtil {
  props: BaseMenuProps & {
    token?: ProTokenType
    menuRenderType?: 'header' | 'sider'
    baseClassName: string
    hashId: string
    cssVarCls: string
  }

  RouterLink: ConcreteComponent | string
  constructor(
    props: BaseMenuProps & {
      menuRenderType?: 'header' | 'sider'
      baseClassName: string
      hashId: string
      cssVarCls: string
    },
  ) {
    this.props = props
    this.RouterLink = resolveComponent('RouterLink')
  }

  getNavMenuItems = (menusData: MenuDataItem[] = [], level: number, noGroupLevel: number): ItemType[] =>
    menusData
      .map(item => this.getSubMenuOrItem(item, level, noGroupLevel))
      .filter(item => item)
      .flat(1)

  /** Get SubMenu or Item */
  getSubMenuOrItem = (item: MenuDataItem, level: number, noGroupLevel: number): ItemType | ItemType[] => {
    const { baseClassName, collapsed, menu, subMenuItemRender, iconPrefixes, layout } = this.props

    const isGroup = menu?.type === 'group' && layout !== 'top'

    // if local is true formatMessage all name。
    const intlTitle = this.getIntlTitle(item)

    const children = item?.children

    const menuType = isGroup && level === 0 ? ('group' as const) : undefined

    // 如果没有 icon 在收起的时候用首字母代替
    if (Array.isArray(children) && children.length > 0) {
      /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
      const hasIcon = level === 0 || (isGroup && level === 1)
      const icon = !hasIcon ? null : getIcon(item.meta?.icon, iconPrefixes, classNames(`${baseClassName}-icon`, this.props.hashId, this.props.cssVarCls))
      const defaultIcon = collapsed && hasIcon ? getMenuTitleSymbol(intlTitle) : null

      const defaultTitle
        = !isGroup || (isGroup && collapsed) || !menuType
          ? intlTitle
          : h(
              'div',
              {
                class: classNames(`${baseClassName}-item-title`, this.props?.hashId, this.props.cssVarCls, {
                  [`${baseClassName}-item-title-collapsed`]: collapsed,
                  [`${baseClassName}-item-title-collapsed-level-${noGroupLevel}`]: collapsed,
                  [`${baseClassName}-group-item-title`]: menuType === 'group',
                  [`${baseClassName}-item-collapsed-show-title`]: menu?.collapsedShowTitle && collapsed,
                }),
              },
              [
                h(
                  'span',
                  {
                    class: classNames(`${baseClassName}-item-icon`, this.props?.hashId, this.props.cssVarCls),
                  },
                  !icon && defaultIcon ? defaultIcon : isDefineSetupFnComponentIcon(icon) ? [icon] : h(icon),
                ),
                h(
                  'span',
                  {
                    class: classNames(`${baseClassName}-item-text`, this.props?.hashId, this.props.cssVarCls),
                  },
                  intlTitle,
                ),
              ],
            )
      const menuItemTitle = subMenuItemRender
        ? subMenuItemRender({
            item: { ...item, isUrl: false },
            dom: <>{defaultTitle}</>,
            props: this.props,
          })
        : defaultTitle
      // 如果收起来，没有子菜单了，就不需要展示 group，所以 level 不增加
      if (isGroup && level === 0 && collapsed) {
        return this.getNavMenuItems(children, level + 1, level)
      }
      const childrenList = this.getNavMenuItems(children, level + 1, isGroup && level === 0 && collapsed ? level : level + 1)
      return [
        {
          type: menuType,
          key: item.key! || item.path!,
          ...(isGroup && menuType === 'group' ? {} : { icon: () => icon || defaultIcon }),
          label: <>{menuItemTitle}</>,
          onClick: isGroup ? undefined : item.onTitleClick,
          children: childrenList,
        },
        isGroup && level === 0
          ? {
              type: 'divider',
              class: classNames(`${baseClassName}-divider`, this.props.hashId, this.props.cssVarCls),
              key: `${item.key! || item.path!}-group-divider`,
            }
          : undefined,
      ].filter(Boolean) as ItemType[]
    }
    const menuItem = this.getMenuItem(item, level, noGroupLevel)
    return {
      class: classNames(`${baseClassName}-menu-item`, this.props.hashId, this.props.cssVarCls),
      disabled: item.disabled,
      key: item.key! || item.path!,
      onClick: item.onTitleClick || (toList(menuItem.label)[0] as VNode<any, any, { onClick: () => void }>)?.props?.onClick,
      ...menuItem,
    } as ItemType
  }

  /**
   *
   * @memberof SiderMenu
   */
  getMenuItem = (item: MenuDataItem, level: number, noGroupLevel: number) => {
    const { menuItemRender, iconPrefixes, baseClassName, menu, layout, collapsed, location = { path: '/' }, onCollapse, isMobile } = this.props
    const menuItemTitle = this.getIntlTitle(item)
    const itemPath = this.conversionPath(item.path || '/')
    const isGroup = menu?.type === 'group' && layout !== 'top'
    /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
    const hasIcon = level === 0 || (isGroup && level === 1)
    const icon = !hasIcon ? null : getIcon(item.meta?.icon, iconPrefixes, classNames(`${baseClassName}-icon`, this.props?.hashId, this.props.cssVarCls))
    // 如果没有 icon 在收起的时候用首字母代替
    const defaultIcon = collapsed && hasIcon ? getMenuTitleSymbol(menuItemTitle) : null

    const isHttpUrl = isUrl(itemPath)
    const meta = { ...item.meta }
    const target = (meta.target || null) as string | null
    const CustomTag = (target && 'a') || this.RouterLink
    const attrs = isHttpUrl || target ? { href: item.path, target } : {}
    const props = { to: { name: item.name, ...item.meta } }
    let defaultTitle = h(Fragment, null, [h('span', { class: classNames(`${baseClassName}-item-text`, this.props?.hashId, this.props.cssVarCls) }, menuItemTitle)])
    if ((typeof CustomTag !== 'string' && CustomTag.name === 'RouterLink') || (typeof CustomTag === 'string' && CustomTag === 'a')) {
      defaultTitle = h(
        CustomTag,
        {
          ...attrs,
          ...(CustomTag === 'a' ? {} : props),
          key: itemPath,
          class: classNames(`${baseClassName}-item-title`, this.props?.hashId, this.props.cssVarCls, {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${noGroupLevel}`]: collapsed,
            [`${baseClassName}-item-collapsed-show-title`]: menu?.collapsedShowTitle && collapsed,
          }),
        },
        typeof CustomTag === 'string' && CustomTag === 'a'
          ? h(
              'span',
              {
                class: classNames(`${baseClassName}-item-text`, this.props?.hashId, this.props.cssVarCls),
              },
              menuItemTitle,
            )
          : () =>
              h(
                'span',
                {
                  class: classNames(`${baseClassName}-item-text`, this.props?.hashId, this.props.cssVarCls),
                },
                menuItemTitle,
              ),
      )
    }
    if (menuItemRender) {
      defaultTitle = h(
        'span',
        {
          class: classNames(`${baseClassName}-item-text`, this.props?.hashId, this.props.cssVarCls),
        },
        menuItemTitle,
      )
      const renderItemProps = {
        ...item,
        isUrl: isHttpUrl,
        itemPath,
        isMobile,
        replace: itemPath === location.path,
        onClick: () => onCollapse && onCollapse(true),
        children: undefined,
      }
      const menuItemLabel = menuItemRender({
        item: renderItemProps,
        dom: defaultTitle,
        props: this.props,
      })
      return {
        icon: () => icon || defaultIcon,
        label: menuItemLabel,
      }
    }

    return {
      icon: () => icon || defaultIcon,
      label: defaultTitle,
    }
  }

  getIntlTitle = ({ meta }: MenuDataItem) => {
    const { menu, formatMessage } = this.props
    const { title, locale } = meta!

    if (locale && menu?.locale !== false) {
      return formatMessage?.({
        id: locale,
        defaultMessage: title,
      })
    }
    return title
  }

  conversionPath = (path: string) => {
    if (path && path.startsWith('http')) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }
}
/**
 * 生成openKeys 的对象，因为设置了openKeys 就会变成受控，所以需要一个空对象
 *
 */
function getOpenKeysProps(openKeys: WithFalse<string[]>, { layout, collapsed }: BaseMenuProps): {
  openKeys?: undefined | string[]
} {
  let openKeysProps = {}

  if (openKeys && !collapsed && ['side', 'mix', 'left'].includes(layout || 'mix')) {
    openKeysProps = {
      openKeys,
    }
  }
  return openKeysProps
}

const BaseMenu = defineComponent<BaseMenuProps & PrivateSiderMenuProps>((props = defaultSettings, { attrs }) => {
  const baseClassName = computed(() => `${props.prefixCls}-base-menu-${props.mode}`)
  const [defaultOpenAll, setDefaultOpenAll] = useMountMergeState(props.menu?.defaultOpenAll, {
    value: toRef(props.menu!, 'defaultOpenAll'),
  })
  const [openKeys, setOpenKeys] = useMountMergeState(
    () => {
      if (props.menu?.defaultOpenAll) {
        return getOpenKeysFromMenuData(props.menuData) || []
      }
      if (props.openKeys === false) {
        return false
      }
      return []
    },
    {
      value: toRef(props, 'openKeys'),
      onChange: props.onOpenChange,
    },
  )

  const [selectedKeys, setSelectedKeys] = useMountMergeState<string[] | undefined>([], {
    value: toRef(props, 'selectedKeys'),
    onChange: !props.onSelect
      ? undefined
      : (keys) => {
          if (props.onSelect && keys) {
            props.onSelect(keys)
          }
        },
  })

  useEffect(() => {
    if (props.menu?.defaultOpenAll || props.openKeys === false) {
      return
    }
    if (props.matchMenuKeys) {
      setOpenKeys(props.matchMenuKeys)
      setSelectedKeys(props.matchMenuKeys)
    }
  }, [() => props.matchMenuKeys?.join('-')])

  useEffect(() => {
    if (props.matchMenuKeys) {
      if (props.matchMenuKeys?.join('-') !== (selectedKeys.value || []).join('-')) {
        setSelectedKeys(props.matchMenuKeys)
      }
    }
    if (!defaultOpenAll.value && props.openKeys !== false && props.matchMenuKeys?.join('-') !== (openKeys.value || []).join('-')) {
      let newKeys: string[] | false = props.matchMenuKeys!
      // 如果不自动关闭，我需要把 openKeys 放进去
      if (props.menu?.autoClose === false) {
        newKeys = Array.from(new Set([...props.matchMenuKeys!, ...(openKeys.value || [])]))
      }
      setOpenKeys(newKeys)
    }
    else if (props.menu?.ignoreFlatMenu && defaultOpenAll.value) {
      // 忽略用户手动折叠过的菜单状态，折叠按钮切换之后也可实现默认展开所有菜单
      setOpenKeys(getOpenKeysFromMenuData(props.menuData))
    }
    else {
      setDefaultOpenAll(false)
    }
  }, [() => props.matchMenuKeys?.join('-')])

  useEffect(() => {
    // reset IconFont
    if (props.iconfontUrl) {
      IconFont = createFromIconfontCN({
        scriptUrl: props.iconfontUrl,
      })
    }
  }, [() => props.iconfontUrl])

  const openKeysProps = computed(() => getOpenKeysProps(openKeys.value!, props))
  const [hashId, cssVarCls] = useStyle(baseClassName, props.mode)

  const finallyData = computed(() => (props.postMenuData ? props.postMenuData(props.menuData) : props.menuData))

  return () => {
    const { mode, collapsed, theme, menuProps } = props
    if (!finallyData.value || (finallyData.value && finallyData.value.length < 1)) {
      return null
    }

    const menuUtils = new MenuUtil({
      ...props,
      menuRenderType: props.menuRenderType,
      location: isBrowser()
        ? props.location || {
          path: window.location.pathname || '/',
        }
        : undefined,
      baseClassName: baseClassName.value,
      hashId: hashId?.value!,
      cssVarCls: cssVarCls?.value!,
    })

    return (
      <Menu
        {...openKeysProps.value}
        {...menuProps}
        key="Menu"
        mode={mode}
        theme={theme}
        inlineIndent={16}
        selectedKeys={selectedKeys.value}
        items={menuUtils.getNavMenuItems(finallyData.value, 0, 0)}
        class={classNames(baseClassName.value, attrs.class, hashId?.value, cssVarCls?.value, {
          [`${baseClassName.value}-collapsed`]: collapsed,
        })}
        onOpenChange={(_openKeys) => {
          if (!collapsed) {
            setOpenKeys(_openKeys)
          }
        }}
      />
    )
  }
}, {
  name: 'BaseMenu',
  inheritAttrs: false,
})
export default BaseMenu
