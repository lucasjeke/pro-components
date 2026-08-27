import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { setAlpha, useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLoginFormPageToken extends ProAliasCssVarToken {
}

const genProLoginFormPageStyle: GenerateStyle<ProLoginFormPageToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '&-notice': {
        display: 'flex',
        flex: '1',
        zIndex: 99,
        alignItems: 'flex-end',
        '&-activity': {
          marginBlock: token.marginLG,
          marginInline: token.marginLG,
          paddingInline: token.marginLG,
          paddingBlock: token.marginLG,
          '&-title': { fontWeight: '500', fontSize: 28 },
          '&-subTitle': { marginBlockStart: 8, fontSize: token.fontSizeLG },
          '&-action': { marginBlockStart: token.marginLG },
        },
      },
      '&-left': {
        display: 'flex',
        flex: '1',
        zIndex: 99,
        flexDirection: 'column',
        maxWidth: '550px',
        paddingInline: 0,
        paddingBlock: token.paddingXL,
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: token.paddingLG,
        height: 'max-content',
        margin: 'auto',
      },
      '&-container': {
        borderRadius: token.borderRadius,
        backgroundSize: '100%',
        backgroundPosition: 'top',
        backdropFilter: 'blur(10px)',
        backgroundColor: setAlpha(token.colorBgContainer, 0.8),
        backgroundImage:
          'radial-gradient(circle at 93% 1e+02%, rgba(22,119,255,0.17) 0%, rgba(255,255,255,0.05) 23%, rgba(255,255,255,0.03) 87%, rgba(22,119,255,0.12) 109%)',
        padding: 32,
        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
      },
      '&-top': {
        textAlign: 'center',
      },
      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        lineHeight: '44px',
        a: {
          textDecoration: 'none',
        },
      },
      '&-title': {
        position: 'relative',
        insetBlockStart: 2,
        color: token.colorTextHeading,
        fontWeight: '600',
        fontSize: 33,
      },
      '&-logo': {
        width: token.calc(token.fontSizeXL).mul(2).add(4).equal(),
        height: token.calc(token.fontSizeXL).mul(2).add(4).equal(),
        marginInlineEnd: token.margin,
        verticalAlign: 'top',
        fontSize: token.calc(token.fontSizeXL).mul(2).add(4).equal(),
        color: token.colorTextHeading,
        img: {
          width: '100%',
        },
        [`${token.iconCls}`]: {
          fontSize: token.calc(token.fontSizeXL).mul(2).add(4).equal(),
        },
      },
      '&-desc': {
        marginBlockStart: token.marginSM,
        marginBlockEnd: token.calc(token.marginXL).mul(2).sub(2).equal(),
        color: token.colorTextSecondary,
        fontSize: token.fontSize,
      },
      '&-main': {
        width: 328,
        margin: '0 auto',
        '&-other': {
          marginBlockStart: token.marginLG,
          lineHeight: '22px',
          textAlign: 'start',
        },
      },
    },
    [`@media (max-width: ${token.screenMDMin}px)`]: {
      [token.componentCls]: {
        flexDirection: 'column-reverse',
        background: 'none !important',
        '&-container': {
          padding: token.paddingLG,
          boxShadow: 'none',
          backgroundImage: 'none',
          borderRadius: 0,
        },
        '&-notice': {
          display: 'flex',
          flex: 'none',
          alignItems: 'flex-start',
          width: '100%',
          '> div': {
            width: '100%',
          },
        },
      },
    },
    [`@media (min-width: ${token.screenMDMin}px)`]: {
      [token.componentCls]: {
        '&-left': {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 110px',
          backgroundSize: '100%',
        },
      },
    },
    [`@media (max-width: ${token.screenSM}px)`]: {
      [token.componentCls]: {
        '&-main': { width: '95%', maxWidth: 328 },
      },
    },
  }
}

export default useStyle('ProLoginFormPage', (token) => {
  const proLoginFormPageToken = mergeToken<ProLoginFormPageToken>(token, {})

  return [genProLoginFormPageStyle(proLoginFormPageToken)]
})
