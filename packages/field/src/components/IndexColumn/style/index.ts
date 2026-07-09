import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProIndexColumnToken extends ProAliasCssVarToken {
}

const genProStyle: GenerateStyle<ProIndexColumnToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      '&-border': {
        color: '#fff',
        fontSize: 12,
        lineHeight: '12px',
        backgroundColor: '#314659',
        borderRadius: 9,
        '&.top-three': {
          backgroundColor: '#979797',
        },
      },
    },
  }
}

export default useStyle('IndexColumn', (token) => {
  const proIndexColumnToken = mergeToken<ProIndexColumnToken>(token, {})

  return [genProStyle(proIndexColumnToken)]
})
