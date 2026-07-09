import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { setAlpha, useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProTableAlertToken extends ProAliasCssVarToken {
}

const genProTableAlertStyle: GenerateStyle<ProTableAlertToken> = (token) => {
  return {
    [token.componentCls]: {
      marginBlockEnd: 16,
      backgroundColor: setAlpha(token.colorTextBase, 0.02),
      borderRadius: token.borderRadius,
      border: 'none',
      paddingBlock: token.paddingSM,
      paddingInline: token.paddingLG,
      color: token.colorTextTertiary,
    },
  }
}

export default useStyle('ProTableAlert', (token) => {
  const proTableAlertToken = mergeToken<ProTableAlertToken>(token, {})

  return [genProTableAlertStyle(proTableAlertToken)]
})
