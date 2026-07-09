import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { CSSObject } from '@antdv-next/cssinjs'
import { operationUnit, resetComponent, useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface PageHeaderToken extends ProAliasCssVarToken {
  pageHeaderPadding: number
  pageHeaderPaddingVertical: number
  pageHeaderBgGhost: string
  pageHeaderPaddingBreadCrumb: number
  pageHeaderColorBack: string
  pageHeaderFontSizeHeaderTitle: number | string
  pageHeaderFontSizeHeaderSubTitle: number
  pageHeaderPaddingContentPadding: number
}
function textOverflowEllipsis(): CSSObject {
  return {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
}

const genPageHeaderStyle: GenerateStyle<PageHeaderToken> = (token) => {
  return {
    [token.componentCls]: {
      ...resetComponent?.(token),
      position: 'relative',
      backgroundColor: token.colorBgContainer,
      paddingBlock: token.calc(token.pageHeaderPaddingVertical).add(2).equal(),
      paddingInline: token.pageHeaderPadding,
      '&&-ghost': {
        backgroundColor: token.pageHeaderBgGhost,
      },
      '&-no-children': {
        height: token.proLayoutPageContainerPaddingBlockPageContainerContent,
      },
      '&&-has-breadcrumb': {
        paddingBlockStart: token.pageHeaderPaddingBreadCrumb,
      },
      '&&-has-footer': {
        paddingBlockEnd: 0,
      },
      '& &-back': {
        marginInlineEnd: token.margin,
        fontSize: 16,
        lineHeight: 1,
        '&-button': {
          fontSize: 16,
          ...operationUnit?.(token),
          color: token.pageHeaderColorBack,
          cursor: 'pointer',
        },
        [`${token.componentCls}-rlt &`]: {
          float: 'right',
          marginInlineEnd: 0,
          marginInlineStart: 0,
        },
      },
      [`& ${'ant'}-divider-vertical`]: {
        height: 14,
        marginBlock: 0,
        marginInline: token.marginSM,
        verticalAlign: 'middle',
      },
      [`& &-breadcrumb + &-heading`]: {
        marginBlockStart: token.marginXS,
      },
      '& &-heading': {
        display: 'flex',
        justifyContent: 'space-between',
        '&-left': {
          display: 'flex',
          alignItems: 'center',
          marginBlock: token.calc(token.marginXS).div(2).equal(),
          marginInlineEnd: 0,
          marginInlineStart: 0,
          overflow: 'hidden',
        },
        '&-title': {
          marginInlineEnd: token.marginSM,
          marginBlockEnd: 0,
          color: token.colorTextHeading,
          fontWeight: 600,
          fontSize: token.pageHeaderFontSizeHeaderTitle,
          lineHeight: token.controlHeight,
          ...textOverflowEllipsis(),
          [`${token.componentCls}-rlt &`]: {
            marginInlineEnd: 0,
            marginInlineStart: token.marginSM,
          },
        },
        '&-avatar': {
          marginInlineEnd: token.marginSM,
          [`${token.componentCls}-rlt &`]: {
            float: 'right',
            marginInlineEnd: 0,
            marginInlineStart: token.marginSM,
          },
        },
        '&-tags': {
          [`${token.componentCls}-rlt &`]: {
            float: 'right',
          },
        },
        '&-sub-title': {
          marginInlineEnd: token.marginSM,
          color: token.colorTextSecondary,
          fontSize: token.pageHeaderFontSizeHeaderSubTitle,
          lineHeight: token.lineHeight,
          ...textOverflowEllipsis(),
          [`${token.componentCls}-rlt &`]: {
            float: 'right',
            marginInlineEnd: 0,
            marginInlineStart: 12,
          },
        },
        '&-extra': {
          marginBlock: token.marginXS / 2,
          marginInlineEnd: 0,
          marginInlineStart: 0,
          whiteSpace: 'nowrap',
          '> *': {
            'white-space': 'unset',
            [`${token.componentCls}-rlt &`]: {
              marginInlineEnd: token.marginSM,
              marginInlineStart: 0,
            },
          },
          [`${token.componentCls}-rlt &`]: {
            float: 'left',
          },
          '*:first-child': {
            [`${token.componentCls}-rlt &`]: {
              marginInlineEnd: 0,
            },
          },
        },
      },
      '&-content': {
        paddingBlockStart: token.pageHeaderPaddingContentPadding,
      },
      '&-footer': {
        marginBlockStart: token.margin,
        [`${token.antCls}-tabs-nav:before`]: {
          borderBlockEnd: 0,
        },
      },
      '&-compact &-heading': {
        flexWrap: 'wrap',
      },
      '&-wide': {
        maxWidth: 1152,
        margin: '0 auto',
      },
      '&-rtl': {
        direction: 'rtl',
      },
    },
  }
}

export default useStyle('ProPageHeader', (token) => {
  const pageHeaderToken = mergeToken<PageHeaderToken>(token, {
    pageHeaderBgGhost: 'transparent',
    pageHeaderPadding: token.paddingLG,
    pageHeaderPaddingVertical: token.paddingMD,
    pageHeaderPaddingBreadCrumb: token.paddingSM,
    pageHeaderColorBack: token.colorTextHeading,
    pageHeaderFontSizeHeaderTitle: token.fontSizeHeading4,
    pageHeaderFontSizeHeaderSubTitle: 14,
    pageHeaderPaddingContentPadding: token.paddingSM,
  })

  return [genPageHeaderStyle(pageHeaderToken)]
})
