import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProTableAlertToken extends ProAliasCssVarToken {
}

const genProTableAlertStyle: GenerateStyle<ProTableAlertToken> = (token) => {
  return {
    [`${token.componentCls}${token.antCls}-alert`]: {
      marginBlockEnd: token.margin,
    },
  }
}

export default useStyle('ProTableAlert', (token) => {
  const proTableAlertToken = mergeToken<ProTableAlertToken>(token, {})

  return [genProTableAlertStyle(proTableAlertToken)]
})
