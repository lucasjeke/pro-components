import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import InternalProCard from '../src/Card'
import ProCardDivider from '../src/Divider'
import ProCardGroup from '../src/Group'

vi.mock('@antdv-next1/pro-utils', () => ({
  childrenToArray: (children: unknown) => Array.isArray(children) ? children : [children],
  isSpecialNode: () => false,
  LabelIconTip: defineComponent({
    name: 'LabelIconTip',
    props: ['label', 'subTitle'],
    setup(props) {
      return () => h('span', [props.label, props.subTitle])
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

vi.mock('@antdv-next1/pro-provider', () => ({
  ProConfigProvider: defineComponent({
    name: 'ProConfigProvider',
    setup(_props, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
}))

vi.mock('antdv-next', () => {
  const renderComponent = (name: string, propNames: string[] = []) => defineComponent({
    name,
    inheritAttrs: false,
    props: propNames,
    setup(props, { attrs, slots }) {
      return () => h('div', { ...attrs, 'data-component': name }, slots.default?.() ?? [
        slots.title?.(),
        slots.extra?.(),
        slots.cover?.(),
        slots.actions?.(),
      ])
    },
  })

  return {
    BorderBeam: renderComponent('BorderBeam'),
    Card: renderComponent('Card', ['classes', 'styles', 'variant', 'bordered']),
    Col: renderComponent('Col', ['span', 'flex', 'offset', 'order', 'pull', 'push', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
    Collapse: defineComponent({
      name: 'Collapse',
      inheritAttrs: false,
      props: ['activeKey', 'items', 'expandIcon', 'classes', 'styles', 'bordered'],
      emits: ['change'],
      setup(props, { attrs, emit }) {
        return () => {
          const active = Array.isArray(props.activeKey) && props.activeKey.includes('collapseCard')
          return h('div', { ...attrs, 'data-component': 'Collapse' }, [
            h('button', {
              class: 'collapse-trigger',
              onClick: () => emit('change', active ? [] : ['collapseCard']),
            }, props.expandIcon?.({ isActive: active })),
            props.items?.[0]?.label,
            props.items?.[0]?.extra,
            props.items?.[0]?.content,
          ])
        }
      },
    }),
    Divider: renderComponent('Divider', ['orientation', 'type']),
    Row: renderComponent('Row', ['gutter', 'align', 'justify', 'wrap']),
    Skeleton: renderComponent('Skeleton'),
    Tabs: defineComponent({
      name: 'Tabs',
      setup(_props, { slots }) {
        return () => h('div', { 'data-component': 'Tabs' }, slots.contentRender?.({ item: {}, index: 0 }))
      },
    }),
    useBreakpoint: () => ref({ md: true }),
  }
})

const ChildCard = defineComponent({
  name: 'ChildCard',
  setup(_props, { slots }) {
    return () => h('section', slots.default?.())
  },
}) as any
ChildCard.isProCard = true

describe('ProCard group and divider contract', () => {
  it('renders a real parent card with zero body padding and user style overrides', () => {
    const wrapper = mount(ProCardGroup as any, {
      props: {
        title: 'Core Metrics',
        direction: 'row',
        styles: { body: { backgroundColor: 'red' } },
      },
      slots: { default: () => [h(ChildCard), h(ChildCard)] },
    })

    const card = wrapper.findComponent({ name: 'Card' })
    expect(card.exists()).toBe(true)
    expect(card.attributes('title')).toBe('Core Metrics')
    expect(card.props('styles').body).toMatchObject({
      padding: 0,
      backgroundColor: 'red',
    })
    expect(card.props('styles').header.paddingBlockEnd).toBe(0)
    expect(wrapper.findComponent({ name: 'Row' }).exists()).toBe(true)
  })

  it('keeps the default header bottom padding when the group header is bordered', () => {
    const wrapper = mount(ProCardGroup as any, {
      props: {
        title: 'Core Metrics',
        headerBordered: true,
      },
      slots: { default: () => h(ChildCard) },
    })

    const card = wrapper.findComponent({ name: 'Card' })
    expect(card.props('styles').header?.paddingBlockEnd).toBeUndefined()
  })

  it('renders a ProCard divider with horizontal and user classes', () => {
    const wrapper = mount(ProCardDivider as any, {
      props: { type: 'horizontal' },
      attrs: {
        class: 'custom-divider',
        'data-owner': 'metrics',
        style: { opacity: 0.5 },
      },
    })

    const divider = wrapper.find('.ant-pro-card-divider')
    expect(divider.exists()).toBe(true)
    expect(divider.classes()).toContain('ant-pro-card-divider-horizontal')
    expect(divider.classes()).toContain('custom-divider')
    expect(divider.attributes('data-owner')).toBe('metrics')
    expect(divider.attributes('style')).toContain('opacity: 0.5')
  })
})

describe('ProCard collapsible contract', () => {
  it('supports boolean collapsible and keeps state after a parent update', async () => {
    const onCollapse = vi.fn()
    const onUpdateCollapsed = vi.fn()
    const wrapper = mount(InternalProCard as any, {
      props: {
        collapsible: true,
        title: 'Title',
        onCollapse,
        'onUpdate:collapsed': onUpdateCollapsed,
      },
      slots: { default: () => 'Content' },
    })

    expect(wrapper.find('[data-component="Collapse"]').exists()).toBe(true)
    await wrapper.find('.collapse-trigger').trigger('click')

    expect(onCollapse).toHaveBeenCalledWith(true)
    expect(onUpdateCollapsed).toHaveBeenCalledWith(true)
    expect(wrapper.findComponent({ name: 'Collapse' }).props('activeKey')).toEqual([])

    await wrapper.setProps({ size: 'small' })
    expect(wrapper.findComponent({ name: 'Collapse' }).props('activeKey')).toEqual([])
  })

  it('supports controlled collapsed state', async () => {
    const onUpdateCollapsed = vi.fn()
    const wrapper = mount(InternalProCard as any, {
      props: {
        collapsible: 'header',
        collapsed: true,
        'onUpdate:collapsed': onUpdateCollapsed,
      },
    })

    expect(wrapper.findComponent({ name: 'Collapse' }).props('activeKey')).toEqual([])
    await wrapper.find('.collapse-trigger').trigger('click')
    expect(onUpdateCollapsed).toHaveBeenCalledWith(false)
    expect(wrapper.findComponent({ name: 'Collapse' }).props('activeKey')).toEqual([])

    await wrapper.setProps({ collapsed: false })
    expect(wrapper.findComponent({ name: 'Collapse' }).props('activeKey')).toEqual(['collapseCard'])
  })

  it('passes the correct collapsed state to a custom icon', () => {
    const collapsibleIconRender = vi.fn(({ collapsed }) => collapsed ? 'collapsed' : 'expanded')
    const wrapper = mount(InternalProCard as any, {
      props: {
        collapsible: 'icon',
        collapsibleIconRender,
      },
    })

    expect(wrapper.find('.collapse-trigger').text()).toBe('expanded')
    expect(collapsibleIconRender).toHaveBeenCalledWith({ collapsed: false })
  })

  it('preserves attrs and header/body slots in collapsible mode', () => {
    const wrapper = mount(InternalProCard as any, {
      attrs: {
        id: 'collapsible-card',
        'data-owner': 'card-test',
      },
      props: { collapsible: 'header' },
      slots: {
        title: () => 'Title Slot',
        subTitle: () => 'Subtitle Slot',
        extra: () => 'Extra Slot',
        cover: () => 'Cover Slot',
        actions: () => ['Action One', 'Action Two'],
        default: () => 'Content',
      },
    })

    const collapse = wrapper.find('[data-component="Collapse"]')
    expect(collapse.attributes('id')).toBe('collapsible-card')
    expect(collapse.attributes('data-owner')).toBe('card-test')
    expect(collapse.text()).toContain('Title Slot')
    expect(collapse.text()).toContain('Subtitle Slot')
    expect(collapse.text()).toContain('Extra Slot')
    expect(collapse.text()).toContain('Cover Slot')
    expect(collapse.text()).toContain('Action One')
  })

  it('only applies the split class when split is configured', () => {
    const wrapper = mount(InternalProCard as any, {
      props: { collapsible: 'header' },
    })

    expect(wrapper.find('[data-component="Collapse"]').classes()).not.toContain('ant-pro-card-split')
  })
})

describe('ProCard nested layout contract', () => {
  it('detects nested cards without props and does not depend on the last child', () => {
    const wrapper = mount(InternalProCard as any, {
      slots: {
        default: () => [h(ChildCard), h('span', 'Tail')],
      },
    })

    expect(wrapper.find('[data-component="Row"]').exists()).toBe(true)
    expect(wrapper.find('[data-component="Card"]').classes()).toContain('ant-pro-card-contain-card')
  })

  it('supports camelCase numeric and fixed-width colSpan values', () => {
    const numeric = mount(InternalProCard as any, {
      slots: { default: () => h(ChildCard, { title: 'Numeric', colSpan: 12 }) },
    })
    const fixed = mount(InternalProCard as any, {
      slots: { default: () => h(ChildCard, { title: 'Fixed', colSpan: '30%' }) },
    })

    expect(numeric.findComponent({ name: 'Col' }).props('span')).toBe(12)
    expect(fixed.findComponent({ name: 'Col' }).attributes('style')).toContain('width: 30%')
  })

  it('supports responsive colSpan objects', () => {
    const wrapper = mount(InternalProCard as any, {
      slots: {
        default: () => h(ChildCard, {
          title: 'Responsive',
          colSpan: { xs: 24, md: 8 },
        }),
      },
    })

    expect(wrapper.findComponent({ name: 'Col' }).props('span')).toBe(8)
  })

  it('forwards Row align, justify and wrap', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        align: 'middle',
        justify: 'center',
        wrap: true,
      },
      slots: { default: () => h(ChildCard) },
    })

    const row = wrapper.findComponent({ name: 'Row' })
    expect(row.props('align')).toBe('middle')
    expect(row.props('justify')).toBe('center')
    expect(row.props('wrap')).toBe(true)
  })

  it('keeps the parent top padding when nested cards use gutter', () => {
    const withGutter = mount(InternalProCard as any, {
      props: { gutter: [16, 16] },
      slots: { default: () => [h(ChildCard), h(ChildCard)] },
    })
    const withoutGutter = mount(InternalProCard as any, {
      slots: { default: () => [h(ChildCard), h(ChildCard)] },
    })

    expect(withGutter.findComponent({ name: 'Card' }).props('styles').body.paddingBlockStart)
      .toBeUndefined()
    expect(withoutGutter.findComponent({ name: 'Card' }).props('styles').body.paddingBlockStart)
      .toBe(0)
  })

  it('lays out default child cards equally in a row and full width in a column', () => {
    const row = mount(InternalProCard as any, {
      props: { direction: 'row' },
      slots: { default: () => [h(ChildCard), h(ChildCard)] },
    })
    const column = mount(InternalProCard as any, {
      props: { direction: 'column' },
      slots: { default: () => [h(ChildCard), h(ChildCard)] },
    })

    const rowColumns = row.findAllComponents({ name: 'Col' })
    expect(rowColumns).toHaveLength(2)
    expect(rowColumns[0].props('flex')).toBe('1 1 0')
    expect(rowColumns[0].attributes('style')).toContain('width: 0px')

    const columnColumns = column.findAllComponents({ name: 'Col' })
    expect(columnColumns).toHaveLength(2)
    expect(columnColumns[0].props('flex')).toBeUndefined()
    expect(columnColumns[0].attributes('style')).toContain('width: 100%')
  })

  it('centers nested card content without centering the parent layout container', () => {
    const wrapper = mount(InternalProCard as any, {
      props: { layout: 'center' },
      slots: {
        default: () => [
          h(ChildCard),
          h(ChildCard, { layout: 'default' }),
        ],
      },
    })

    const parentCard = wrapper.findComponent({ name: 'Card' })
    const childCards = wrapper.findAllComponents(ChildCard)

    expect(parentCard.props('classes').body).not.toContain('ant-pro-card-body-layout-center')
    expect(childCards[0].attributes('layout')).toBe('center')
    expect(childCards[1].attributes('layout')).toBe('default')
  })
})

describe('ProCard semantic and selection contract', () => {
  it('merges functional classes and styles with internal body semantics', () => {
    const wrapper = mount(InternalProCard as any, {
      props: {
        layout: 'center',
        classes: ({ props }: any) => ({ body: `custom-${props.layout}` }),
        styles: ({ props }: any) => ({ body: { color: props.layout === 'center' ? 'red' : 'blue' } }),
      },
    })

    const card = wrapper.findComponent({ name: 'Card' })
    expect(card.props('classes').body).toContain('ant-pro-card-body')
    expect(card.props('classes').body).toContain('custom-center')
    expect(card.props('styles').body).toMatchObject({
      alignItems: 'center',
      color: 'red',
      display: 'flex',
      justifyContent: 'center',
    })
  })

  it.each([false, 'header'] as const)('supports checked and click events with collapsible=%s', async (collapsible) => {
    const onChecked = vi.fn()
    const onClick = vi.fn()
    const wrapper = mount(InternalProCard as any, {
      props: {
        checked: true,
        collapsible,
        onChecked,
        onClick,
      },
    })

    const root = wrapper.find(collapsible ? '[data-component="Collapse"]' : '[data-component="Card"]')
    await root.trigger('click')

    expect(root.classes()).toContain('ant-pro-card-checked')
    expect(onChecked).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledOnce()
  })
})
