import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { MenuProps } from 'antdv-next'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLayoutBaseMenuToken extends ProAliasCssVarToken {}

const genProLayoutBaseMenuStyle: GenerateStyle<ProLayoutBaseMenuToken> = (
  token,
  mode: MenuProps['mode'],
) => {
  return {
    [`${token.componentCls}${token.antCls}-menu`]: {
      [`${token.antCls}-menu-item-group`]: {
        '&-title': {
          paddingInlineStart: 8,
          [`${token.iconCls}`]: {
            marginInlineEnd: 10,
          },
        },
      },
      [`${token.antCls}-menu-title-content`]: {
        '&>*': {
          display: 'inline-block',
        },
      },
    },
    [`${token.proComponentsCls}-drawer-sider`]: {
      [`${token.componentCls}${token.proComponentsCls}-sider-menu${token.antCls}-menu-light${token.antCls}-menu-root`]:
        {
          borderInlineEnd: 'none',
        },
    },
    ...(mode?.includes('horizontal')
      ? {
          [`${token.componentCls}${token.antCls}-menu-light`]: {
            borderBlockEnd: 'none',
          },
        }
      : {
          [`${token.componentCls}${token.proComponentsCls}-sider-menu${token.antCls}-menu-light${token.antCls}-menu-root`]:
            {
              borderInlineEnd: 'none',
            },
        }),
  }
}

export function useStyle(prefixCls: ComputedRef<string>, mode?: MenuProps['mode']) {
  const genStyleHooks = useAntdStyle(
    `ProLayoutBaseMenu${(mode || 'inline').charAt(0).toUpperCase()}${(mode || 'inline').slice(1)}`,
    (token) => {
      const proLayoutMenuToken = mergeToken<ProLayoutBaseMenuToken>(token, {})
      return [genProLayoutBaseMenuStyle(proLayoutMenuToken, mode || 'inline')]
    },
  )
  return genStyleHooks(prefixCls)
}
