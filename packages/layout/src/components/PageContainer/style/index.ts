import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface PageContainerToken extends ProAliasCssVarToken {}

const [sm, md, lg, xl] = [576, 768, 992, 1200].map(bp => `@media (max-width: ${bp}px)`)

const genPageContainerStyle: GenerateStyle<PageContainerToken> = (token) => {
  return {
    [token.componentCls]: {
      position: 'relative',
      '&-wrap': {
        backgroundColor: token.colorBgContainer,
        '&-page-header': {
          [`&-wide${token.antCls}-page-header`]: {
            maxWidth: 1152,
            margin: '0 auto',
          },
        },
      },
      '&-children-content': {
        paddingBlockStart: token.proLayoutPageContainerPaddingBlockPageContainerContent,
        paddingBlockEnd: token.proLayoutPageContainerPaddingBlockPageContainerContent,
        paddingInline: token.proLayoutPageContainerPaddingInlinePageContainerContent,
      },
      '&-affix': {
        [`${token.antCls}-affix`]: {
          [`${token.componentCls}-warp`]: {
            backgroundColor: token.proLayoutPageContainerColorBgPageContainerFixed,
            transition: 'background-color 0.3s',
            boxShadow: '0 2px 8px #f0f1f2',
          },
        },
      },
      '&-detail': {
        display: 'flex',
        [sm!]: {
          display: 'block',
        },
      },
      '&-main': {
        width: '100%',
      },
      '&-row': {
        display: 'flex',
        width: '100%',
        [md!]: {
          display: 'block',
        },
      },
      '&-content': {
        flex: 'auto',
        width: '100%',
      },
      '&-extraContent': {
        flex: '0 1 auto',
        minWidth: 242,
        marginInlineStart: 88,
        textAlign: 'end',
        [xl!]: {
          marginInlineStart: 44,
        },
        [lg!]: {
          marginInlineStart: 20,
        },
        [md!]: {
          marginInlineStart: 0,
          textAlign: 'start',
        },
        [sm!]: {
          marginInlineStart: 0,
        },
      },
    },
  }
}
export default useStyle('PageContainer', (token) => {
  const proPageContainerToken = mergeToken<PageContainerToken>(token, {
  })

  return [genPageContainerStyle(proPageContainerToken)]
})
