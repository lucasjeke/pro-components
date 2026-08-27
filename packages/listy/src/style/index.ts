import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { FastColor } from '@ant-design/fast-color'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProListyToken extends ProAliasCssVarToken {
  colorFillAlterSolid: string
}

export const genProListyStyle: GenerateStyle<ProListyToken> = (token) => {
  return {
    [token.componentCls]: {
      [`${token.antCls}-listy${token.componentCls}-vertical`]: {
        [`${token.antCls}-listy-item`]: {
          gap: token.marginXL,
          [`${token.componentCls}-item-main`]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: token.marginXS,
            [`${token.componentCls}-item-header`]: {
              [`${token.componentCls}-item-meta`]: {
                marginBlockEnd: token.marginSM,
                [`${token.componentCls}-item-meta-content`]: {
                  gap: token.margin,
                },
              },
            },
            [`${token.componentCls}-item-content`]: {
              marginBlockEnd: token.marginXS,
            },
            [`${token.componentCls}-item-meta-title`]: {
              fontSize: token.fontSizeLG,
            },
          },
        },
      },
      [`${token.antCls}-listy ${token.antCls}-listy-item`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 0,
        cursor: 'pointer',
        '&:last-child': {
          borderBlockEnd: 'none',
        },
        '&>*:first-child': {
          flex: 1,
          minWidth: 0,
        },
        [`${token.componentCls}-item-checkbox`]: {
          marginInlineEnd: token.marginXS,
        },
        [`${token.componentCls}-item-main`]: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          gap: token.marginXXL,
        },
        [`${token.componentCls}-item-header`]: {
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          minWidth: 0,
          '&-options': {
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            paddingInlineStart: token.paddingXS,
            [`& ${token.componentCls}-item-icon`]: {
              marginInlineEnd: token.marginXS,
              display: 'flex',
              fontSize: token.fontSizeSM,
              cursor: 'pointer',
              height: token.controlHeightSM,
              color: token.colorTextSecondary,
              '> .anticon > svg': {
                transition: '0.3s',
              },
              '&-expanded': {
                '> .anticon > svg': {
                  transform: 'rotate(90deg)',
                },
              },
            },
          },
          [`${token.componentCls}-item-meta`]: {
            display: 'flex',
            flex: 1,
            alignItems: 'flex-start',
            maxWidth: '100%',
            [`${token.componentCls}-item-meta-content`]: {
              gap: token.marginXXS,
              minWidth: 0,
            },
            [`${token.componentCls}-item-meta-title-header`]: {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              flex: 1,
              minWidth: 0,
              '&-title': {
                flexShrink: 0,
                marginInlineEnd: 0,
                wordBreak: 'break-word',
                cursor: 'pointer',
                '&:hover': {
                  color: token.colorPrimary,
                },
              },
              '&-subTitle': {
                display: 'inline-flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 4,
                color: token.colorTextSecondary,
              },

            },
          },
        },
        [`${token.componentCls}-item-content`]: {
          position: 'relative',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          marginBlock: 0,
        },
        [`${token.componentCls}-item-action`]: {
          display: 'flex',
          flex: '0 0 auto',
        },
      },
      [`${token.antCls}-listy ${token.antCls}-listy-item:has(${token.componentCls}-item-main-editable)`]: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
        [`${token.componentCls}-item-main`]: {
          [`${token.componentCls}-item-header`]: {
            [`${token.componentCls}-item-meta`]: {
              [`${token.componentCls}-item-meta-avatar`]: {
                marginBlockStart: token.marginXS,
              },
              [`${token.componentCls}-item-meta-content`]: {
                [`${token.componentCls}-item-meta-title`]: {
                  paddingBlock: token.paddingSM,
                  paddingInline: 0,
                },
                [`${token.componentCls}-item-meta-description`]: {
                  paddingBlock: token.paddingSM,
                  paddingInline: 0,
                },
              },
            },
          },
        },
      },
      [`${token.antCls}-listy ${token.antCls}-listy-item:has(${token.componentCls}-item-main-selected)`]: {
        backgroundColor: token.colorPrimaryBg,
      },
      [`${token.antCls}-listy ${token.antCls}-listy-item:has(${token.componentCls}-item-main-type-top)`]: {
        backgroundImage: 'url(https://gw.alipayobjects.com/zos/antfincdn/DehQfMbOJb/icon.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        backgroundSize: '12px 12px',
      },
      '&-no-split': {
        [`${token.antCls}-listy ${token.antCls}-listy-item`]: {
          borderBottom: 'none',
        },
      },
      '&-filled': {
        [`${token.antCls}-listy`]: {
          backgroundColor: token.colorFillQuaternary,
        },
      },
      [`${token.antCls}-listy${token.componentCls}-grid,${token.componentCls}-container${token.componentCls}-grid`]: {
        width: '100%',
        [`${token.componentCls}-grid-row`]: {
          alignItems: 'stretch',
        },
        [`${token.componentCls}-grid-col`]: {
          display: 'flex',
          minWidth: 0,
          [`> ${token.antCls}-pro-checkcard`]: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            [`> ${token.antCls}-card-body`]: {
              flex: 1,
              height: 'auto',
            },
          },
        },
        [`${token.componentCls}-grid-virtual`]: {
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
        },
        [`${token.componentCls}-grid-virtual-inner`]: {
          minWidth: 0,
        },
        [`${token.componentCls}-grid-virtual-row`]: {
          contain: 'layout style',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
      '&-card-title': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: token.marginXS,
        minWidth: 0,
      },
      '&-card-subtitle': {
        display: 'inline-flex',
        alignItems: 'center',
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
      },
      '&-card-actions': {
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: token.marginXS,
        whiteSpace: 'nowrap',
      },
      '&-pagination': {
        marginBlockStart: token.margin,
      },
      '&-empty-text': {
        padding: token.padding,
        color: token.colorTextDisabled,
        fontSize: token.fontSize,
        textAlign: 'center',
      },
      [`${token.antCls}-listy${token.componentCls}-large`]: {
        [`${token.componentCls}-item`]: {
          paddingBlock: token.padding,
          paddingInline: token.paddingLG,

        },
      },
      [`${token.antCls}-listy${token.componentCls}-small`]: {
        [`${token.componentCls}-item`]: {
          paddingBlock: token.paddingXS,
          paddingInline: token.paddingSM,
        },
      },
    },
  }
}

export default useStyle('ProListy', (token) => {
  const proListyToken = mergeToken<ProListyToken>(token, {
    colorFillAlterSolid: token.colorFillAlterSolid,
  })

  return [genProListyStyle(proListyToken)]
}, (token) => {
  const colorFillAlterSolid = new FastColor(token.colorFillAlter)
    .onBackground(token.colorBgContainer)
    .toHexString()
  return {
    colorFillAlterSolid,
  }
})
