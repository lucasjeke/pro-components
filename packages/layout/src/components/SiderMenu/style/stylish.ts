import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface SiderMenuToken extends ProAliasCssVarToken {
  proLayoutCollapsedWidth: number
  proLayoutFirstMenuWidth?: number
}

export function useStylish(
  prefixCls: ComputedRef<string>,
  {
    stylish,
    proLayoutCollapsedWidth,
    proLayoutFirstMenuWidth,
  }: {
    stylish?: GenerateStyle<SiderMenuToken>
    proLayoutCollapsedWidth: number
    proLayoutFirstMenuWidth?: number
  },
) {
  const genStyleHooks = useAntdStyle('ProLayoutSiderMenuStylish', (token) => {
    const siderMenuToken = mergeToken<SiderMenuToken>(token, {
      proLayoutCollapsedWidth,
      proLayoutFirstMenuWidth,
    })
    if (!stylish)
      return []
    return [
      {
        [`${token.proComponentsCls}-basicLayout`]: {
          [`${siderMenuToken.componentCls}`]: stylish?.(siderMenuToken),
        },
      },
    ]
  })
  return genStyleHooks(prefixCls)
}
