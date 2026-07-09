import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLightSelectToken extends ProAliasCssVarToken {
  componentCls: string
}

const genProLightSelectStyle: GenerateStyle<ProLightSelectToken> = (token) => {
  return {
    [token.componentCls]: {
      [`${token.antCls}-select`]: {
        position: 'absolute',
        width: 153,
        height: 28,
        visibility: 'hidden',
        opacity: 0,
        '&-selector': {
          height: 28,
        },
      },
      [`&${token.componentCls}-searchable`]: {
        [`${token.antCls}-select`]: {
          width: 200,
          '&-selector': {
            height: 28,
          },
        },
      },
    },
  }
}

export default useStyle('LightSelect', (token) => {
  const proLightSelectToken = mergeToken<ProLightSelectToken>(token, {})
  return [genProLightSelectStyle(proLightSelectToken)]
})
