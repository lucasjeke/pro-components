import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProQueryFilterToken extends ProAliasCssVarToken {
}

const genProQueryFilterStyle: GenerateStyle<ProQueryFilterToken> = (token) => {
  return {
    [token.componentCls]: {
      '&&': {
        padding: token.paddingLG,
      },
      [`${token.antCls}-form-item`]: {
        marginBlock: 0,
      },
      [`${token.proComponentsCls}-form-group-title`]: {
        marginBlock: 0,
      },
      '&-row': {
        rowGap: token.paddingLG,
        '&-split': {
          [`${token.proComponentsCls}-form-group`]: {
            display: 'flex',
            alignItems: 'center',
            gap: token.marginXS,
          },
          '&:last-child': {
            marginBlockEnd: token.marginSM,
          },
        },
        '&-split-line': {
          '&:after': {
            position: 'absolute',
            width: '100%',
            content: '""',
            height: 1,
            insetBlockEnd: `-${token.marginSM}`,
            borderBlockEnd: `${unit(token.lineWidth)} dashed ${token.colorSplit}`,
          },
        },
      },
      '&-collapse-button': {
        display: 'flex',
        alignItems: 'center',
        color: token.colorPrimary,
      },
    },
  }
}

export default useStyle('ProQueryFilter', (token) => {
  const proQueryFilterToken = mergeToken<ProQueryFilterToken>(token, {})
  return [genProQueryFilterStyle(proQueryFilterToken)]
})
