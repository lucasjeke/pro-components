import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLightFilterToken extends ProAliasCssVarToken {
}

const genProLightFilterStyle: GenerateStyle<ProLightFilterToken> = (token) => {
  return {
    [token.componentCls]: {
      boxSizing: 'border-box',
      lineHeight: token.calc(30).equal(),
      // @see https://yuque.antfin-inc.com/tech-ui/topics/523
      '&::before': {
        display: 'block',
        height: 0,
        visibility: 'hidden',
        content: '\'.\'',
      },
      '&-small': {
        lineHeight: token.lineHeight,
      },
      '&-container': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: token.marginXS,
      },
      '&-item': {
        whiteSpace: 'nowrap',
        [`${token.antCls}-form-item`]: {
          marginBlock: 0,
        },
      },
      '&-line': { minWidth: 198 },
      '&-line:not(:first-child)': {
        marginBlockStart: 16,
        marginBlockEnd: 8,
      },
      '&-collapse-icon': {
        width: token.controlHeight,
        height: token.controlHeight,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '&-effective': {
        [`${token.componentCls}-collapse-icon`]: {
          backgroundColor: token.colorBgTextHover,
        },
      },
    },
  }
}

export default useStyle('ProLightFilter', (token) => {
  const proLightFilterToken = mergeToken<ProLightFilterToken>(token, {})
  return [genProLightFilterStyle(proLightFilterToken)]
})
