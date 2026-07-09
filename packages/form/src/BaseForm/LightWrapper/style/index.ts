import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLightWrapperToken extends ProAliasCssVarToken {
  componentCls: string
}

const genProLightWrapperStyle: GenerateStyle<ProLightWrapperToken> = (token) => {
  return {
    [`${token.componentCls}-collapse-label`]: {
      boxSizing: 'border-box',
      paddingInline: 1,
      paddingBlock: 1,
    },
    [`${token.componentCls}-container`]: {
      boxSizing: 'border-box',
      [`${token.antCls}-form-item`]: {
        marginBlockEnd: 0,
      },
    },
  }
}

export default useStyle('LightWrapper', (token) => {
  const proLightWrapperToken = mergeToken<ProLightWrapperToken>(token, {})
  return [genProLightWrapperStyle(proLightWrapperToken)]
})
