import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProDropdownFooterToken extends ProAliasCssVarToken {
}

const genProDropdownFooterStyle: GenerateStyle<ProDropdownFooterToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBlock: 8,
      paddingInlineStart: 8,
      paddingInlineEnd: 8,
      borderBlockStart: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
    },
  }
}

export default useStyle('DropdownFooter', (token) => {
  const proDropdownFooterToken = mergeToken<ProDropdownFooterToken>(token, {})

  return [genProDropdownFooterStyle(proDropdownFooterToken)]
})
