import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProFieldCheckboxToken extends ProAliasCssVarToken {
}

const genProFieldCheckboxStyle: GenerateStyle<ProFieldCheckboxToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-error': {
        span: {
          color: token.colorError,
        },
      },
      '&-warning': {
        span: {
          color: token.colorWarning,
        },
      },
      '&-vertical': {
        // ant design 5
        [`&${token.antCls}-checkbox-group`]: {
          display: 'inline-block',
        },
        // ant design 5
        [`${token.antCls}-checkbox-wrapper+${token.antCls}-checkbox-wrapper`]: {
          'margin-inline-start': '0  !important',
        },
        // ant design 4
        [`${token.antCls}-checkbox-group-item`]: {
          display: 'flex',
          marginInlineEnd: 0,
        },
      },
    },
  }
}

export default useStyle('ProFieldCheckbox', (token) => {
  const proFieldCheckboxToken = mergeToken<ProFieldCheckboxToken>(token, {})

  return [genProFieldCheckboxStyle(proFieldCheckboxToken)]
})
