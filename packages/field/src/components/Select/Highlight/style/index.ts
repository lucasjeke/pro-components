import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProHighlightToken extends ProAliasCssVarToken {
}

const genProStyle: GenerateStyle<ProHighlightToken> = (token) => {
  return {
    [token.componentCls]: {
      flex: 'auto',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    [`${token.componentCls}-light`]: {
      color: token.colorPrimary,
    },
  }
}
export default useStyle('Highlight', (token) => {
  const proHighlightToken = mergeToken<ProHighlightToken>(token, {})
  return [genProStyle(proHighlightToken)]
})
