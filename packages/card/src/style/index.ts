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
      position: 'relative',
      [`${token.antCls}-card-body`]: {
        height: '100%',
      },
      [`&${componentCls}-checked`]: {
        backgroundColor: token.controlItemBgActive,
        borderColor: token.controlOutline,
        '&::after': {
          position: 'absolute',
          insetBlockStart: 2,
          insetInlineEnd: 2,
          width: 0,
          height: 0,
          border: `6px solid ${token.colorPrimary}`,
          borderBlockEndColor: 'transparent',
          borderInlineStartColor: 'transparent',
          borderStartEndRadius: 2,
          content: '""',
        },
      },
      [`&${token.antCls}-collapse`]: {
        position: 'relative',
        borderColor: token.colorBorderSecondary,
        backgroundColor: 'transparent',
        [`&:not(${componentCls}-split):not(${token.antCls}-collapse-small)`]: {
          [`${token.antCls}-collapse-item:not(${token.antCls}-collapse-item-active)`]: {
            [`${token.antCls}-collapse-header`]: {
              paddingBlockEnd: unit(token.padding),
            },
          },
          [`${token.antCls}-collapse-item-active`]: {
            [`${token.antCls}-collapse-panel`]: {
              [`${token.antCls}-collapse-body`]: {
                paddingBlockStart: `${unit(token.paddingLG)} !important`,
              },
            },
          },
        },
        [`&${componentCls}-split:not(${token.antCls}-collapse-small)`]: {
          [`${token.antCls}-collapse-item:not(${token.antCls}-collapse-item-active)`]: {
            [`${token.antCls}-collapse-header`]: {
              paddingBlockEnd: unit(token.padding),
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
          [`${token.antCls}-collapse-item:not(${token.antCls}-collapse-item-active) > ${token.antCls}-collapse-header`]: {
            borderBlockEnd: 0,
          },
          [`${token.antCls}-collapse-item-active > ${token.antCls}-collapse-header`]: {
            borderBlockEnd: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
        [`${token.antCls}-collapse-panel`]: {
          borderBlockStart: `${unit(0)} ${token.lineType} ${token.colorBorderSecondary}`,
          boxSizing: 'border-box',
          borderBottomLeftRadius: token.borderRadius,
          borderBottomRightRadius: token.borderRadius,
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
              paddingBlockEnd: unit(token.padding),
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
      },
      [`${componentCls}-body-direction-column`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      [`${componentCls}-body-layout-center`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      [`${componentCls}-row`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      '&-divider': {
        flex: 'none',
        width: token.lineWidth,
        marginInline: token.marginXS,
        marginBlock: token.marginLG,
        backgroundColor: token.colorSplit,
        '&-horizontal': {
          width: 'initial',
          height: token.lineWidth,
          marginInline: token.marginLG,
          marginBlock: token.marginXS,
        },
      },
      [`&${componentCls}-loading`]: {
        overflow: 'hidden',
        [`${componentCls}-body`]: {
          userSelect: 'none',
        },
      },
      [`${componentCls}-loading-content`]: {
        width: '100%',
        [`> ${token.antCls}-row + ${token.antCls}-row`]: {
          marginBlockStart: token.marginXS,
        },
        [`${token.antCls}-skeleton`]: {
          display: 'block',
          [`${token.antCls}-skeleton-section`]: {
            display: 'block',
          },
          [`${token.antCls}-skeleton-title`]: {
            height: 14,
          },
        },
      },
      [`&${componentCls}-tabs-layout`]: {
        [`> ${token.antCls}-card-body`]: {
          padding: 0,
        },
        [`${componentCls}-tabs`]: {
          [`${token.antCls}-tabs-content-holder`]: {
            minWidth: 0,
          },
          [`${componentCls}-tabs-content`]: {
            padding: token.paddingLG,
          },
          [`&${token.antCls}-tabs-top > ${token.antCls}-tabs-nav`]: {
            marginBlockEnd: 0,
            paddingInline: token.paddingLG,
          },
          [`&${token.antCls}-tabs-bottom > ${token.antCls}-tabs-nav`]: {
            marginBlockStart: 0,
            marginBlockEnd: 0,
            paddingInline: token.paddingLG,
          },
          [`&${token.antCls}-tabs-left > ${token.antCls}-tabs-nav, &${token.antCls}-tabs-right > ${token.antCls}-tabs-nav`]: {
            margin: 0,
            paddingBlock: token.paddingLG,
          },
        },
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
