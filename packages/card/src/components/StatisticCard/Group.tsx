import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ProCardGroupProps } from '../../Group'
import type { ProCardEmits, ProCardSlots } from '../../ProCard'
import { defineComponent } from 'vue'
import ProCardGroup from '../../Group'

export type ProStatisticCardGroupProps = ProCardGroupProps

const _ProStatisticCardGroup = defineComponent<
  ProStatisticCardGroupProps,
  ProCardEmits,
  string,
  CustomSlotsType<ProCardSlots>
>((props, { attrs, emit, slots }) => {
  return () => (
    <ProCardGroup
      {...props}
      {...attrs}
      onChecked={event => emit('checked', event)}
      onClick={event => emit('click', event)}
      onCollapse={value => emit('collapse', value)}
      onTabChange={key => emit('tabChange', key)}
      onUpdate:activeTabKey={key => emit('update:activeTabKey', key)}
      onUpdate:collapsed={value => emit('update:collapsed', value)}
      v-slots={slots}
    />
  )
}, {
  name: 'ProStatisticCardGroup',
  inheritAttrs: false,
})

const ProStatisticCardGroup = _ProStatisticCardGroup as typeof _ProStatisticCardGroup & {
  isProCard?: boolean
}
ProStatisticCardGroup.isProCard = true

export default ProStatisticCardGroup
