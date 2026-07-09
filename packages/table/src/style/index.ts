import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { Keyframes, mergeToken } from '@antdv-next/cssinjs'

export interface ProTableToken extends ProAliasCssVarToken {
}

export const turn = new Keyframes('turn', {
  '0%': { transform: 'rotate(0deg)' },
  '25%': { transform: 'rotate(90deg)' },
  '50%': { transform: 'rotate(180deg)' },
  '75%': { transform: 'rotate(270deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

export const genProTableStyle: GenerateStyle<ProTableToken> = (token) => {
  return {
    [token.componentCls]: {
      zIndex: 1,
      [`${token.antCls}-table-wrapper ${token.antCls}-table-pagination${token.antCls}-pagination`]:
        {
          marginBlockEnd: 0,
        },
      '&:not(:root):fullscreen': {
        minHeight: '100vh',
        overflow: 'auto',
        background: token.colorBgContainer,
      },
      '&-extra': {
        marginBlockEnd: 16,
      },
      '&-polling': {
        [`${token.componentCls}-list-toolbar-setting-item`]: {
          '.anticon.anticon-reload': {
            transform: 'rotate(0deg)',
            animationName: turn,
            animationDuration: '1s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          },
        },
      },
      [`td${token.antCls}-table-cell`]: {
        '>a': {
          fontSize: token.fontSize,
        },
      },
      [`${token.antCls}-table${token.antCls}-table-tbody${token.antCls}-table-wrapper:only-child${token.antCls}-table`]:
        {
          marginBlock: 0,
          marginInline: 0,
        },
      [`${token.antCls}-table${token.antCls}-table-middle ${token.componentCls}`]: {
        marginBlock: 0,
        marginInline: -8,
        [`${token.proComponentsCls}-card`]: {
          backgroundColor: 'initial',
        },
      },
      '& &-search': {
        marginBlockEnd: 16,
        background: token.colorBgContainer,
        '&-ghost': {
          background: 'transparent',
        },
        [`&${token.componentCls}-form`]: {
          marginBlock: 0,
          marginInline: 0,
          paddingBlock: 0,
          paddingInline: 16,
          overflow: 'unset',
        },
        '&-light-filter': {
          marginBlockEnd: 0,
          paddingBlock: 0,
          paddingInline: 0,
        },
        '&-form-option': {
          [`${token.antCls}-form-item`]: {},
          [`${token.antCls}-form-item-label`]: {},
          [`${token.antCls}-form-item-control-input`]: {},
        },
        '@media (max-width: 575px)': {
          [token.componentCls]: {
            height: 'auto !important',
            paddingBlockEnd: 24,
            [`${token.antCls}-form-item-label`]: { minWidth: 80, textAlign: 'start' },
          },
        },
      },
      '&-toolbar': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        paddingInline: 24,
        paddingBlock: 0,
        '&-option': { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        '&-title': {
          flex: '1',
          color: token.colorTextLabel,
          fontWeight: '500',
          fontSize: 16,
          lineHeight: '24px',
          opacity: '0.85',
        },
      },
      [`${token.antCls}-table-cell`]: {
        [`${token.antCls}-form-item`]: {
          marginBlockStart: -5,
          marginBlockEnd: -5,
          marginInlineStart: 0,
          marginInlineEnd: 0,
        },
      },
      [`${token.antCls}-table-cell-resizable`]: {
        position: 'relative',
        [`${token.antCls}-table-cell-resizable-handle`]: {
          position: 'absolute',
          top: 0,
          insetInlineEnd: -4,
          zIndex: 10,
          width: 12,
          height: '100%',
          cursor: 'col-resize',
          userSelect: 'none',
          touchAction: 'none',
          '&::before': {
            position: 'absolute',
            top: '50%',
            height: '1.6em',
            insetInlineEnd: 4,
            transform: 'translateY(-50%)',
            width: 1,
            background: token.colorPrimary,
            opacity: 0,
            transition: `opacity ${token.motionDurationMid}`,
            content: '""',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    [`@media (max-width: ${token.screenXS})`]: {
      [token.componentCls]: {
        [`${token.antCls}-table`]: {
          width: '100%',
          overflowX: 'auto',
          '&-thead > tr,&-tbody > tr': {
            '> th,> td': {
              whiteSpace: 'pre',
              '>span': {
                display: 'block',
              },
            },
          },
        },
      },
    },
    '@media (max-width: 575px)': {
      [`${token.componentCls}-toolbar`]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: 'auto',
        marginBlockEnd: 16,
        marginInlineStart: 16,
        paddingBlock: 8,
        paddingInline: 8,
        paddingBlockStart: 16,
        lineHeight: 'normal',
        '&-title': {
          marginBlockEnd: 16,
        },
        '&-option': { display: 'flex', justifyContent: 'space-between', width: '100%' },
        '&-default-option': {
          display: 'flex',
          flex: '1',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
      },
    },
  }
}
export default useStyle('ProTable', (token) => {
  const proTableToken = mergeToken<ProTableToken>(token, {})
  return [genProTableStyle(proTableToken)]
})
