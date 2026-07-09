import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface GlobalFooterToken extends ProAliasCssVarToken {
}
const genGlobalFooterStyle: GenerateStyle<GlobalFooterToken> = (token) => {
  return {
    [token.componentCls]: {
      marginBlock: 0,
      marginBlockStart: 48,
      marginBlockEnd: 24,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 16,
      textAlign: 'center',
      '&-list': {
        marginBlockEnd: 8,
        color: token.colorTextSecondary,
        '&-link': {
          color: token.colorTextSecondary,
          textDecoration: token.linkDecoration,
        },
        '*:not(:last-child)': {
          marginInlineEnd: 8,
        },
        '&:hover': {
          color: token.colorPrimary,
        },
      },
      '&-copyright': { fontSize: 14, color: token.colorText },
    },
  }
}
export default useStyle('ProLayoutGlobalFooter', (token) => {
  const globalFooterToken = mergeToken<GlobalFooterToken>(token, {
  })
  return [genGlobalFooterStyle(globalFooterToken)]
})
