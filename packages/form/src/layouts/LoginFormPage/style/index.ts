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
          marginBlock: 24,
          marginInline: 24,
          paddingInline: 24,
          paddingBlock: 24,
          '&-title': { fontWeight: '500', fontSize: 28 },
          '&-subTitle': { marginBlockStart: 8, fontSize: 16 },
          '&-action': { marginBlockStart: 24 },
        },
      },
      '&-left': {
        display: 'flex',
        flex: '1',
        zIndex: 99,
        flexDirection: 'column',
        maxWidth: '550px',
        paddingInline: 0,
        paddingBlock: 32,
        overflow: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
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
        width: 44,
        height: 44,
        marginInlineEnd: 16,
        verticalAlign: 'top',
        img: {
          width: '100%',
        },
      },
      '&-desc': {
        marginBlockStart: 12,
        marginBlockEnd: 40,
        color: token.colorTextSecondary,
        fontSize: token.fontSize,
      },
      '&-main': {
        width: 328,
        margin: '0 auto',
        '&-other': {
          marginBlockStart: 24,
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
          padding: 24,
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
