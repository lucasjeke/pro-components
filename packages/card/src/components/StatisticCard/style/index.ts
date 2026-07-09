import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProStatisticCardToken extends ProAliasCssVarToken {
}

const genProStyle: GenerateStyle<ProStatisticCardToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      '&-chart': {
        display: 'flex',
        flexDirection: 'column',
        marginBlockStart: 8,
        marginBlockEnd: 8,
        '&-left': { marginBlockStart: 0, marginInlineEnd: 16 },
        '&-right': { marginBlockStart: 0, marginInlineStart: 16 },
      },
      '&-content': {
        display: 'flex',
        flexDirection: 'column',
        '&-horizontal': {
          flexDirection: 'row',
          [`${token.componentCls}-chart`]: {
            alignItems: 'center',
            alignSelf: 'flex-start',
          },
        },
      },
      '&-footer': {
        marginBlockStart: 8,
        paddingBlockStart: 8,
        borderBlockStart: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
      },
    },
  }
}

export default useStyle('StatisticCard', (token) => {
  const proStatisticCardToken = mergeToken<ProStatisticCardToken>(token, {})
  return [genProStyle(proStatisticCardToken)]
})
