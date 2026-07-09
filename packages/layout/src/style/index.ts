import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { CSSInterpolation } from 'antdv-next/dist/theme/interface/index'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

/**
 * 全局滚动条 CSS 变量。
 * 业务可在任意祖先层覆盖这些变量来定制主内容区的滚动条外观。
 * 侧边栏有独立的 `--pro-layout-sider-scrollbar-*` 系列。
 */
export const proLayoutScrollbarVar = {
  thumb: '--pro-layout-scrollbar-thumb',
  thumbHover: '--pro-layout-scrollbar-thumb-hover',
  track: '--pro-layout-scrollbar-track',
  size: '--pro-layout-scrollbar-size',
  radius: '--pro-layout-scrollbar-radius',
} as const

function sv(k: keyof typeof proLayoutScrollbarVar) {
  return `var(${proLayoutScrollbarVar[k]})`
}

export function getLayoutScrollbar(): Record<string, unknown> {
  return {
    scrollbarWidth: 'thin',
    scrollbarColor: 'transparent transparent',
    '&:hover': {
      scrollbarColor: `${sv('thumb')} transparent`,
    },
    '&::-webkit-scrollbar': {
      width: sv('size'),
      height: sv('size'),
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: sv('track'),
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',
      borderRadius: sv('radius'),
      transition: 'background-color 0.3s ease',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: sv('thumb'),
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: sv('thumbHover'),
    },
    '@media (pointer: coarse)': {
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
  }
}

/**
 * ProLayout 全局 CSS 变量。
 * 业务可通过 CSS 覆盖对应变量自行调整。
 */
export const proLayoutVar = {
  /** 顶栏 `top` + `contentWidth=Fixed` 时的内容区最大宽度 */
  contentFixedMaxWidth: '--pro-layout-content-fixed-max-width',
  /** Header 高度 */
  headerHeight: '--pro-layout-header-height',
  /** fixed header 左侧偏移（跨组件几何同步用） */
  fixedHeaderStart: '--pro-layout-fixed-header-start',
} as const

export interface ProLayoutToken extends ProAliasCssVarToken {}

const genProLayoutStyle: GenerateStyle<ProLayoutToken> = (token) => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [proLayoutVar.contentFixedMaxWidth]: 1152,
      [proLayoutVar.headerHeight]: token.calc(token.proLayoutHeaderHeightLayoutHeader || 56).equal(),
      [proLayoutScrollbarVar.thumb]: token.colorFill,
      [proLayoutScrollbarVar.thumbHover]: token.colorFillSecondary,
      [proLayoutScrollbarVar.track]: 'transparent',
      [proLayoutScrollbarVar.size]: 4,
      [proLayoutScrollbarVar.radius]: token.borderRadiusSM,
      '&-realDark': {
        [`${token.antCls}-layout`]: {
          background: '#2a2c2c',
          // [`${token.componentCls}-content`]: {
          //   backgroundColor: '#2a2c2c',
          // },
        },
      },
      boxSizing: 'border-box',
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      [`&${token.antCls}-layout`]: {
        display: 'flex',
        width: '100%',
        height: '100%',
      },
      '&-bg-list': {
        pointerEvents: 'none',
        position: 'fixed',
        overflow: 'hidden',
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: 0,
        height: '100%',
        width: '100%',
        background: token?.proLayoutBgLayout,
      },
      [`${token.componentCls}-content`]: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: token.proLayoutPageContainerColorBgPageContainer || 'transparent',
        position: 'relative',
        paddingBlock: token.proLayoutPageContainerPaddingBlockPageContainerContent,
        paddingInline: token.proLayoutPageContainerPaddingInlinePageContainerContent,
        '&-has-page-container': {
          padding: 0,
        },
      },
      [`${token.componentCls}-container`]: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        backgroundColor: 'transparent',
      },
      [`${token.componentCls}-wrap`]: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
      '&&-fixed-header': {
        [`${token.componentCls}-container`]: {
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          ...getLayoutScrollbar(),
        },
      },

    },
  } as CSSInterpolation
}

export default useStyle('ProLayout', (token) => {
  const proLayoutToken = mergeToken<ProLayoutToken>(token, {
  })
  return [genProLayoutStyle(proLayoutToken)]
})
