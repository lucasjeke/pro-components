import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { Keyframes, mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProHelpToken extends ProAliasCssVarToken {
}

export const actionsInputAnimal = new Keyframes('actionsInputAnimal', {
  '0%': { width: 0 },
  '30%': { width: 20 },
  '100%': { width: 120 },
})
const genProHelpStyle: GenerateStyle<ProHelpToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-popover-text': {
        color: token.colorPrimary,
        cursor: 'pointer',
        boxSizing: 'border-box',
      },
      '&-popover-content': {
        maxWidth: 300,
        height: 600,
        maxHeight: token.calc?.('100vh').sub(200).equal(),
        overflow: 'auto',
        paddingInline: 20,
        paddingBlockStart: 24,
        paddingBlockEnd: 32,
        boxSizing: 'border-box',
      },
      '&-left-panel': {
        overflow: 'auto',
        boxSizing: 'border-box',
        borderInlineEnd: `${unit(token?.lineWidth)} ${token.lineType} ${token?.colorBorderSecondary}`,
        minHeight: 648,
        minWidth: 190,
        maxWidth: 190,
        '&-menu': {
          width: 190,
          boxSizing: 'border-box',
          minWidth: 190,
          height: token.calc('100%').sub(40).equal(),
          marginBlock: 20,
        },
      },
      '&-content': {
        '&-render': {
          paddingBlock: 20,
          paddingInline: 24,
          flex: 1,
        },
        '&-footer': {
          padding: 8,
        },
        '&-panel': {
          minWidth: 200,
          overflow: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          minHeight: 648,
          img: {
            width: '100%',
          },
        },
      },
      '&-actions': {
        display: 'flex',
        boxSizing: 'border-box',
        gap: token.marginSM,
        '&-item': {
          display: 'flex',
          boxSizing: 'border-box',
          alignItems: 'center',
          justifyItems: 'center',
          padding: 4,
          height: 24,
          minWidth: 24,
          cursor: 'pointer',
          borderRadius: token.borderRadius,
          '&:hover': {
            backgroundColor: token.colorBgTextHover,
          },
        },
        '&-input': {
          // margin: 0,
          maxWidth: 120,
          // padding: 0,
          width: 120,
          // boxSizing: 'border-box',
          // borderRadius: token.borderRadius,
          // backgroundColor: token.colorBgTextHover,
          animationName: actionsInputAnimal,
          animationDuration: '0.1s',
          animationTimingFunction: 'linear',
        },
      },
      '&-search-list-item-content': {
        flex: 'auto',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '&-light': {
          color: token.colorPrimary,
        },
      },
    },
  }
}

export default useStyle('ProHelp', (token) => {
  const proHelpToken = mergeToken<ProHelpToken>(token, {})
  return [genProHelpStyle(proHelpToken)]
})
