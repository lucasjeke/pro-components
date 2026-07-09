import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface SettingDrawerToken extends ProAliasCssVarToken {
}

const genSettingDrawerStyle: GenerateStyle<SettingDrawerToken> = (token) => {
  return {
    [`${token.componentCls}-handle`]: {
      position: 'absolute',
      insetBlockStart: 240,
      insetInlineEnd: 300,
      zIndex: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      fontSize: 16,
      textAlign: 'center',
      backgroundColor: token.colorPrimary,
      borderEndStartRadius: token.borderRadiusLG,
      borderStartStartRadius: token.borderRadiusLG,
      '-webkit-backdropilter': 'saturate(180%) blur(20px)',
      backdropFilter: 'saturate(180%) blur(20px)',
      cursor: 'pointer',
      pointerEvents: 'auto',
    },
    [`${token.componentCls}-handle-container`]: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      [`${token.componentCls}-handle`]: {
        insetInlineEnd: 0,
      },
    },
    [token.componentCls]: {
      '&-collapsed': {
        [`${token.antCls}-drawer-content-wrapper`]: {
          display: 'block !important',
          transform: 'translateX(100%) !important',
        },
      },
      '&-realDark': {
        [`${token.componentCls}-body-title`]: {
          color: 'rgb(229, 224, 216)',
        },
        [`${token.componentCls}-content`]: {
          [`${token.componentCls}-block-checkbox`]: {
            '&-item': {
              '&-realDark': {
                backgroundColor: 'rgba(15, 28, 41, 0.85)',
                boxShadow: '0px 1px 2.5px rgba(13, 13, 13, 0.18)',
                '&::before': {
                  backgroundColor: 'rgba(15, 28, 41,0.65)',
                },
                '&::after': {
                  backgroundColor: 'rgba(15, 28, 41,0.85)',
                },
              },
              '&-light': {
                backgroundColor: 'rgb(42, 44, 44)',
                boxShadow: 'rgba(13, 13, 13, 0.18) 0px 1px 2.5px',
                '&::before': { backgroundColor: 'rgb(36, 37, 37)' },
                '&::after': { backgroundColor: 'rgb(36, 37, 37)' },
              },
              '&-dark,&-side': {
                backgroundColor: 'rgb(42, 44, 44)',
                boxShadow: 'rgba(13, 13, 13, 0.18) 0px 1px 2.5px',
                '&::before': { zIndex: '1', backgroundColor: '#0f1c29' },
                '&::after': { backgroundColor: 'rgb(36, 37, 37)' },
              },
              '&-top': {
                backgroundColor: 'rgb(42, 44, 44)',
                boxShadow: 'rgba(13, 13, 13, 0.18) 0px 1px 2.5px',
                '&::after': { backgroundColor: 'rgb(15 28 41)' },
              },
              '&-mix': {
                backgroundColor: 'rgb(42, 44, 44)',
                boxShadow: 'rgba(13, 13, 13, 0.18) 0px 1px 2.5px',
                '&::before': { backgroundColor: 'rgb(36, 37, 37)' },
                '&::after': { backgroundColor: '#0f1c29' },
              },
              '&-left': {
                backgroundColor: 'rgb(42, 44, 44)',
                boxShadow: 'rgba(13, 13, 13, 0.18) 0px 1px 2.5px',
                '&-inner': {
                  backgroundColor: 'rgb(36, 37, 37)',
                },
                '&::before': { backgroundColor: '#0f1c29' },
                '&::after': { backgroundColor: 'rgb(36, 37, 37)' },
              },
            },
          },
        },
      },
      '&-content': {
        position: 'relative',
      },
      '&-body-title': {
        marginBlock: token.marginXS,
        fontSize: 14,
        lineHeight: '22px',
        color: token.colorTextHeading,
      },
      '&-block-checkbox': {
        display: 'flex',
        minHeight: 42,
        gap: token.marginSM,
        '& &-item': {
          position: 'relative',
          width: 44,
          height: 36,
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow: '0 1px 2.5px rgba(0,0,0,.18)',
          cursor: 'pointer',
          [`&:not(&-top):not(&-left)::before`]: {
            content: '\'\'',
            position: 'absolute',
            insetBlockStart: 0,
            insetInlineStart: 0,
            width: '33%',
            height: '100%',
          },
          '&::after': {
            position: 'absolute',
            insetBlockStart: 0,
            insetInlineStart: 0,
            width: '100%',
            height: '25%',
            content: '\'\'',
          },
          '&-realDark': {
            backgroundColor: 'rgba(0, 21, 41, 0.85)',
            '&::before': { backgroundColor: 'rgba(0, 0, 0, 0.65)' },
            '&::after': { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
          },
          '&-light': {
            backgroundColor: '#f0f2f5',
            '&::before': { backgroundColor: '#fff' },
            '&::after': { backgroundColor: '#fff' },
          },
          '&-dark,&-side': {
            backgroundColor: '#f0f2f5',
            '&::before': { zIndex: 1, backgroundColor: '#001529' },
            '&::after': { backgroundColor: '#fff' },
          },
          '&-top': {
            backgroundColor: '#f7f8fa',
            '&::after': { backgroundColor: '#001529' },
          },
          '&-mix': {
            backgroundColor: '#f7f8fa',
            '&::before': { backgroundColor: '#fff' },
            '&::after': { backgroundColor: '#001529' },
          },
          '&-left': {
            backgroundColor: '#f7f8fa',
            '&-inner': {
              position: 'absolute',
              insetInlineStart: 0,
              insetBlockStart: 0,
              width: '33%',
              height: '100%',
              backgroundColor: '#fff',
            },
            '&::before': {
              content: '\'\'',
              position: 'absolute',
              insetBlockStart: 0,
              insetInlineStart: 0,
              backgroundColor: '#001529',
              width: '16%',
              zIndex: 1,
              height: '100%',
            },
            '&::after': { backgroundColor: '#ffff' },
          },
        },
        '& &-selectIcon': {
          position: 'absolute',
          insetInlineEnd: 6,
          insetBlockEnd: 4,
          color: token.colorPrimary,
          fontWeight: 'bold',
          fontSize: 14,
          pointerEvents: 'none',
          '.action': { color: token.colorPrimary },
        },
        '& &-icon': {
          fontSize: 56,
          lineHeight: '56px',
        },
      },
      '&-theme-color': {
        marginBlockStart: 16,
        overflow: 'hidden',
        '& &-block': {
          float: 'left',
          width: 20,
          height: 20,
          lineHeight: '20px',
          marginBlockStart: 8,
          marginInlineEnd: 8,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: 2,
          cursor: 'pointer',
        },
      },
      '&-list': {
        [`li${token.antCls}-list-item`]: {
          paddingInline: 0,
          paddingBlock: 8,
        },
      },
    },
  }
}

export default useStyle('ProLayoutSettingDrawer', (token) => {
  const settingDrawerToken = mergeToken<SettingDrawerToken>(token, {})
  return [genSettingDrawerStyle(settingDrawerToken)]
})
