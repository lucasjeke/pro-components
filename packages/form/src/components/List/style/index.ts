import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProFormListToken extends ProAliasCssVarToken {
  componentCls: string
}

const genProFormListStyle: GenerateStyle<ProFormListToken> = (token) => {
  return {
    // [`${token.antCls}-pro`]: {
    //   [`${token.antCls}-form:not(${token.antCls}-form-horizontal)`]: {
    //     [token.componentCls]: {
    //       [`&-item:not(${token.componentCls}-item-show-label)`]: {
    //         [`${token.antCls}-form-item-label`]: {
    //           display: 'none',
    //         },
    //       },
    //     },
    //   },
    // },
    [token.componentCls]: {
      maxWidth: '100%',
      boxSizing: 'border-box',
      '&-item': {
        '&&-show-label': {
          [`${token.antCls}-form-item-label`]: {
            display: 'inline-block',
          },
        },
        '&&-default:first-child': {
          'div:first-of-type': {
            [`${token.antCls}-form-item`]: {
              [`${token.antCls}-form-item-label`]: {
                display: 'inline-block',
              },
            },
          },
        },
        '&&-default:not(:first-child)': {
          'div:first-of-type': {
            [`${token.antCls}-form-item`]: {
              [`${token.antCls}-form-item-label`]: {
                display: 'none',
              },
            },
          },
        },
      },
      '&-action': {
        display: 'flex',
        height: token.controlHeight,
        marginBlockEnd: token.marginLG,
        lineHeight: `${token.controlHeight}px`,
        '&-small': {
          height: token.controlHeightSM,
          lineHeight: token.controlHeightSM,
        },
      },
      '&-action-icon': {
        marginInlineStart: 8,
        cursor: 'pointer',
        transition: 'color 0.3s ease-in-out',
        '&:hover': {
          color: token.colorPrimaryTextHover,
        },
      },
      [`${token.proComponentsCls}-card ${token.proComponentsCls}-card-extra`]: {
        [token.componentCls]: {
          '&-action': {
            marginBlockEnd: 0,
          },
        },
      },
      '&-creator-button-top': {
        marginBlockEnd: 24,
      },
    },
  }
}

export default useStyle('ProFormList', (token) => {
  const proFormListToken = mergeToken<ProFormListToken>(token, {})
  return [genProFormListStyle(proFormListToken)]
})
