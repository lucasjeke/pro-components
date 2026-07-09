import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface FooterToolBarToken extends ProAliasCssVarToken {
}

const genFooterToolBarStyle: GenerateStyle<FooterToolBarToken> = (token) => {
  return {
    [token.componentCls]: {
      position: 'fixed',
      insetInlineEnd: 0,
      bottom: 0,
      zIndex: 8,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      paddingInline: 24,
      paddingBlock: 0,
      boxSizing: 'border-box',
      lineHeight: '44px',
      backgroundColor: token.colorBgElevated,
      borderBlockStart: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      boxShadow: token.boxShadowSecondary,
      transition: `all ${token.motionDurationMid}`,
      '&-left': {
        flex: 1,
      },
      '&-right': {
        '> *': {
          marginInlineEnd: 8,
          '&:last-child': {
            marginBlock: 0,
            marginInline: 0,
          },
        },
      },
    },
  }
}

export default useStyle('ProLayoutFooterToolbar', (token) => {
  const proCardToken = mergeToken<FooterToolBarToken>(token, {
  })
  return [genFooterToolBarStyle(proCardToken)]
})
