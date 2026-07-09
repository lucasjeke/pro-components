import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { FastColor } from '@ant-design/fast-color'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProListyToken extends ProAliasCssVarToken {
  colorFillAlterSolid: string
  // /**
  //  * @desc 内容宽度
  //  * @descEN Width of content
  //  */
  // contentWidth: number | string
  // /**
  //  * @desc 大号列表项内间距
  //  * @descEN Padding of large item
  //  */
  // itemPaddingLG: string
  // /**
  //  * @desc 小号列表项内间距
  //  * @descEN Padding of small item
  //  */
  // itemPaddingSM: string
  // /**
  //  * @desc 列表项内间距
  //  * @descEN Padding of item
  //  */
  // itemPadding: string
  // /**
  //  * @desc 头部区域背景色
  //  * @descEN Background color of header
  //  */
  // headerBg: string
  // /**
  //  * @desc 底部区域背景色
  //  * @descEN Background color of footer
  //  */
  // footerBg: string
  // /**
  //  * @desc 空文本内边距
  //  * @descEN Padding of empty text
  //  */
  // emptyTextPadding: CSSProperties['padding']
  // /**
  //  * @desc Meta 下间距
  //  * @descEN Margin bottom of meta
  //  */
  // metaMarginBottom: CSSProperties['marginBottom']
  // /**
  //  * @desc 头像右间距
  //  * @descEN Right margin of avatar
  //  */
  // avatarMarginRight: CSSProperties['marginRight']
  // /**
  //  * @desc 标题下间距
  //  * @descEN Margin bottom of title
  //  */
  // titleMarginBottom: CSSProperties['marginBottom']
  // /**
  //  * @desc 描述文字大小
  //  * @descEN Font size of description
  //  */
  // descriptionFontSize: number
  // //  /**
  // //  * @desc 列表项类名
  // //  * @descEN Class name of list item
  // //  */
  // // listBorderedCls: string;
  // /**
  //  * @desc 最小高度
  //  * @descEN Minimum height
  //  */
  // minHeight: number | string
}

const genProListyStyle: GenerateStyle<ProListyToken> = (token) => {
  return {
    [token.componentCls]: {
      [`${token.antCls}-listy ${token.antCls}-listy-item`]: {
        margin: 0,
        cursor: 'pointer',
        [`${token.componentCls}-item-checkbox`]: {
          marginInlineEnd: token.marginXS,
        },
      },
      '&-container': {
        [`${token.componentCls}-item`]: {
          '&-hover': {
            backgroundColor: token.colorFillAlterSolid,
            transition: `background-color ${token.motionDurationSlow}`,
          },
          '&-header': {
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

          },
          [`${token.antCls}-listy-item-meta-title`]: {
            display: 'flex',
          },
          '&-meta-title-header': {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: token.marginXS,
            flex: 1,
            minWidth: 0,
            '&-title': {
              flexShrink: 0,
              marginInlineEnd: 0,
              wordBreak: 'break-word',
              cursor: 'pointer',
              '&-editable': {
                paddingBlock: token.paddingSM,
              },
              '&:hover': {
                color: token.colorPrimary,
              },
            },
          },
        },
      },
      '&-item-content': {
        position: 'relative',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginBlock: 0,

      },
      '&-item-header + &-item-content': {
        marginInlineStart: token.marginXL,
      },
    },
  }
}

export default useStyle('ProListy', (token) => {
  const proListyToken = mergeToken<ProListyToken>(token, {
    colorFillAlterSolid: token.colorFillAlterSolid,
    // itemPadding: `${unit(token.paddingContentVertical)} 0`,
    // itemPaddingSM: `${unit(token.paddingContentVerticalSM)} ${unit(token.paddingContentHorizontal)}`,
    // itemPaddingLG: `${unit(token.paddingContentVerticalLG)} ${unit(token.paddingContentHorizontalLG)}`,
    // headerBg: 'transparent',
    // footerBg: 'transparent',
    // emptyTextPadding: token.padding,
    // metaMarginBottom: token.padding,
    // avatarMarginRight: token.padding,
    // titleMarginBottom: token.paddingSM,
    // descriptionFontSize: token.fontSize,
    // minHeight: token.controlHeightLG,
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
