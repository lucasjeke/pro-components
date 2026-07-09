import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProFormGroupToken extends ProAliasCssVarToken {
}

const genProFormGroupStyle: GenerateStyle<ProFormGroupToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-title': { marginBlockEnd: token.marginXL, fontWeight: 'bold' },
      '&-container': {
        flexWrap: 'wrap',
        maxWidth: '100%',
        [`> div${token.antCls}-space-item`]: {
          maxWidth: '100%',
        },
      },
      '&-twoLine': {
        display: 'block',
        width: '100%',
        [`${token.componentCls}-title`]: { width: '100%', margin: '8px 0' },
        [`${token.componentCls}-container`]: { paddingInlineStart: 16 },
        [`${token.antCls}-space-item,${token.antCls}-form-item`]: {
          width: '100%',
        },
        [`${token.antCls}-form-item`]: {
          '&-control': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            '&-input': {
              alignItems: 'center',
              justifyContent: 'flex-end',
              '&-content': {
                flex: 'none',
              },
            },
          },
        },
      },
    },
  }
}

export default useStyle('ProFormGroup', (token) => {
  const proFormGroupToken = mergeToken<ProFormGroupToken>(token, {})
  return [genProFormGroupStyle(proFormGroupToken)]
})
