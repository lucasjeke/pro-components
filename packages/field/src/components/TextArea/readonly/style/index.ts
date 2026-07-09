import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProTextAreaToken extends ProAliasCssVarToken {
}

const genProTextAreaStyle: GenerateStyle<ProTextAreaToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'inline-block',
      lineHeight: '1.5715',
      maxWidth: '100%',
      whiteSpace: 'pre-wrap',
    },
  }
}

export default useStyle('TextArea', (token) => {
  const proTextAreaToken = mergeToken<ProTextAreaToken>(token, {})

  return [genProTextAreaStyle(proTextAreaToken)]
})
