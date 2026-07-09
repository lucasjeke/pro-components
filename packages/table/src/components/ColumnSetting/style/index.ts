import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProTableColumnSettingToken extends ProAliasCssVarToken {
}

const genProTableColumnSettingStyle: GenerateStyle<ProTableColumnSettingToken> = (token) => {
  return {
    [token.componentCls]: {
      width: 'auto',
      '&-title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
      },
      '&-overlay': {
        [`${token.antCls}-popover-inner-content`]: {
          width: 200,
          paddingBlock: 0,
          paddingInline: 0,
          paddingBlockEnd: 8,
          [`${token.antCls}-tree-node-content-wrapper`]: {
            '&-normal': {
              '&:hover': {
                backgroundColor: 'transparent',
              },
            },
          },
        },
        [`${token.antCls}-tree-draggable-icon`]: { cursor: 'grab' },
        [`${token.antCls}-tree-treenode`]: {
          alignItems: 'center',
          '&:hover': {
            [`${token.componentCls}-list-item-option`]: {
              display: 'block',
            },
          },
          [`${token.antCls}-tree-checkbox`]: {
            marginInlineEnd: 4,
          },
          [`${token.antCls}-tree-title`]: {
            width: '100%',
          },
        },
      },
    },
    [`${token.componentCls}-action-rest-button`]: {
      color: token.colorPrimary,
    },
    [`${token.componentCls}-list`]: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBlockStart: 8,
      [`&${token.componentCls}-list-group`]: {
        paddingBlockStart: 0,
      },
      '&-title': {
        marginBlockStart: 6,
        marginBlockEnd: 6,
        paddingInlineStart: 24,
        color: token.colorTextSecondary,
        fontSize: 12,
      },

      '&-item': {
        display: 'flex',
        alignItems: 'center',
        maxHeight: 24,
        justifyContent: 'space-between',
        '&-title': {
          flex: 1,
          maxWidth: 80,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          wordBreak: 'break-all',
          whiteSpace: 'nowrap',
        },
        '&-option': {
          display: 'none',
          float: 'right',
          cursor: 'pointer',
          '> span': {
            '> span.anticon': {
              color: token.colorPrimary,
            },
          },
          '> span + span': {
            marginInlineStart: 4,
          },
        },
      },
    },
  }
}

export default useStyle('ProTableColumnSetting', (token) => {
  const proTableColumnSettingToken = mergeToken<ProTableColumnSettingToken>(token, {})
  return [genProTableColumnSettingStyle(proTableColumnSettingToken)]
})
