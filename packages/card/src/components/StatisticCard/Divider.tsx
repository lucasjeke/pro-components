import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ProCardDividerEmits, ProCardDividerProps, ProCardDividerSlots } from '../../Divider'
import { defineComponent } from 'vue'
import ProCardDivider from '../../Divider'

export type ProStatisticCardDividerProps = ProCardDividerProps & {
  orientation?: ProCardDividerProps['orientation']
}

const ProStatisticCardDivider = defineComponent<
  ProStatisticCardDividerProps,
  ProCardDividerEmits,
  string,
  CustomSlotsType<ProCardDividerSlots>
>((props, { attrs }) => {
  return () => {
    const { orientation, ...restProps } = props
    return <ProCardDivider {...restProps} {...attrs} orientation={orientation} />
  }
}, {
  name: 'ProStatisticCardDivider',
  inheritAttrs: false,
})
export default ProStatisticCardDivider
