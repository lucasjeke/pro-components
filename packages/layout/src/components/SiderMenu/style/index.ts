import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'
import { Keyframes, mergeToken, unit } from '@antdv-next/cssinjs'

export interface SiderMenuToken extends ProAliasCssVarToken {
  proLayoutCollapsedWidth: number
  proLayoutFirstMenuWidth?: number
}
export const proLayoutTitleHide = new Keyframes('antBadgeLoadingCircle', {
  '0%': { display: 'none', opacity: 0, overflow: 'hidden' },
  '80%': {
    overflow: 'hidden',
  },
  '100%': {
    display: 'unset',
    opacity: 1,
  },
})
const genSiderMenuStyle: GenerateStyle<SiderMenuToken> = (token) => {
  return {
    [token.componentCls]: {
      [`&${token.antCls}-layout-sider`]: {
        zIndex: 10,
        [`&${token.componentCls}-light`]: {
          boxShadow: '2px 0 8px rgba(29, 35, 41, .05)',
          [`&${token.componentCls}-mix`]: {
            zIndex: 9,
          },
          [`& ${token.antCls}-layout-sider-children`]: {
            '& ::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.12)',
              borderRadius: 3,
              boxShadow: 'inset 0 0 5px rgba(0,21,41,.05)',
            },
            '& ::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,.06)',
              borderRadius: 3,
              boxShadow: 'inset 0 0 5px rgba(0,21,41,.05)',
            },
          },
        },
        [`&${token.componentCls}-dark`]: {
          [`${token.componentCls}-logo`]: {
            color: 'rgba(255,255,255,0.85)',
            '> a': {
              '> h1': {
                color: 'rgba(255,255,255,0.85)',
              },
            },
            [`${token.proComponentsCls}-layout-apps`]: {
              '&-icon': {
                color: 'rgba(255, 255, 255, 0.85)',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 1)',
                  backgroundColor: 'rgba(255,255,255, 0.05)',
                },
                '&-active': {
                  color: 'rgba(255, 255, 255, 1)',
                  backgroundColor: 'rgba(255,255,255, 0.05)',
                },
              },

            },
          },
          [`${token.componentCls}-actions`]: {
            color: 'rgba(255,255,255,0.85)',
          },
        },
      },
      [`& ${token.antCls}-layout-sider-children`]: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '& ::-webkit-scrollbar': {
          width: 6,
          height: 6,
        },
        '& ::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          boxShadow: 'inset 0 0 5px rgba(255,255,255,.05)',
        },
        '& ::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 3,
          boxShadow: 'inset 0 0 5px rgba(37,37,37,.05)',
        },
        [`${token.componentCls}-collapsed-button`]: {
          [`& ${token.antCls}-menu-light`]: {
            borderInlineEnd: 'none',
          },
        },
      },
      '&-logo': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 8,
        paddingBlock: 16,
        color: token.proLayoutSiderColorTextMenu,
        cursor: 'pointer',
        '> a': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 32,
          fontSize: 32,
          '> img': {
            display: 'inline-block',
            height: 32,
            verticalAlign: 'middle',
            transition: 'height 0.2s',
          },
          '> svg': {
            fontSize: 32,
          },
          '> img + h1, > svg+ h1': {
            marginInlineStart: 10,
          },
          '> h1': {
            display: 'inline-block',
            height: 32,
            marginBlock: 0,
            marginInlineEnd: 0,
            color: token.proLayoutSiderColorTextMenuTitle,
            animationName: proLayoutTitleHide,
            animationDuration: '.4s',
            animationTimingFunction: 'ease',
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '32px',
            verticalAlign: 'middle',
          },
        },
        '&-collapsed': {
          flexDirection: 'column-reverse',
          margin: 0,
          padding: 12,
          [`${token.proComponentsCls}-layout-apps-icon`]: {
            marginBlockEnd: 8,
            fontSize: 16,
            transition: 'font-size 0.2s ease-in-out,color 0.2s ease-in-out',
          },
        },
      },
      '&-actions': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBlock: 4,
        marginInline: 0,
        color: token.proLayoutSiderColorTextMenu,
        '&-collapsed': {
          flexDirection: 'column-reverse',
          paddingBlock: 0,
          paddingInline: 8,
          fontSize: 16,
          transition: 'font-size 0.3s ease-in-out',
        },
        '&-list': {
          color: token.proLayoutSiderColorTextMenuSecondary,
          '&-collapsed': {
            marginBlockEnd: 8,
            animationName: 'none',
          },
          '&-item': {
            paddingInline: 6,
            paddingBlock: 6,
            lineHeight: '16px',
            fontSize: 16,
            cursor: 'pointer',
            borderRadius: token.borderRadius,
            '&:hover': {
              background: token.colorBgTextHover,
            },
          },
        },
        '&-avatar': {
          fontSize: 14,
          paddingInline: 8,
          paddingBlock: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: token.borderRadius,
          '& *': {
            cursor: 'pointer',
          },
          '&:hover': {
            background: token.colorBgTextHover,
          },
        },
      },
      '&-extra': {
        marginBlockEnd: 16,
        marginBlock: 0,
        marginInline: 16,
        '&-no-logo': {
          marginBlockStart: 16,
        },
      },
      '&-links': {
        width: '100%',
      },
      '&-footer': {
        color: token.proLayoutSiderColorTextMenuSecondary,
        paddingBlockEnd: 16,
        fontSize: token.fontSize,
        animationName: proLayoutTitleHide,
        animationDuration: '.3s',
        animationTimingFunction: 'ease',
      },
      [`&&-mix${token.antCls}-layout-sider`]: {
        insetBlockStart: token.proLayoutHeaderHeightLayoutHeader || 56,
      },
      '&&-left': {
        [`${token.componentCls}-left-container`]: {
          display: 'flex',
          height: '100%',
        },
        [`${token.componentCls}-left-rail`]: {
          flex: `0 0 ${token.calc(token.proLayoutFirstMenuWidth || 80).equal()}`,
          width: token.proLayoutFirstMenuWidth || 80,
          borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
          [`${token.componentCls}-left-logo`]: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingInline: 8,
            paddingBlock: 16,
            '> img': {
              display: 'inline-block',
              height: 32,
              verticalAlign: 'middle',
              transition: 'height 0.2s',
            },
            '> svg': {
              fontSize: 32,
            },

          },
          [`${token.antCls}-menu-light${token.antCls}-menu-root`]: {
            borderInlineEnd: 'none',
          },
          [`${token.antCls}-menu`]: {
            '&-item': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              height: token.calc(token.controlHeightLG).mul(1.5).equal(),
              lineHeight: token.lineHeight,
              marginInline: token.marginXS,
              width: token.calc('100%').sub(token.calc(token.margin).equal()).equal({ unit: false }),
              [`${token.iconCls}`]: {
                fontSize: token.fontSizeXL,
              },
            },
            '&-title-content': {
              marginInlineStart: 0,
              paddingBlockStart: token.paddingXS,
              fontSize: token.fontSizeSM,
            },
          },
        },
        [`${token.componentCls}-left-menu`]: {
          flex: 1,
          display: 'flex',
          boxShadow: '2px 0 8px rgba(29, 35, 41, .05)',
          // rgba(13,13,13, 0.65)
          [`${token.componentCls}-logo-title`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: token.padding,
            paddingBlock: token.padding,
            color: token.proLayoutSiderColorTextMenuTitle,
            cursor: 'pointer',
            '> a': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 32,
              fontSize: 32,
              '> h1': {
                display: 'inline-block',
                height: 32,
                marginBlock: 0,
                color: token.proLayoutSiderColorTextMenuTitle,
                animationName: proLayoutTitleHide,
                animationDuration: '.4s',
                animationTimingFunction: 'ease',
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '32px',
                verticalAlign: 'middle',
              },
            },

          },
          [`${token.componentCls}-menu`]: {
            paddingInline: token.paddingXXS,

          },
        },
      },
      '&&-mix': {
        [`&${token.componentCls}-mix`]: {
          zIndex: 9,
        },
        [`&${token.componentCls}-realDark`]: {
          boxShadow: ' 0 2px 8px #0d0d0da6',
        },
        [`& ${token.antCls}-layout-sider-children`]: {
          '& ::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.12)',
            borderRadius: 3,
            boxShadow: 'inset 0 0 5px rgba(0,21,41,.05)',
          },
          '& ::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,.06)',
            borderRadius: 3,
            boxShadow: 'inset 0 0 5px rgba(0,21,41,.05)',
          },
        },
      },
    },
    [`${token.componentCls}${token.componentCls}-fixed`]: {
      position: 'fixed',
      insetBlockStart: 0,
      insetInlineStart: 0,
      zIndex: 99,
      height: '100%',
      '&-mix': {
        height: token.calc('100%').sub(token.proLayoutHeaderHeightLayoutHeader || 56).equal(),
      },
    },
  }
}

export function useStyle(
  prefixCls: ComputedRef<string>,
  {
    proLayoutCollapsedWidth,
    proLayoutFirstMenuWidth,
  }: {
    proLayoutCollapsedWidth: number
    proLayoutFirstMenuWidth?: number
  },
) {
  const genStyleHooks = useAntdStyle('ProLayoutSiderMenu', (token) => {
    const siderMenuToken = mergeToken<SiderMenuToken>(token, {
      proLayoutCollapsedWidth,
      proLayoutFirstMenuWidth,
    })
    return [genSiderMenuStyle(siderMenuToken)]
  })
  return genStyleHooks(prefixCls)
}
