import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProDragSortTableToken extends ProAliasCssVarToken {
}

const genProDragSortTableStyle: GenerateStyle<ProDragSortTableToken> = (token) => {
  return {
    [token.componentCls]: {
      '&-icon': {
        marginInlineEnd: 8,
        color: token.colorTextSecondary,
        cursor: 'grab !important',
        padding: 4,
        fontSize: 12,
        borderRadius: token.borderRadius,
        '&:hover': {
          color: token.colorText,
          backgroundColor: token.colorInfoBg,
        },
      },
      [`${token.antCls}-table-wrapper`]: {
        [`${token.antCls}-table`]: {
          '&-tbody': {
            [`${token.antCls}-table-row`]: {
              [`${token.antCls}-table-cell`]: {
              },
            },
          },
        },
      },
    },
  }
}

export default useStyle('ProDragSortTable', (token) => {
  const proDragSortTableToken = mergeToken<ProDragSortTableToken>(token, {})
  return [genProDragSortTableStyle(proDragSortTableToken)]
})
