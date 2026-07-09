import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProDrawerFormToken extends ProAliasCssVarToken {
}

const genProDrawerFormStyle: GenerateStyle<ProDrawerFormToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      '&-sidebar-dragger': {
        width: 5,
        cursor: 'ew-resize',
        padding: '4px 0 0',
        borderTop: `${unit(token.lineWidth)} ${token.lineType} transparent`,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: 'transparent',
        '&-min-disabled': {
          cursor: 'w-resize',
        },
        '&-max-disabled': {
          cursor: 'e-resize',
        },
      },
    },
  }
}

export default useStyle('ProDrawerForm', (token) => {
  const proDrawerFormToken = mergeToken<ProDrawerFormToken>(token, {})
  return [genProDrawerFormStyle(proDrawerFormToken)]
})
