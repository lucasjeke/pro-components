import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface GridContentToken extends ProAliasCssVarToken {
}

const genGridContentStyle: GenerateStyle<GridContentToken> = (token) => {
  return {
    [token.componentCls]: {
      width: '100%',
      '&-wide': {
        maxWidth: 1152,
        margin: '0 auto',
      },
    },
  }
}

export default useStyle('ProLayoutGridContent', (token) => {
  const gridContentToken = mergeToken<GridContentToken>(token, {})
  return [genGridContentStyle(gridContentToken)]
})
