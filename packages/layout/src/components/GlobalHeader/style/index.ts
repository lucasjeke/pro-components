import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface GlobalHeaderToken extends ProAliasCssVarToken {
}

const genGlobalHeaderStyle: GenerateStyle<GlobalHeaderToken> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      paddingBlock: 0,
      paddingInline: 16,
      height: token.proLayoutHeaderHeightLayoutHeader || 56,
      boxSizing: 'border-box',
      '&-light': {
        backgroundColor: token.proLayoutHeaderColorBgHeader || token.colorBgContainer,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      },
      '&-realDark': {
        boxShadow: '0 1px 4px  rgba(13,13,13, 0.65)',
      },
      '&-dark': {
        [`${token.componentCls}-logo`]: {
          h1: {
            color: 'rgba(255,255,255,0.85)',
          },
        },
      },

      '> a': {
        height: '100%',
      },
      [`${token.proComponentsCls}-layout-apps-icon`]: {
        marginInlineEnd: 16,
      },
      '&-collapsed-button': {
        minHeight: 22,
        color: token?.proLayoutHeaderColorHeaderTitle,
        fontSize: 18,
      },
      '&-logo': {
        position: 'relative',
        marginInlineEnd: 16,
        a: {
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          minHeight: 22,
          fontSize: 20,
        },
        svg: {
          fontSize: 28,
        },
        img: { height: 28 },
        h1: {
          marginBlock: 0,
          marginInlineEnd: 0,
          marginInlineStart: 12,
          fontWeight: '600',
          color: token.proLayoutHeaderColorHeaderTitle || token.colorTextHeading,
          fontSize: 16,
          lineHeight: '24px',
        },
        '&-mix': {
          display: 'flex',
          alignItems: 'center',
        },
      },
      '&-logo-mobile': {
        minWidth: 24,
        marginInlineEnd: 0,
      },
    },
  }
}

export default useStyle('ProLayoutGlobalHeader', (token) => {
  const GlobalHeaderToken = mergeToken<GlobalHeaderToken>(token, {})
  return [genGlobalHeaderStyle(GlobalHeaderToken)]
})
