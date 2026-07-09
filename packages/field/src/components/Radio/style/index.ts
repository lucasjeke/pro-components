import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProFieldRadioToken extends ProAliasCssVarToken {
}

const genProFieldRadioStyle: GenerateStyle<ProFieldRadioToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-error': {
        span: {
          color: token.colorError,
        },
      },
      '&-vertical': {
        [`${token.antCls}-radio-wrapper`]: {
          display: 'flex',
          marginInlineEnd: 0,
        },
      },
    },
  }
}

export default useStyle('ProFieldRadio', (token) => {
  const proFieldRadioToken = mergeToken<ProFieldRadioToken>(token, {})

  return [genProFieldRadioStyle(proFieldRadioToken)]
})
