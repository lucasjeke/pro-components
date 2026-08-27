import type { SlotsType } from 'vue'
import type { ProCardEmits, ProCardProps, ProCardSlots } from './ProCard'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import InternalProCard from './Card'

export type ProCardGroupProps = ProCardProps
export type ProCardGroupEmits = ProCardEmits
export type ProCardGroupSlots = ProCardSlots

const ProCardGroup = defineComponent<
  ProCardGroupProps,
  ProCardGroupEmits,
  string,
  SlotsType<ProCardGroupSlots>
>((props, { attrs, emit, expose, slots }) => {
  expose({})
  return () => {
    const groupStyles: ProCardProps['styles'] = (info) => {
      const resolvedStyles = typeof props.styles === 'function'
        ? props.styles(info)
        : props.styles

      return {
        ...resolvedStyles,
        header: {
          ...(!props.headerBordered ? { paddingBlockEnd: 0 } : {}),
          ...resolvedStyles?.header,
        },
        body: {
          padding: 0,
          ...resolvedStyles?.body,
        },
      }
    }

    return (
      <ProConfigProvider needDeps>
        <InternalProCard
          {...props}
          {...attrs}
          styles={groupStyles}
          onChecked={event => emit('checked', event)}
          onClick={event => emit('click', event)}
          onCollapse={value => emit('collapse', value)}
          onTabChange={key => emit('tabChange', key)}
          onUpdate:activeTabKey={key => emit('update:activeTabKey', key)}
          onUpdate:collapsed={value => emit('update:collapsed', value)}
          v-slots={slots}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProCardGroup',
  inheritAttrs: false,
})

export default ProCardGroup
