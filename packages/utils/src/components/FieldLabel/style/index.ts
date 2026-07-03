import type { GenerateStyle, ProAliasToken } from '@antdv-next1/pro-provider'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'

export interface ProToken extends ProAliasToken {
  componentCls: string
}

const genProStyle: GenerateStyle<ProToken> = (token) => {
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
        border: `${token.lineWidth}px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        '&-active': {
          backgroundColor: 'none',
        },
      },
      '&-borderless': {
        height: 30,
        lineHeight: '34px',
        '&-active': {
          backgroundColor: token.colorBgTextHover,
        },
      },
      '&-filled': {
        height: 34,
        lineHeight: '34px',
        backgroundColor: token.colorBgTextHover,
        border: `${token.lineWidth}px solid transparent`,
        '&:hover': {
          border: `${token.lineWidth}px solid ${token.colorPrimary}`,
          backgroundColor: token.colorBgTextHover,
        },
      },
      '&-underlined': {
        height: 34,
        lineHeight: '34px',
        borderRadius: 0,
        borderBottom: `${token.lineWidth}px solid ${token.colorSplit}`,
        '&:hover': {
          borderBottom: `${token.lineWidth}px solid ${token.colorPrimary}`,
          backgroundColor: token.colorBgTextHover,
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

export function useStyle(prefixCls: ComputedRef<string>) {
  return useAntdStyle('FieldLabel', (token) => {
    const proToken: ProToken = {
      ...token,
      componentCls: `.${prefixCls.value}`,
    }

    return [genProStyle(proToken)]
  })
}
