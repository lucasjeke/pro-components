import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { CSSInterpolation } from '@antdv-next/cssinjs'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken, unit } from '@antdv-next/cssinjs'

interface ProCardToken extends ProAliasCssVarToken {
  gridColumns: number
}
const genProCardStyle: GenerateStyle<ProCardToken> = (token) => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [`${token.antCls}-card-body`]: {
        height: '100%',
      },
      [`&${token.antCls}-collapse`]: {
        position: 'relative',
        borderColor: token.colorBorderSecondary,
        backgroundColor: 'transparent',
        [`&:not(${componentCls}-split)`]: {
          [`${token.antCls}-collapse-item`]: {
            [`${token.antCls}-collapse-header`]: {
              paddingBlockEnd: `${unit(token.padding)} !important`,
            },
          },
          [`${token.antCls}-collapse-item`]: {
            '&-active': {
              [`${token.antCls}-collapse-panel`]: {
                [`${token.antCls}-collapse-body`]: {
                  paddingBlockStart: `${unit(token.paddingLG)} !important`,
                },
              },
            },
          },
        },
        [`&${componentCls}-split:not(${token.antCls}-collapse-small)`]: {
          [`${token.antCls}-collapse-item:not(${token.antCls}-collapse-item-active)`]: {
            [`${token.antCls}-collapse-header`]: {
              paddingBlockEnd: `${unit(token.padding)} !important`,
            },
          },
        },
        [`&${token.antCls}-collapse-borderless`]: {
          [`${token.antCls}-collapse-item`]: {
            [`${token.antCls}-collapse-panel`]: {
              [`${token.antCls}-collapse-body`]: {
                paddingBlockStart: token.paddingSM,
              },
            },
          },
        },
        [`&${token.componentCls}-type-inner`]: {
          [`&:not(${token.antCls}-collapse-small)`]: {
            [`${token.antCls}-collapse-header`]: {
              paddingBlockEnd: `${unit(token.padding)} !important`,
            },
          },
          [`${token.antCls}-collapse-panel`]: {
            borderBlockStart: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
          },
        },
        [`&${componentCls}-headerBordered`]: {
          borderBlockStart: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        },
        [`${token.antCls}-collapse-panel`]: {
          borderBlockStart: `${unit(0)} ${token.lineType} ${token.colorBorderSecondary}`,
          boxSizing: 'border-box',
          borderBottomLeftRadius: token.borderRadius,
          borderBottomRightRadius: token.borderRadius,
          [`${token.antCls}-collapse-body`]: {
            height: '100%',
          },
        },
        '&&-ghost': {
          [`${token.antCls}-collapse-item`]: {
            [`${componentCls}-header`]: {
              borderRadius: 0,
            },
            [`${token.antCls}-collapse-content`]: {
              '&-box': {
                padding: token.paddingLG,
              },
            },
          },
        },
        [`&:not(${token.antCls}-collapse-small) ${token.antCls}-collapse-item`]: {
          borderBlockEnd: 0,
          boxSizing: 'border-box',
          '&-active': {
            [`${token.antCls}-collapse-header`]: {
              transition: 'none',
              paddingBlockEnd: 0,
            },
          },
          [`${token.antCls}-collapse-header`]: {
            lineHeight: 'inherit',

            [`${token.antCls}-collapse-title`]: {
              fontWeight: token.fontWeightStrong,
            },
            [`${token.antCls}-collapse-extra`]: {
              fontSize: token.fontSize,
              marginInlineStart: 0,
              lineHeight: '24px',
              fontWeight: 'normal',
            },
          },
        },
      },
      [`&${token.antCls}-card:not(${token.antCls}-card-bordered):not(&-box-shadow)`]: {
        boxShadow: 'none',
      },
      '&&-contain-card': {
        [`&:not(${token.antCls}-card-small)> ${token.antCls}-card-head`]: {
          minHeight: 0,
          paddingBlock: token.padding,
        },
        [`${token.antCls}-collapse-body`]: {
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          [`&${componentCls}-body-layout-center`]: {
            justifyContent: 'center',
          },
        },
      },
      [`${componentCls}-body-direction-column`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      [`${componentCls}-row`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      [`${componentCls}-split-vertical`]: {
        borderInlineEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      },
      [`${componentCls}-split-horizontal`]: {
        borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
      },
      [`&${token.antCls}-card&-ghost`]: {
        boxShadow: 'none',
        backgroundColor: 'transparent',
        [`& > ${token.antCls}-card-body`]: {
          paddingBlock: 0,
          paddingInline: 0,
          borderRadius: 0,
        },
      },
      '&-disabled': {
        backgroundColor: token.colorBgContainerDisabled,
        borderColor: token.colorBorder,
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
      },
    },
    [`${componentCls}-col`]: {
      position: 'relative',
      boxSizing: 'border-box',
      width: '100%',
      minHeight: 1,
    },
  }
}

function genLoopGridColumnsStyle(token: ProCardToken, sizeCls: string) {
  const { componentCls, gridColumns } = token
  return ((Array.from({ length: gridColumns + 1 })
    .fill(1)) as any[]).reduce((gridColumnsStyle: Record<string, any>, _, index) => {
    if (index === 0) {
      gridColumnsStyle[`${componentCls}-col${sizeCls}-${index}`] = {
        display: 'none',
      }
      gridColumnsStyle[`${componentCls}-push-${index}`] = {
        insetInlineStart: 'auto',
      }
      gridColumnsStyle[`${componentCls}-pull-${index}`] = {
        insetInlineEnd: 'auto',
      }
      gridColumnsStyle[`${componentCls}${sizeCls}-push-${index}`] = {
        insetInlineStart: 'auto',
      }
      gridColumnsStyle[`${componentCls}${sizeCls}-pull-${index}`] = {
        insetInlineEnd: 'auto',
      }
      gridColumnsStyle[`${componentCls}${sizeCls}-offset-${index}`] = {
        marginInlineEnd: 0,
      }
      gridColumnsStyle[`${componentCls}${sizeCls}-order-${index}`] = {
        order: 0,
      }
    }
    else {
      gridColumnsStyle[`${componentCls}-col${sizeCls}-${index}`] = {
        display: 'block',
        flex: `0 0 ${(index / gridColumns) * 100}%`,
        maxWidth: `${(index / gridColumns) * 100}%`,
      }
      gridColumnsStyle[`${componentCls}-col${sizeCls}-push-${index}`] = {
        insetInlineStart: `${(index / gridColumns) * 100}%`,
      }
      gridColumnsStyle[`${componentCls}-col${sizeCls}-pull-${index}`] = {
        insetInlineEnd: `${(index / gridColumns) * 100}%`,
      }
      gridColumnsStyle[`${componentCls}-col${sizeCls}-offset-${index}`] = {
        marginInlineStart: `${(index / gridColumns) * 100}%`,
      }
      gridColumnsStyle[`${componentCls}-col${sizeCls}-order-${index}`] = {
        order: index,
      }
    }
    return gridColumnsStyle
  }, {} as CSSInterpolation)
}

const genGridStyle: GenerateStyle<ProCardToken> = (token, sizeCls: string) =>
  genLoopGridColumnsStyle(token, sizeCls)

const genGridMediaStyle: GenerateStyle<ProCardToken> = (
  token,
  screenSize: number,
  sizeCls: string,
) => {
  return {
    [`@media (min-width: ${screenSize}px)`]: {
      ...(genGridStyle(token, sizeCls) as Record<string, any>),
    },
  }
}

export default useStyle('ProCard', (token) => {
  const proCardToken = mergeToken<ProCardToken>(token, {
    gridColumns: 24,
  })
  const gridMediaSizesMap = {
    '-xs': proCardToken.screenXSMin,
    '-sm': proCardToken.screenSMMin,
    '-md': proCardToken.screenMDMin,
    '-lg': proCardToken.screenLGMin,
    '-xl': proCardToken.screenXLMin,
    '-xxl': proCardToken.screenXXLMin,
  }
  return [
    genProCardStyle(proCardToken),
    genGridStyle(proCardToken, ''),
    genGridStyle(proCardToken, '-xs'),
    (Object.keys(gridMediaSizesMap) as (keyof typeof gridMediaSizesMap)[])
      .map(key => genGridMediaStyle(proCardToken, gridMediaSizesMap[key], key))
      .reduce(
        (pre, cur) => ({ ...pre, ...(cur as Record<string, any>) }),
        {} as Record<string, any>,
      ),
  ]
})
