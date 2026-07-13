import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

export interface ProFieldLabelToken extends ProAliasCssVarToken {
}

const genProStyle: GenerateStyle<ProFieldLabelToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      display: 'inline-flex',
      gap: token.marginXXS,
      alignItems: 'center',
      height: 30,
      paddingBlock: 0,
      paddingInline: token.paddingXS,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      borderRadius: token.borderRadius,
      // cornerShape: 'squircle',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
      '&-active': {
        paddingBlock: 0,
        paddingInline: 8,
        [`&${token.componentCls}-allow-clear:hover:not(${token.componentCls}-disabled)`]:
          {
            [`${token.componentCls}-arrow`]: {
              display: 'none',
            },
            [`${token.componentCls}-close`]: {
              display: 'inline-flex',
            },
          },
      },
      [`${token.antCls}-select`]: {
        [`${token.antCls}-select-clear`]: {
          borderRadius: '50%',
        },
      },
      [`${token.antCls}-picker`]: {
        [`${token.antCls}-picker-clear`]: {
          borderRadius: '50%',
        },
      },
      '&-icon': {
        color: token.colorIcon,
        transition: `color ${token.motionDurationSlow}`,
        fontSize: token.fontSizeIcon,
        verticalAlign: 'middle',
        [`&${token.componentCls}-close`]: {
          display: 'none',
          fontSize: token.fontSizeIcon,
          alignItems: 'center',
          justifyContent: 'center',
          color: token.colorTextQuaternary,
          borderRadius: '50%',
        },
        '&:hover': {
          color: token.colorIconHover,
        },
      },
      '&-disabled': {
        color: token.colorTextPlaceholder,
        cursor: 'not-allowed',
        [`${token.componentCls}-icon`]: {
          color: token.colorTextPlaceholder,
        },
      },
      '&-outlined': {
        height: 34,
        lineHeight: '34px',
        paddingBlock: 0,
        paddingInline: 8,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        '&:hover': {
          backgroundColor: 'transparent',
          borderColor: token.colorPrimary,
        },
        '&-active': {
          backgroundColor: 'transparent',
          '&:focus-visible,&:has(input:focus-visible)': {
            outline: `${unit(token.lineWidth)} ${token.lineType} ${token.colorPrimary}`,
            outlineOffset: token.calc(token.lineWidth).mul(-1).equal({ unit: false }),
            transition: 'outline-offset 0s, outline 0s',
          },
        },
        [`${token.antCls}-picker`]: {
          [`&${token.antCls}-picker-borderless:focus-visible,&${token.antCls}-picker-borderless:has(input:focus-visible),&${token.antCls}-picker-borderless:has(textarea:focus-visible)`]: {
            outline: 'none',
          },
        },
        [`${token.antCls}-select`]: {
          [`&${token.antCls}-select-borderless:not(&${token.antCls}-select-disabled):has(input:focus-visible)`]: {
            outline: 'none',
          },
        },
      },
      '&-borderless': {
        height: 30,
        lineHeight: '34px',
        boxSizing: 'border-box',
        border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
        '&:hover': {
          backgroundColor: 'transparent',
          borderColor: token.colorPrimary,
        },
        '&-active': {
          // backgroundColor: token.colorBgTextHover,
          '&:focus-visible,&:has(input:focus-visible)': {
            outline: `${unit(token.lineWidth)} ${token.lineType} ${token.colorPrimary}`,
            outlineOffset: token.calc(token.lineWidth).mul(-1).equal({ unit: false }),
            transition: 'outline-offset 0s, outline 0s',
          },
        },
        [`${token.antCls}-select`]: {
          [`&${token.antCls}-select-borderless:not(&${token.antCls}-select-disabled):has(input:focus-visible)`]: {
            outline: 'none',
          },
        },
        [`${token.antCls}-picker`]: {
          [`&${token.antCls}-picker-borderless:focus-visible,&${token.antCls}-picker-borderless:has(input:focus-visible)`]: {
            outline: 'none',
          },
        },
      },
      '&-filled': {
        height: 34,
        lineHeight: '34px',
        backgroundColor: token.colorBgTextHover,
        border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
        '&:hover': {
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorPrimary}`,
          backgroundColor: token.colorBgTextHover,
        },
        [`${token.antCls}-picker`]: {
          [`&${token.antCls}-picker-borderless:focus-visible,&${token.antCls}-picker-borderless:has(input:focus-visible),&${token.antCls}-picker-borderless:has(textarea:focus-visible)`]: {
            outline: 'none',
          },
        },
        [`${token.antCls}-select`]: {
          [`&${token.antCls}-select-borderless:not(&${token.antCls}-select-disabled):has(input:focus-visible)`]: {
            outline: 'none',
          },
        },
      },
      '&-underlined': {
        height: 34,
        lineHeight: '34px',
        borderRadius: 0,
        borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        '&:hover': {
          borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorPrimary}`,
          backgroundColor: token.colorBgTextHover,
        },
        [`${token.antCls}-picker`]: {
          [`&${token.antCls}-picker-borderless:focus-visible,&${token.antCls}-picker-borderless:has(input:focus-visible),&${token.antCls}-picker-borderless:has(textarea:focus-visible)`]: {
            outline: 'none',
          },
        },
        [`${token.antCls}-select`]: {
          [`&${token.antCls}-select-borderless:not(&${token.antCls}-select-disabled):has(input:focus-visible)`]: {
            outline: 'none',
          },
        },
      },
      '&-bordered&-small': {
        height: 24,
        lineHeight: '24px',
        paddingBlock: 0,
        paddingInline: 8,
      },
      '&-bordered&-active': {
        backgroundColor: token.colorBgContainer,
      },
      '&-small': {
        height: 24,
        lineHeight: '24px',
        paddingBlock: 0,
        paddingInline: 4,
        fontSize: token.fontSizeSM,
        [`${token.antCls}-select-borderless`]: {
          paddingBlock: 0,
        },
        [`${token.antCls}-picker-borderless`]: {
          paddingBlock: 0,
        },
        [`&${token.componentCls}-active`]: {
          paddingBlock: 0,
          paddingInline: 8,
        },
        [`${token.componentCls}-icon`]: {
          paddingBlock: 0,
          paddingInline: 0,
        },
        [`${token.componentCls}-close`]: {
          marginBlockStart: -2,
          paddingBlock: 4,
          paddingInline: 4,
        },
      },
    },
  }
}

export default useStyle('FieldLabel', (token) => {
  const proFieldLabelToken = mergeToken<ProFieldLabelToken>(token, {})

  return [genProStyle(proFieldLabelToken)]
})
