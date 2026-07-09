import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface TopNavHeaderToken extends ProAliasCssVarToken {
}
const genTopNavHeaderStyle: GenerateStyle<TopNavHeaderToken> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      width: '100%',
      height: '100%',
      '&-light': {
        backgroundColor: token.proLayoutHeaderColorBgHeader || token.colorBgContainer,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      },
      '&-dark': {
        backgroundColor: 'inherit',
        [`${token.componentCls}-logo`]: {
          '> *:first-child > h1': {
            color: 'rgba(255,255,255,0.85)',
          },
        },
      },
      '.anticon': {
        color: 'inherit',
      },
      '&-main': {
        display: 'flex',
        height: '100%',
        paddingInlineStart: 16,
        '&-left': {
          display: 'flex',
          alignItems: 'center',
          [`${token.proComponentsCls}-layout-apps-icon`]: {
            marginInlineEnd: 16,
          },
        },
      },
      '&-wide': {
        maxWidth: 1152,
        margin: '0 auto',
      },
      '&-logo': {
        position: 'relative',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        overflow: 'hidden',
        '> *:first-child': {
          display: 'flex',
          alignItems: 'center',
          minHeight: 32,
          fontSize: 32,
        },
        '> *:first-child > img': {
          display: 'inline-block',
          height: 32,
          verticalAlign: 'middle',
        },
        '> *:first-child > h1': {
          display: 'inline-block',
          marginBlock: 0,
          marginInline: 0,
          lineHeight: '24px',
          marginInlineStart: 12,
          fontWeight: 600,
          fontSize: 16,
          color: token.proLayoutHeaderColorHeaderTitle,
          verticalAlign: 'top',
        },
      },
      '&-menu': {
        minWidth: 0,
        paddingInlineStart: 60,
      },
    },
  }
}
export default useStyle('ProTopNavHeader', (token) => {
  const topNavHeaderToken = mergeToken<TopNavHeaderToken>(token, {})
  return [genTopNavHeaderStyle(topNavHeaderToken)]
})
