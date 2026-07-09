import type { GenerateStyle, ProAliasCssVarToken } from '@antdv-next1/pro-provider'
import { useStyle } from '@antdv-next1/pro-provider'
import { mergeToken } from '@antdv-next/cssinjs'

export interface ProFilterDropdownToken extends ProAliasCssVarToken {
}

const genProFilterDropdownStyle: GenerateStyle<ProFilterDropdownToken> = (token) => {
  return {
    [`${token.componentCls}-label`]: { cursor: 'pointer' },
    [`${token.componentCls}-overlay`]: {
      minWidth: 200,
      marginBlockStart: 4,
    },
    [`${token.componentCls}-content`]: { paddingBlock: 16, paddingInline: 16 },
  }
}

export default useStyle('FilterDropdown', (token) => {
  const proFilterDropdownToken = mergeToken<ProFilterDropdownToken>(token, {})
  return [genProFilterDropdownStyle(proFilterDropdownToken)]
})
