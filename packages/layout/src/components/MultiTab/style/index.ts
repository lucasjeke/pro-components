import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProMultiTabToken extends ProAliasCssVarToken {}

const genProMultiTabStyle: GenerateStyle<ProMultiTabToken> = (token) => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [`&${token.antCls}-tabs`]: {
        backgroundColor: token.colorBgContainer,
        width: '100%',
        paddingBlockStart: token.paddingXS,
        zIndex: 8,
        [`&${token.antCls}-tabs-card${token.antCls}-tabs-top`]: {
          [`${token.antCls}-tabs-nav`]: {
            [`${token.antCls}-tabs-tab+${token.antCls}-tabs-tab`]: {
              marginInlineStart: token.calc(token.marginXS).sub(3).equal(),
            },
          },
        },
        [`${componentCls}-extra-left`]: {
          width: 24,
        },
        [`${componentCls}-title`]: {
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
          [`${componentCls}-icon`]: {
            paddingInlineEnd: token.paddingXXS,
          },
          [`${componentCls}-title-text`]: {
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          [`${componentCls}-action-icon-first`]: {
            marginInlineStart: token.paddingXS,
          },
          [`${componentCls}-reload-btn`]: {
            fontSize: token.fontSizeSM,
            color: token.colorIcon,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            transition: `all ${token.motionDurationSlow}`,
            '&:hover': {
              color: token.colorText,
            },
          },
          [`${componentCls}-close-btn`]: {
            fontSize: token.fontSizeSM,
            color: token.colorIcon,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            transition: `all ${token.motionDurationSlow}`,
            '&:hover': {
              color: token.colorText,
            },
          },
        },
      },
      '&-dropdown-menu-btn': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        marginInlineEnd: token.marginXS,
        padding: token.paddingSM,
      },
      '&-fixed': {
        position: 'fixed',
        insetBlockStart: token.proLayoutHeaderHeightLayoutHeader || 56,
        insetInlineEnd: 0,
        // zIndex: 9,
      },
    },
  }
}

export default useStyle('ProMultiTab', (token) => {
  const proMultiTabToken = mergeToken<ProMultiTabToken>(token, {})
  return [genProMultiTabStyle(proMultiTabToken)]
})
