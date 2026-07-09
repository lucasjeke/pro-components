import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProStepsFormToken extends ProAliasCssVarToken {
}

const genProStepsFormStyle: GenerateStyle<ProStepsFormToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      '&-container': {
        width: 'max-content',
        minWidth: 420,
        maxWidth: '100%',
        margin: 'auto',
      },
      '&-steps-container': {
        maxWidth: 1160,
        margin: 'auto',
        [`${token.antCls}-steps-vertical`]: { height: '100%' },
      },
      '&-step': {
        display: 'none',
        marginBlockStart: 32,
        '&-active': {
          display: 'block',
        },
        '> form': { maxWidth: '100%' },
      },
    },
  }
}

export default useStyle('ProStepsForm', (token) => {
  const proStepsFormToken = mergeToken<ProStepsFormToken>(token, {})
  return [genProStepsFormStyle(proStepsFormToken)]
})
