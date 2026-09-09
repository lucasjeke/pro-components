import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProModalFormToken extends ProAliasCssVarToken {
}

const genProModalFormStyle: GenerateStyle<ProModalFormToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-fullscreenable': {
        [`&${token.componentCls}-is-fullscreen`]: {
          insetBlockStart: 0,
          maxWidth: '100vw',
          height: '100%',
          margin: 0,
          [`${token.antCls}-modal-render`]: {
            height: '100%',
          },
          [`${token.antCls}-modal-container`]: {
            height: '100%',
            [`${token.antCls}-modal-body`]: {
              height: token.calc('100%').sub(76).equal(),
              overflow: 'auto',
            },
          },
        },
        [`${token.componentCls}-title`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '&-text': {
            display: 'flex',
            flex: `1 1 ${unit(token.controlHeight)}`,
          },
        },
        [`${token.componentCls}-fullscreen`]: {
          paddingInline: 0,
          width: token.controlHeight,
          color: token.colorIcon,
          fontSize: token.fontSizeLG,
          marginBlockStart: token.calc(token.marginXS).sub(token.margin).equal(),
          marginInlineEnd: token.marginLG,
          '&:hover': {
            color: token.colorIconHover,
          },
        },
      },
      '&-draggable': {
        [`&:not(${token.componentCls}-is-fullscreen)`]: {
          [`${token.antCls}-modal-header`]: {
            [`${token.componentCls}-title`]: {
              '&-text': {
                cursor: 'move',
              },
            },
          },
        },
      },
    },
  }
}
export default useStyle('ProModalForm', (token) => {
  const proModalFormToken = mergeToken<ProModalFormToken>(token, {})
  return [genProModalFormStyle(proModalFormToken)]
})
