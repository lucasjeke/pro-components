import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import type { ComputedRef } from 'vue'
import { useStyle as useAntdStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface stylishToken extends ProAliasCssVarToken {
}

export function useStylish(
  prefixCls: ComputedRef<string>,
  {
    stylish,
  }: {
    stylish?: ComputedRef<GenerateStyle<stylishToken>>
  },
) {
  const genStyleHooks = useAntdStyle('ProLayoutFooterToolbarStylish', (token) => {
    const stylishToken = mergeToken<stylishToken>(token, {})
    if (!stylish?.value)
      return []

    return [
      {
        [`${stylishToken.componentCls}`]: stylish.value?.(stylishToken),
      },
    ]
  })
  return genStyleHooks(prefixCls)
}
