import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLabelIconTipToken extends ProAliasCssVarToken {
}

const genProLabelIconTipStyle: GenerateStyle<ProLabelIconTipToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'inline-flex',
      alignItems: 'center',
      maxWidth: '100%',
      '&-icon': {
        display: 'block',
        marginInlineStart: 4,
        cursor: 'pointer',
        '&:hover': {
          color: token.colorPrimary,
        },
      },
      '&-title': { display: 'inline-flex', flex: '1' },
      '&-subtitle ': {
        marginInlineStart: 8,
        color: token.colorTextSecondary,
        fontWeight: 'normal',
        fontSize: token.fontSize,
        whiteSpace: 'nowrap',
      },
      '&-title-ellipsis': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
    },
  }
}

export default useStyle('LabelIconTip', (token) => {
  const proLabelIconTipToken = mergeToken<ProLabelIconTipToken>(token, {})
  return [genProLabelIconTipStyle(proLabelIconTipToken)]
})
