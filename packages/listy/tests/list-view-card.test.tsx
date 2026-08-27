import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ListView from '../src/ListView'
import { genProListyStyle } from '../src/style'

const SlotStub = defineComponent({
  setup(_props, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const ListyStub = defineComponent({
  name: 'AListy',
  inheritAttrs: false,
  props: ['items', 'itemRender', 'virtual', 'height'],
  setup(props, { attrs }) {
    return () => h('div', {
      ...attrs,
      'data-list-items': props.items?.length || 0,
      'style': props.height ? { height: `${props.height}px` } : undefined,
    }, (props.virtual ? props.items?.slice(0, 4) : props.items)?.map(
      (item: unknown, index: number) => props.itemRender?.(item, index),
    ))
  },
})

const RowStub = defineComponent({
  name: 'ARow',
  props: ['gutter'],
  setup(_props, { slots }) {
    return () => h('div', { class: 'row-stub' }, slots.default?.())
  },
})

const ColStub = defineComponent({
  name: 'ACol',
  props: ['span', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  setup(_props, { slots, attrs }) {
    return () => h('div', attrs, slots.default?.())
  },
})

const CheckCardStub = defineComponent({
  name: 'ProCheckCard',
  inheritAttrs: false,
  props: [
    'title',
    'avatar',
    'description',
    'extra',
    'actions',
    'checked',
    'bordered',
    'ghost',
    'disabled',
  ],
  emits: ['change'],
  setup(props, { slots, attrs }) {
    return () => h('article', {
      ...attrs,
      'data-checked': String(!!props.checked),
      'data-avatar': props.avatar,
    }, [
      h('header', [props.title, props.extra]),
      h('p', props.description as any),
      slots.default?.(),
      h('footer', props.actions as any),
    ])
  },
})

const PaginationStub = defineComponent({
  name: 'APagination',
  emits: ['change', 'showSizeChange'],
  setup() {
    return () => h('button')
  },
})

const globalStubs = {
  AListy: ListyStub,
  ARow: RowStub,
  ACol: ColStub,
  APagination: PaginationStub,
  ProCard: SlotStub,
  ProCheckCard: CheckCardStub,
  ASpin: SlotStub,
}

const dataSource = [
  {
    id: 1,
    title: 'ProTable',
    subTitle: 'Stable',
    avatar: 'table.svg',
    description: 'Table description',
    content: 'Table content',
    actions: 'Open table',
  },
  {
    id: 2,
    title: 'ProForm',
    subTitle: 'Beta',
    avatar: 'form.svg',
    description: 'Form description',
    content: 'Form content',
    actions: 'Open form',
  },
  {
    id: 3,
    title: 'ProCard',
    subTitle: 'Stable',
    avatar: 'card.svg',
    description: 'Card description',
    content: 'Card content',
    actions: 'Open card',
  },
]

const columns = [
  { dataIndex: 'title', listSlot: 'title' },
  { dataIndex: 'subTitle', listSlot: 'subTitle' },
  { dataIndex: 'avatar', listSlot: 'avatar' },
  { dataIndex: 'description', listSlot: 'description' },
  { dataIndex: 'content', listSlot: 'content' },
  { dataIndex: 'actions', listSlot: 'actions' },
]

function mountListView(props: Record<string, any>) {
  return mount(ListView as any, {
    props: {
      prefixCls: 'ant-pro-listy',
      rowKey: 'id',
      dataSource,
      columns,
      ...props,
    },
    global: {
      stubs: globalStubs,
    },
  })
}

describe('ListView card mode', () => {
  it('keeps card actions in the card height calculation', () => {
    const componentCls = '.ant-pro-listy'
    const antCls = '.ant'
    const styles = genProListyStyle({
      antCls,
      componentCls,
    } as any) as Record<string, any>
    const gridSelector = `${antCls}-listy${componentCls}-grid,${componentCls}-container${componentCls}-grid`
    const gridStyle = styles[componentCls][gridSelector]
    const cardStyle = gridStyle[`${componentCls}-grid-col`][`> ${antCls}-pro-checkcard`]

    expect(cardStyle).toMatchObject({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      [`> ${antCls}-card-body`]: {
        flex: 1,
        height: 'auto',
      },
    })
    expect(cardStyle).not.toHaveProperty('height')
  })

  it('keeps card actions compact in the extra area', () => {
    const componentCls = '.ant-pro-listy'
    const styles = genProListyStyle({
      componentCls,
    } as any) as Record<string, any>

    expect(styles[componentCls]['&-card-actions']).toMatchObject({
      display: 'inline-flex',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    })
  })

  it('removes the Listy item hover background from virtual card rows', () => {
    const componentCls = '.ant-pro-listy'
    const antCls = '.ant'
    const styles = genProListyStyle({
      antCls,
      componentCls,
    } as any) as Record<string, any>
    const gridSelector = `${antCls}-listy${componentCls}-grid,${componentCls}-container${componentCls}-grid`
    const gridStyle = styles[componentCls][gridSelector]

    expect(
      gridStyle[`${componentCls}-grid-virtual-row`]['&:hover'],
    ).toMatchObject({
      backgroundColor: 'transparent',
    })
  })

  it('uses grid presence as the only list/card mode switch', async () => {
    const wrapper = mountListView({})

    expect(wrapper.findComponent(ListyStub).exists()).toBe(true)
    expect(wrapper.findAllComponents(CheckCardStub)).toHaveLength(0)

    await wrapper.setProps({ grid: { column: 2 } })

    expect(wrapper.findComponent(ListyStub).exists()).toBe(false)
    expect(wrapper.findAllComponents(CheckCardStub)).toHaveLength(3)
  })

  it('renders cards with Row and Col and maps responsive column counts to spans', () => {
    const wrapper = mountListView({
      grid: {
        gutter: [16, 12],
        column: 2,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 6,
        xxl: 8,
      },
    })

    expect(wrapper.findAllComponents(RowStub)).toHaveLength(1)
    expect(wrapper.findAllComponents(ColStub)).toHaveLength(3)
    const firstCol = wrapper.findComponent(ColStub)
    expect(firstCol.props()).toMatchObject({
      span: 12,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      xxl: 3,
    })
  })

  it('maps listSlot fields and itemCardProps to ProCheckCard', () => {
    const wrapper = mountListView({
      grid: { column: 2 },
      itemCardProps: {
        bordered: false,
        ghost: true,
      },
    })

    const card = wrapper.findComponent(CheckCardStub)
    expect(card.props('avatar')).toBe('table.svg')
    expect(card.props('description')).toBe('Table description')
    expect(card.props('bordered')).toBe(false)
    expect(card.props('ghost')).toBe(true)
    expect(card.props('actions')).toBeUndefined()
    expect(card.find('header').text()).toContain('Open table')
    expect(card.find('footer').text()).toBe('')
    expect(card.text()).toContain('ProTable')
    expect(card.text()).toContain('Stable')
    expect(card.text()).toContain('Table content')
    expect(card.text()).toContain('Open table')
  })

  it('passes ProCheckCard as itemRender defaultDom in card mode', () => {
    const itemRender = vi.fn((_item, _index, defaultDom) => (
      h('section', { class: 'custom-card-item' }, [defaultDom])
    ))
    const wrapper = mountListView({
      grid: { column: 2 },
      itemRender,
    })

    expect(itemRender).toHaveBeenCalledTimes(3)
    expect(wrapper.findAll('.custom-card-item')).toHaveLength(3)
    expect(wrapper.findAllComponents(CheckCardStub)).toHaveLength(3)
  })

  it('keeps rowSelection behavior when a card changes', async () => {
    const onChange = vi.fn()
    const wrapper = mountListView({
      grid: { column: 2 },
      rowSelection: { onChange },
    })

    wrapper.findComponent(CheckCardStub).vm.$emit('change', true)
    await nextTick()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0]?.[0]).toEqual([1])
    expect(wrapper.findComponent(CheckCardStub).props('checked')).toBe(true)
  })

  it('keeps cards non-selectable when rowSelection is not configured', async () => {
    const onChange = vi.fn()
    const wrapper = mountListView({
      grid: { column: 2 },
      itemCardProps: {
        checked: true,
        onChange,
      },
    })

    const card = wrapper.findComponent(CheckCardStub)
    expect(card.props('checked')).toBe(false)
    expect(card.props('onChange')).toBeUndefined()

    card.vm.$emit('change', true)
    await nextTick()

    expect(onChange).not.toHaveBeenCalled()
    expect(card.props('checked')).toBe(false)
  })

  it('renders only the current pagination page in card mode', async () => {
    const wrapper = mountListView({
      grid: { column: 2 },
      pagination: { pageSize: 2 },
    })

    expect(wrapper.findAllComponents(CheckCardStub)).toHaveLength(2)
    expect(wrapper.text()).toContain('ProTable')
    expect(wrapper.text()).not.toContain('ProCard')

    wrapper.findComponent(PaginationStub).vm.$emit('change', 2, 2)
    await nextTick()

    expect(wrapper.findAllComponents(CheckCardStub)).toHaveLength(1)
    expect(wrapper.text()).toContain('ProCard')
  })

  it('virtualizes complete card rows instead of individual cards', async () => {
    const manyItems = Array.from({ length: 40 }, (_, index) => ({
      ...dataSource[index % dataSource.length],
      id: index + 1,
      title: `Item ${index + 1}`,
    }))
    const wrapper = mountListView({
      dataSource: manyItems,
      grid: { column: 2, gutter: [16, 16] },
      virtual: true,
      height: 240,
    })
    await nextTick()

    const viewport = wrapper.find('[data-listy-card-virtual]')
    expect(viewport.exists()).toBe(true)
    expect(viewport.attributes('style')).toContain('height: 240px')
    expect(wrapper.findComponent(ListyStub).props('items')).toHaveLength(20)
    expect(wrapper.findAllComponents(CheckCardStub).length).toBeGreaterThan(0)
    expect(wrapper.findAllComponents(CheckCardStub).length).toBeLessThan(40)
    expect(wrapper.findAllComponents(CheckCardStub).length % 2).toBe(0)
  })
})
