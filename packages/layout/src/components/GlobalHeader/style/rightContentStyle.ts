import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLayoutRightContentToken extends ProAliasCssVarToken {
}
const genTopNavHeaderStyle: GenerateStyle<ProLayoutRightContentToken> = (token) => {
  return {
    [`${token.proComponentsCls}-layout-header`]: {
      [`${token.proComponentsCls}-top-nav-header,${token.proComponentsCls}-global-header`]: {
        '&-dark': {
          [token.componentCls]: {
            '&-header-actions': {
              '&-item': {
                color: 'rgba(255,255,255,0.65)',
                '> *': {
                  color: 'rgba(255,255,255,0.65)',
                  '&:hover': {
                    color: 'rgba(255,255,255, 1)',
                  },
                },
              },
              '&-avatar': {
                color: 'rgba(255,255,255,0.65)',
                '> span': {
                  color: 'rgba(255,255,255,0.65)',
                  '&:hover': {
                    color: 'rgba(255,255,255, 1)',
                    backgroundColor: 'rgba(255,255,255, 0.03)',
                  },
                },
              },
            },
          },
        },
      },
    },
    [`${token.proComponentsCls}-layout-header`]: {
      [`${token.proComponentsCls}-top-nav-header`]: {
        '&-actions': {
          '&-avatar': {
            paddingInlineEnd: token.padding,
          },
        },
      },
      [`${token.proComponentsCls}-top-nav-header,${token.proComponentsCls}-global-header`]: {
        '&-dark': {
          [token.componentCls]: {
            '&-actions': {
              '&-item': {
                color: 'rgba(255,255,255,0.65)',
                '> *': {
                  color: 'rgba(255,255,255,0.65)',
                  '&:hover': {
                    color: 'rgba(255,255,255, 1)',
                  },
                },
              },
              '&-avatar': {
                color: 'rgba(255,255,255,0.65)',
                '> span': {
                  color: 'rgba(255,255,255,0.65)',
                },
              },
            },
          },
        },
      },
    },
    [token.componentCls]: {
      '&-actions': {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        '&-item': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: 0,
          paddingInline: 2,
          height: 'inherit',
          lineHeight: 'inherit',
          color: token.proLayoutHeaderColorTextRightActionsItem,
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: token.borderRadius,
          '> *': {
            paddingInline: 6,
            paddingBlock: 6,
            borderRadius: token.borderRadius,
            height: 'inherit',
            color: token.proLayoutHeaderColorTextRightActionsItem,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '100%',
            '&:hover': {
              backgroundColor: token.proLayoutHeaderColorBgRightActionsItemHover,
            },
          },
        },
        '&-avatar': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'inherit',
          lineHeight: 'inherit',
          paddingInlineStart: token.padding,
          cursor: 'pointer',
          color: token.proLayoutHeaderColorTextRightActionsItem,
          '> span': {
            height: 'inherit',
            color: token.proLayoutHeaderColorTextRightActionsItem,
            paddingInline: 8,
            paddingBlock: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '100%',
            borderRadius: token.borderRadius,
            '&:hover': {
              backgroundColor: token.proLayoutHeaderColorBgRightActionsItemHover,
            },
          },
        },
      },
    },
  }
}

export default useStyle('ProLayoutRightContent', (token) => {
  const proToken = mergeToken<ProLayoutRightContentToken>(token, {})
  return [genTopNavHeaderStyle(proToken)]
})
