import type { GlobalToken } from 'antdv-next'
import { unitless } from 'antdv-next/dist/theme/useToken'
import { setAlpha } from '../useStyle'

export interface BaseLayoutDesignToken {
  hashId: string
  colorPrimary: string
  /**
   * @name colorBgAppListIconHover  跨站点应用的图标hover颜色
   */
  colorBgAppListIconHover: string
  /**
   * @name colorTextAppListIconHover  跨站点应用的图标hover颜色
   */
  colorTextAppListIconHover: string
  /**
   * @name colorTextAppListIcon 跨站点应用的图标hover颜色
   */
  colorTextAppListIcon: string
  /**
   * @name bgLayout  layout 的背景颜色
   */
  bgLayout: string | null
  /**
   * @name sider 侧边side的 token 配置
   */
  sider: {
    /**
     * @name colorSubMenuBackground submenu 的背景颜色
     */
    colorSubMenuBackground: string
    /**
     * @name colorBgMenuItemCollapsedElevated  收起 menuItem 的弹出菜单背景颜色
     */
    colorBgMenuItemSelectedHorizontal: string
    colorTextMenuActiveBarWidth: number
    colorTextMenuActiveBarHeight: number
    colorTextMenuActiveBarBorderSize: number

    colorBgCollapsedButton: string
    colorTextCollapsedButtonHover: string
    colorTextCollapsedButton: string
    colorMenuBackground: string
    menuHeight: number
    colorBgMenuItemCollapsedElevated: string
    colorMenuItemDivider: string
    colorBgMenuItemHover: string // 鼠标悬浮态
    colorBgMenuItemActive: string // 激活态
    colorBgMenuItemSelected: string
    colorTextMenuSelected: string
    colorTextMenuItemHover: string
    colorTextMenuActive: string
    colorTextMenu: string
    colorTextMenuSecondary: string
    paddingInlineLayoutMenu: number
    paddingBlockLayoutMenu: number
    /**
     * menu 顶部 title 的字体颜色
     */
    colorTextMenuTitle: string
    colorTextSubMenuSelected: string
  }
  /**
   * @name header 的 token 设置
   */
  header: {
    colorBgHeader: string
    colorHeaderTitle: string
    colorBgMenuItemHover: string
    colorBgMenuItemSelected: string
    colorBgMenuItemSelectedHorizontal: string
    colorTextMenuSelected: string
    colorTextMenuActive: string
    colorTextMenu: string
    colorTextMenuSecondary: string
    colorBgRightActionsItemHover: string
    colorTextRightActionsItem: string
    heightLayoutHeader: number
  }

  /**
   * @name pageContainer 页面容器 的 token 配置
   */
  pageContainer: {
    /**
     * pageContainer 的背景颜色
     */
    colorBgPageContainer: string
    /**
     * pageContainer 自带的 padding inline
     */
    paddingInlinePageContainerContent: number
    /**
     * pageContainer 自带的 padding block
     */
    paddingBlockPageContainerContent: number
    /**
     * pageContainer 被固定时的背景颜色
     */
    colorBgPageContainerFixed: string
  }
}
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T

export const proLayoutUnitless = {
  ...unitless,
  themeId: true,
}

export type LayoutDesignToken = BaseLayoutDesignToken

export const getLayoutDesignToken: (
  baseDesignTokens: DeepPartial<LayoutDesignToken>,
  antdToken: GlobalToken,
) => LayoutDesignToken = (designTokens, antdToken) => {
  const finalDesignTokens = { ...designTokens }
  // const defaultColorBgHeader = setAlpha(antdToken.colorBgElevated, 0.6)
  return {
    bgLayout: `linear-gradient(${antdToken.colorBgContainer}, ${antdToken.colorBgLayout} 28%)`,
    colorTextAppListIcon: antdToken.colorTextSecondary,
    colorBgAppListIconHover: setAlpha(antdToken.colorTextBase, 0.04),
    colorTextAppListIconHover: antdToken.colorTextBase,
    ...finalDesignTokens,
    header: {
      colorBgHeader: antdToken.colorBgContainer,
      // colorBgHeader: defaultColorBgHeader,
      colorHeaderTitle: antdToken.colorText,
      colorBgMenuItemSelected: antdToken.controlItemBgActive,
      colorBgMenuItemHover: antdToken.colorBgTextHover,
      colorBgMenuItemSelectedHorizontal: 'transparent',
      colorTextMenu: antdToken.colorText,
      colorTextMenuActive: antdToken.colorPrimary,
      colorTextMenuSelected: antdToken.colorPrimary,
      colorBgRightActionsItemHover: setAlpha(antdToken.colorTextBase, 0.03),
      colorTextRightActionsItem: antdToken.colorTextTertiary,
      heightLayoutHeader: 56,
      colorTextMenuSecondary: antdToken.colorTextTertiary,

      colorBgScrollHeader: setAlpha(antdToken.colorBgElevated, 0.8),
      // colorBgMenuItemHover: setAlpha(antdToken.colorTextBase, 0.03),
      /**
       * 顶栏横向菜单选中底须可见：`transparent` 会让 ProLayoutNavMenu 的 `--pro-layout-nav-color-bg-selected`
       * 全透明，用户无法分辨当前路由对应哪一项（与站点 layout 文档默认 `rgba(0,0,0,0.04)` 也不一致）。
       */
      // colorBgMenuItemSelected: setAlpha(antdToken.colorTextBase, 0.04),
      // colorBgMenuElevated:
      //   (finalDesignTokens?.header?.colorBgHeader ?? defaultColorBgHeader) !==
      //   defaultColorBgHeader
      //     ? finalDesignTokens.header?.colorBgHeader
      //     : antdToken.colorBgElevated,
      /** 与常规 `colorTextMenu`（secondary）区分当前选中项 */
      // colorTextMenuSelected: antdToken.colorText,
      // colorTextMenu: antdToken.colorTextSecondary,
      // colorTextMenuTitle: antdToken.colorText,
      // colorTextMenuActive: antdToken.colorText,
      ...finalDesignTokens.header,
    } as LayoutDesignToken['header'],
    sider: {
      colorMenuBackground: antdToken.colorBgContainer,
      colorSubMenuBackground: antdToken.colorFillAlter,
      colorMenuItemDivider: setAlpha(antdToken.colorTextBase, 0.06),
      colorBgMenuItemHover: antdToken.colorBgTextHover,
      colorBgMenuItemActive: antdToken.colorFillContent,
      colorBgMenuItemSelected: antdToken.controlItemBgActive,
      colorBgMenuItemSelectedHorizontal: 'transparent',
      colorTextMenuActiveBarWidth: 0,
      colorTextMenuActiveBarHeight: 2,
      colorTextMenuActiveBarBorderSize: antdToken.lineWidth,
      colorTextMenuItemHover: antdToken.colorText,
      colorTextMenuSelected: antdToken.colorPrimary,
      colorTextMenuActive: antdToken.colorText,
      colorTextMenu: antdToken.colorText,
      colorTextMenuSecondary: antdToken.colorTextTertiary,
      colorTextMenuTitle: antdToken.colorText,
      colorTextSubMenuSelected: setAlpha(antdToken.colorTextBase, 0.95),

      paddingInlineLayoutMenu: 8,
      paddingBlockLayoutMenu: 12,
      colorBgCollapsedButton: antdToken.colorBgElevated,
      colorTextCollapsedButtonHover: antdToken.colorTextSecondary,
      colorTextCollapsedButton: setAlpha(antdToken.colorTextBase, 0.25),
      // colorMenuBackground: setAlpha(antdToken.colorTextBase, 0.04),
      // colorBgMenuItemHover: setAlpha(antdToken.colorTextBase, 0.03),
      // colorBgMenuItemSelected: setAlpha(antdToken.colorTextBase, 0.04),
      // colorTextMenuSelected: setAlpha(antdToken.colorTextBase, 0.95),
      // colorTextMenu: antdToken.colorTextSecondary,
      ...finalDesignTokens.sider,
    },
    pageContainer: {
      colorBgPageContainer: 'transparent',
      paddingInlinePageContainerContent:
        finalDesignTokens.pageContainer?.paddingInlinePageContainerContent
        || 24,
      paddingBlockPageContainerContent:
        finalDesignTokens.pageContainer?.paddingBlockPageContainerContent || 24,
      colorBgPageContainerFixed: antdToken.colorBgElevated,
      ...finalDesignTokens.pageContainer,
    },
  } as LayoutDesignToken
}

export interface ProTokenType {
  layout?: DeepPartial<LayoutDesignToken>
}

type Primitive
  = | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined

type CapitalizeKey<S extends string>
  = S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : S

type UnionToIntersection<U>
  = (
    U extends any ? (x: U) => any : never
  ) extends (x: infer R) => any
    ? R
    : never

type FlattenToken<
  T,
  Prefix extends string = 'proLayout',
  Path extends string = '',
>
  = UnionToIntersection<
    {
      [K in keyof T]:
      T[K] extends Primitive
        ? {
            [P in `${Prefix}${Path}${CapitalizeKey<K & string>}`]: T[K]
          }
        : FlattenToken<
          T[K],
          Prefix,
              `${Path}${CapitalizeKey<K & string>}`
        >
    }[keyof T]
  >
export type ProFlattenTokenType = FlattenToken<LayoutDesignToken>
