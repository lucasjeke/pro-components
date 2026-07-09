import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'
import { genAppsLogoComponentsDefaultListStyle } from './default'
import { genAppsLogoComponentsSimpleListStyle } from './simple'

export interface AppsLogoComponentsToken extends ProAliasCssVarToken {
}

const genAppsLogoComponentsStyle: GenerateStyle<AppsLogoComponentsToken> = (token) => {
  return {
    [`${token.proComponentsCls}-top-nav-header, ${token.proComponentsCls}-global-header`]:
      {
        '&-dark': {
          [token.componentCls]: {
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
            '&-item-title': {
              color: 'rgba(255, 255, 255, 0.88)',
            },
          },
        },
      },
    [token.componentCls]: {
      '&-wrapper': {},
      '&-icon': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: 4,
        paddingBlock: 0,
        fontSize: 14,
        lineHeight: '14px',
        height: 28,
        width: 28,
        cursor: 'pointer',
        color: token.proLayoutColorTextAppListIcon,
        borderRadius: token.borderRadius,
        boxSizing: 'border-box',
        '&:hover': {
          color: token.proLayoutColorTextAppListIconHover,
          backgroundColor: token.proLayoutColorBgAppListIconHover,
        },
        '&-active': {
          color: token.proLayoutColorTextAppListIconHover,
          backgroundColor: token.proLayoutColorBgAppListIconHover,
        },
      },
      '&-item-title': {
        marginInlineStart: 16,
        marginInlineEnd: 8,
        marginBlockStart: 0,
        marginBlockEnd: 12,
        fontWeight: 600,
        color: 'rgba(0, 0, 0, 0.88)',
        fontSize: 16,
        opacity: 0.85,
        lineHeight: 1.5,
        '&:first-child': {
          marginBlockStart: 12,
        },
      },
      '&-popover': {
        [`${token.antCls}-popover-arrow`]: {
          display: 'none',
        },
      },
      '&-simple': genAppsLogoComponentsSimpleListStyle(token),
      '&-default': genAppsLogoComponentsDefaultListStyle(token),
    },
  }
}

export default useStyle('AppsLogoComponents', (token) => {
  const proCardToken = mergeToken<AppsLogoComponentsToken>(token, {
  })
  return [genAppsLogoComponentsStyle(proCardToken)]
})
