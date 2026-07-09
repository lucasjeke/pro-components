import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { Keyframes, mergeToken } from '@antdv-next/cssinjs'

export interface ProCheckCardGroupToken extends ProAliasCssVarToken {
}

export const cardLoading = new Keyframes('card-loading', {
  '0%': { backgroundPosition: '0 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0 50%' },
})

const genProCheckCardGroupStyle: GenerateStyle<ProCheckCardGroupToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      columnGap: token.margin,
      rowGap: token.margin,
      position: 'relative',
      [`${token.antCls}-row`]: {
        width: '100%',
      },
      [`${token.proComponentsCls}-card${token.proComponentsCls}-checkcard`]: {
        marginInlineEnd: 0,
        marginBlockEnd: 0,
      },
    },
  }
}

export default useStyle('ProCheckCardGroup', (token) => {
  const proCheckCardGroupToken = mergeToken<ProCheckCardGroupToken>(token, {})
  return [genProCheckCardGroupStyle(proCheckCardGroupToken)]
})
