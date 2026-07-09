import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, h } from 'vue'
import useStyle from './style'

export interface HighlightProps {
  label: string
  words: string[]
}
const Highlight = defineComponent<HighlightProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props) => {
    const config = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-pro-select-item-option-content`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const matchKeywordsRE = computed(
      () =>
        new RegExp(
          props.words
            ?.map(word => word.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'))
            .join('|') as string,
          'gi',
        ),
    )
    const elements = computed(() => {
      let matchText = props.label
      const vnodes = [] as VueNode[]
      while (matchText?.length) {
        const match = matchKeywordsRE.value.exec(matchText)
        if (!match) {
          vnodes.push(matchText)
          break
        }

        const start = match.index
        const matchLength = match[0].length + start

        vnodes.push(
          matchText.slice(0, start),
          h(
            'span',
            {
              class: classNames(`${baseClassName.value}-light`, hashId.value, cssVarCls.value),
            },
            matchText.slice(start, matchLength),
          ),
        )
        matchText = matchText.slice(matchLength)
      }
      return vnodes
    })
    return () => (
      <div title={props.label} class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}>{elements.value}</div>
    )
  },
  {
    name: 'FieldSelectHighlight',
    inheritAttrs: false,
  },
)

export default Highlight
