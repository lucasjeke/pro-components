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
    Skeleton: renderComponent('Skeleton'),
    Tabs: defineComponent({
      name: 'Tabs',
      inheritAttrs: false,
      setup(_props, { attrs, slots }) {
        return () => h('div', { ...attrs, 'data-component': 'Tabs' }, slots.contentRender?.({ item: {}, index: 0 }))
      },
    }),
    useBreakpoint: () => ref({}),
  }
})

describe('ProCard loading', () => {
  it('renders the default segmented Skeleton layout for boolean loading', () => {
    const wrapper = mount(InternalProCard as any, {
      props: { loading: true },
      slots: {
        default: () => 'Card Content',
      },
    })

    expect(wrapper.findAll('[data-component="Skeleton"]')).toHaveLength(10)
    expect(wrapper.text()).not.toContain('Card Content')
    expect(wrapper.findComponent({ name: 'Card' }).attributes('loading')).toBeUndefined()
  })

  it('renders a custom VNode instead of the default Skeleton and card content', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        loading: h('div', { class: 'custom-loading' }, 'Custom Loading'),
      },
      slots: {
        default: () => 'Card Content',
      },
    })

    expect(wrapper.find('.custom-loading').text()).toBe('Custom Loading')
    expect(wrapper.findAll('[data-component="Skeleton"]')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Card Content')
  })

  it('renders card content when loading is false', () => {
    const wrapper = mount(InternalProCard as any, {
      props: { loading: false },
      slots: {
        default: () => 'Card Content',
      },
    })

    expect(wrapper.text()).toContain('Card Content')
    expect(wrapper.findAll('[data-component="Skeleton"]')).toHaveLength(0)
  })

  it('takes priority over custom tab content', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        loading: true,
        tabList: [{ key: 'tab1', label: 'Tab One' }],
      },
      slots: {
        default: () => 'Card Content',
        tabContentRender: () => 'Custom Tab Content',
      },
    })

    expect(wrapper.findAll('[data-component="Skeleton"]')).toHaveLength(10)
    expect(wrapper.text()).not.toContain('Custom Tab Content')
  })
})
