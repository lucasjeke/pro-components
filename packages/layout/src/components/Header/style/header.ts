import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLayoutHeaderToken extends ProAliasCssVarToken {}

const genProLayoutHeaderStyle: GenerateStyle<ProLayoutHeaderToken> = (token) => {
  return {
    [`${token.componentCls}`]: {
      [`&${token.antCls}-layout-header`]: {
        height: token?.proLayoutHeaderHeightLayoutHeader || 56,
        lineHeight: token.calc(token?.proLayoutHeaderHeightLayoutHeader || 56).equal(),
        zIndex: 9,
        paddingBlock: 0,
        paddingInline: 0,
        transition: 'width .2s',
      },
      [`&-fixed${token.antCls}-layout-header`]: {
        position: 'fixed',
        insetBlockStart: 0,
        insetInlineEnd: 0,
      },
      '&-actions': {
        display: 'flex',
        alignItems: 'center',
        fontSize: 16,
        cursor: 'pointer',
        '& &-item': {
          paddingBlock: 0,
          paddingInline: 8,
          '&:hover': {
            color: token.colorText,
          },
        },
      },
    },
    '&-mix': {
      [`${token.componentCls}`]: {
        [`&${token.antCls}-layout-header`]: {
          zIndex: 99,
        },
      },
    },
  }
}

export default useStyle('ProLayoutHeader', (token) => {
  const ProLayoutHeaderToken = mergeToken<ProLayoutHeaderToken>(token, {})
  return [genProLayoutHeaderStyle(ProLayoutHeaderToken)]
})
