import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProLayoutHeaderToken extends ProAliasCssVarToken {
  proLayoutCollapsedWidth: number
}
export function useStylish(
  prefixCls: ComputedRef<string>,
  {
    stylish,
    proLayoutCollapsedWidth,
  }: {
    stylish?: ComputedRef<GenerateStyle<ProLayoutHeaderToken>>
    proLayoutCollapsedWidth: ComputedRef<number>
  },
) {
  const genStyleHooks = useAntdStyle('ProLayoutHeaderStylish', (token) => {
    const stylishToken = mergeToken<ProLayoutHeaderToken>(token, {
      proLayoutCollapsedWidth: proLayoutCollapsedWidth.value,
    })
    if (!stylish?.value)
      return []

    return [
      {
        [`div${token.proComponentsCls}-basicLayout`]: {
          [`${stylishToken.componentCls}`]: stylish.value?.(stylishToken),
        },
      },
    ]
  })
  return genStyleHooks(prefixCls)
}
