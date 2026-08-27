import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import InternalProCard from '../src/Card'

vi.mock('@antdv-next1/pro-provider', () => ({
  ProConfigProvider: defineComponent({
    name: 'ProConfigProvider',
    setup(_props, { slots }) {
      return () => slots.default?.()
    },
  }),
}))

vi.mock('@antdv-next1/pro-utils', () => ({
  childrenToArray: (children: unknown) => Array.isArray(children) ? children : [children],
  isSpecialNode: () => false,
  LabelIconTip: defineComponent({
    name: 'LabelIconTip',
    props: ['label'],
    setup(props) {
      return () => h('span', props.label)
    },
  }),
}))

vi.mock('antdv-next/config-provider/context', () => ({
  useConfig: () => ref({
    getPrefixCls: (suffix: string) => `ant-${suffix}`,
  }),
}))

vi.mock('../src/style', () => ({
  default: () => [ref('hash-id'), ref('css-var')],
}))

vi.mock('antdv-next', () => {
  const renderComponent = (name: string, tag = 'div') => defineComponent({
    name,
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () => h(tag, { ...attrs, 'data-component': name }, slots.default?.())
    },
  })

  return {
    BorderBeam: renderComponent('BorderBeam'),
    Card: renderComponent('Card'),
    Col: renderComponent('Col'),
    Collapse: renderComponent('Collapse'),
    Row: renderComponent('Row'),
    Tabs: defineComponent({
      name: 'Tabs',
      props: ['activeKey', 'defaultActiveKey', 'items', 'tabPlacement'],
      emits: ['update:activeKey'],
      setup(props, { emit, slots }) {
        return () => h('div', {
          'data-component': 'Tabs',
          'data-placement': props.tabPlacement,
          onClick: () => emit('update:activeKey', 'tab1'),
        }, slots.contentRender?.({
          item: props.items?.find((item: { key: string }) => item.key === props.activeKey),
          index: props.items?.findIndex((item: { key: string }) => item.key === props.activeKey),
        }))
      },
    }),
    useBreakpoint: () => ref({}),
  }
})

describe('ProCard tabs placement', () => {
  const tabList = [
    { key: 'tab1', label: 'Tab One' },
    { key: 'tab2', label: 'Tab Two' },
  ]

  it('uses Tabs to place card content for start placement', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        activeTabKey: 'tab2',
        tabList,
        tabProps: { tabPlacement: 'start' },
      },
      slots: {
        default: () => 'Card Content',
      },
    })

    expect(wrapper.find('[data-component="Tabs"]').attributes('data-placement')).toBe('start')
    expect(wrapper.find('[data-component="Tabs"]').text()).toContain('Card Content')
    expect(wrapper.findComponent({ name: 'Card' }).attributes('tablist')).toBeUndefined()
  })

  it('uses the same Tabs content layout for top placement', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        activeTabKey: 'tab2',
        tabList,
        tabProps: { tabPlacement: 'top' },
      },
      slots: {
        default: () => 'Card Content',
      },
    })

    expect(wrapper.find('[data-component="Tabs"]').attributes('data-placement')).toBe('top')
    expect(wrapper.find('[data-component="Tabs"]').text()).toContain('Card Content')
    expect(wrapper.findComponent({ name: 'Card' }).attributes('tablist')).toBeUndefined()
  })

  it('forwards a placement tab change once to every callback', async () => {
    const onTabPropsUpdate = vi.fn()
    const onTabChange = vi.fn()
    const onActiveTabKeyUpdate = vi.fn()
    const wrapper = mount(InternalProCard as any, {
      props: {
        activeTabKey: 'tab2',
        tabList,
        tabProps: {
          tabPlacement: 'end',
          'onUpdate:activeKey': onTabPropsUpdate,
        },
        onTabChange,
        'onUpdate:activeTabKey': onActiveTabKeyUpdate,
      },
      slots: {
        default: () => 'Card Content',
      },
    })

    await wrapper.find('[data-component="Tabs"]').trigger('click')

    expect(onTabPropsUpdate).toHaveBeenCalledOnce()
    expect(onTabChange).toHaveBeenCalledOnce()
    expect(onActiveTabKeyUpdate).toHaveBeenCalledOnce()
  })
})
