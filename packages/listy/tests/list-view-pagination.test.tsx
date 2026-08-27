import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ListView from '../src/ListView'

describe('ListView pagination', () => {
  it('renders the selected page data after pagination changes', async () => {
    const listItems: number[][] = []
    const dataSource = [
      { id: 1, title: 'Page 1 - A' },
      { id: 2, title: 'Page 1 - B' },
      { id: 3, title: 'Page 2 - A' },
      { id: 4, title: 'Page 2 - B' },
    ]
    const ListyStub = defineComponent({
      name: 'AListy',
      props: ['items'],
      setup(props) {
        return () => {
          listItems.push((props.items || []).map((item: { id: number }) => item.id))
          return h('div')
        }
      },
    })
    const PaginationStub = defineComponent({
      name: 'APagination',
      emits: ['change', 'showSizeChange'],
      setup() {
        return () => h('button')
      },
    })
    const SlotStub = defineComponent({
      setup(_props, { slots }) {
        return () => h('div', slots.default?.())
      },
    })

    const wrapper = mount(ListView as any, {
      props: {
        prefixCls: 'ant-pro-list',
        rowKey: 'id',
        dataSource,
        pagination: {
          pageSize: 2,
        },
        columns: [
          {
            dataIndex: 'title',
            listSlot: 'title',
          },
        ],
      },
      global: {
        stubs: {
          AListy: ListyStub,
          APagination: PaginationStub,
          ProCard: SlotStub,
          ASpin: SlotStub,
        },
      },
    })

    listItems.length = 0
    wrapper.findComponent({ name: 'APagination' }).vm.$emit('change', 2, 2)
    await nextTick()

    expect(listItems.at(-1)).toEqual([3, 4])
  })

  it('updates rendered page data after page size changes', async () => {
    const listItems: number[][] = []
    const dataSource = [
      { id: 1, title: 'A' },
      { id: 2, title: 'B' },
      { id: 3, title: 'C' },
      { id: 4, title: 'D' },
    ]
    const ListyStub = defineComponent({
      name: 'AListy',
      props: ['items'],
      setup(props) {
        return () => {
          listItems.push((props.items || []).map((item: { id: number }) => item.id))
          return h('div')
        }
      },
    })
    const PaginationStub = defineComponent({
      name: 'APagination',
      emits: ['change', 'showSizeChange'],
      setup() {
        return () => h('button')
      },
    })
    const SlotStub = defineComponent({
      setup(_props, { slots }) {
        return () => h('div', slots.default?.())
      },
    })

    const wrapper = mount(ListView as any, {
      props: {
        prefixCls: 'ant-pro-list',
        rowKey: 'id',
        dataSource,
        pagination: {
          defaultPageSize: 2,
          showSizeChanger: true,
        },
        columns: [
          {
            dataIndex: 'title',
            listSlot: 'title',
          },
        ],
      },
      global: {
        stubs: {
          AListy: ListyStub,
          APagination: PaginationStub,
          ProCard: SlotStub,
          ASpin: SlotStub,
        },
      },
    })

    listItems.length = 0
    wrapper.findComponent({ name: 'APagination' }).vm.$emit('showSizeChange', 1, 3)
    await nextTick()

    expect(listItems.at(-1)).toEqual([1, 2, 3])
  })

  it('paginates data loaded after the component is mounted', async () => {
    const listItems: number[][] = []
    const ListyStub = defineComponent({
      name: 'AListy',
      props: ['items'],
      setup(props) {
        return () => {
          listItems.push((props.items || []).map((item: { id: number }) => item.id))
          return h('div')
        }
      },
    })
    const PaginationStub = defineComponent({
      name: 'APagination',
      emits: ['change', 'showSizeChange'],
      setup() {
        return () => h('button')
      },
    })
    const SlotStub = defineComponent({
      setup(_props, { slots }) {
        return () => h('div', slots.default?.())
      },
    })

    const wrapper = mount(ListView as any, {
      props: {
        prefixCls: 'ant-pro-list',
        rowKey: 'id',
        dataSource: [],
        pagination: {
          pageSize: 2,
        },
        columns: [
          {
            dataIndex: 'title',
            listSlot: 'title',
          },
        ],
      },
      global: {
        stubs: {
          AListy: ListyStub,
          APagination: PaginationStub,
          ProCard: SlotStub,
          ASpin: SlotStub,
        },
      },
    })

    await wrapper.setProps({
      dataSource: [
        { id: 1, title: 'Page 1 - A' },
        { id: 2, title: 'Page 1 - B' },
        { id: 3, title: 'Page 2 - A' },
        { id: 4, title: 'Page 2 - B' },
      ],
    })
    listItems.length = 0

    const pagination = wrapper.findComponent({ name: 'APagination' })
    expect(pagination.exists()).toBe(true)
    pagination.vm.$emit('change', 2, 2)
    await nextTick()

    expect(listItems.at(-1)).toEqual([3, 4])
  })

  it('keeps controlled server pagination in sync without slicing page data again', async () => {
    const listItems: number[][] = []
    const onChange = vi.fn()
    const ListyStub = defineComponent({
      name: 'AListy',
      props: ['items'],
      setup(props) {
        return () => {
          listItems.push((props.items || []).map((item: { id: number }) => item.id))
          return h('div')
        }
      },
    })
    const PaginationStub = defineComponent({
      name: 'APagination',
      props: ['current', 'pageSize', 'total'],
      emits: ['change', 'showSizeChange'],
      setup() {
        return () => h('button')
      },
    })
    const SlotStub = defineComponent({
      setup(_props, { slots }) {
        return () => h('div', slots.default?.())
      },
    })
    const columns = [
      {
        dataIndex: 'title',
        listSlot: 'title',
      },
    ]
    const wrapper = mount(ListView as any, {
      props: {
        prefixCls: 'ant-pro-list',
        rowKey: 'id',
        dataSource: [
          { id: 1, title: 'Page 1 - A' },
          { id: 2, title: 'Page 1 - B' },
        ],
        pagination: {
          current: 1,
          pageSize: 2,
          total: 4,
          onChange,
        },
        columns,
      },
      global: {
        stubs: {
          AListy: ListyStub,
          APagination: PaginationStub,
          ProCard: SlotStub,
          ASpin: SlotStub,
        },
      },
    })

    const pagination = wrapper.findComponent({ name: 'APagination' })
    pagination.vm.$emit('change', 2, 2)
    await nextTick()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(2, 2)

    await wrapper.setProps({
      dataSource: [
        { id: 3, title: 'Page 2 - A' },
        { id: 4, title: 'Page 2 - B' },
      ],
      pagination: {
        current: 2,
        pageSize: 2,
        total: 4,
        onChange,
      },
    })
    await nextTick()

    expect(listItems.at(-1)).toEqual([3, 4])
    expect(pagination.props('current')).toBe(2)
  })
})
