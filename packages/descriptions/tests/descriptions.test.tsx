import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ProDescriptions from '../src/Descriptions'
import FieldRender from '../src/FieldRender'
import ProDescriptionsItem from '../src/Item'

vi.mock('@antdv-next1/pro-form', async () => {
  const { defineComponent, h } = await import('vue')
  const ProForm = Object.assign(
    defineComponent({
      name: 'ProForm',
      setup(_, { slots }) {
        return () => h('div', slots.default?.())
      },
    }),
    {
      useFormInstance: () => ({
        getFieldValue: () => undefined,
      }),
    },
  )

  return {
    __esModule: true,
    default: ProForm,
    ProForm,
    ProFormField: defineComponent({
      name: 'ProFormField',
      setup(_, { slots }) {
        return () => h('span', slots.default?.())
      },
    }),
  }
})

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

describe('ProDescriptions schema sources', () => {
  it('renders items with ProDescriptions field semantics', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        column: 2,
        dataSource: {
          name: 'ProComponents Vue',
          status: '启用',
        },
        columns: [
          {
            label: '名称',
            dataIndex: 'name',
            mode: 'read',
          },
          {
            label: '状态',
            dataIndex: 'status',
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.text()).toContain('名称')
    expect(wrapper.text()).toContain('ProComponents Vue')
    expect(wrapper.text()).toContain('状态')
    expect(wrapper.text()).toContain('启用')
    expect(wrapper.html()).not.toContain('[object Object]')
  })

  it('renders ProDescriptionsItem declarations from the default slot', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        column: 2,
      },
      slots: {
        default: () => [
          h(ProDescriptionsItem, {
            label: '日期',
            valueType: 'date',
          }, () => '2024-01-15'),
          h(ProDescriptionsItem, {
            label: '说明',
          }, () => '通过 SFC 声明'),
        ],
      },
    })

    await nextTick()

    expect(wrapper.findAllComponents(FieldRender).map(field => field.props('text'))).toEqual([
      '2024-01-15',
      '通过 SFC 声明',
    ])
    expect(wrapper.text()).toContain('日期')
    expect(wrapper.text()).toContain('2024-01-15')
    expect(wrapper.text()).toContain('说明')
    expect(wrapper.text()).toContain('通过 SFC 声明')
    expect(wrapper.html()).not.toContain('[object Object]')
  })

  it('uses item content as a fallback and filters hidden items', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        dataSource: {},
        columns: [
          {
            label: '回退内容',
            dataIndex: 'missing',
            content: '默认值',
          },
          {
            label: '隐藏项',
            content: '不应展示',
            hide: true,
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.text()).toContain('默认值')
    expect(wrapper.text()).not.toContain('隐藏项')
    expect(wrapper.text()).not.toContain('不应展示')
  })

  it('uses a fixed table layout when a column enables ellipsis', async () => {
    const wrapper = mount(ProDescriptions, {
      attachTo: document.body,
      props: {
        columns: [
          {
            label: '长文本',
            content: '这是一段需要在容器内省略展示的很长内容',
            ellipsis: true,
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.get('.ant-pro-descriptions').classes()).toContain('ant-pro-descriptions-ellipsis')
    const tableStyle = getComputedStyle(wrapper.get('table').element)
    expect(tableStyle.tableLayout).toBe('fixed')
    expect(tableStyle.width).toBe('100%')

    wrapper.unmount()
  })

  it('passes raw text into FieldRender before copyable wrapping', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        dataSource: {
          date: 1705276800000,
        },
        columns: [
          {
            label: '日期',
            dataIndex: 'date',
            valueType: 'date',
            copyable: true,
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.findAllComponents(FieldRender)).toHaveLength(1)
    expect(wrapper.text()).toContain('2024-01-15')
  })

  it('centers editable field content against the label', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        dataSource: {
          name: '可编辑内容',
        },
        columns: [
          {
            label: '名称',
            dataIndex: 'name',
            mode: 'edit',
          },
        ],
        editable: {
          editableKeys: ['name'],
        },
      },
    })

    await nextTick()

    const field = wrapper.findComponent(FieldRender)
    expect(field.html()).toContain('align-items: center')
  })

  it('does not show an edit icon for option actions', async () => {
    const wrapper = mount(ProDescriptions, {
      props: {
        editable: {
          onSave: async () => true,
        },
        columns: [
          {
            label: '操作',
            valueType: 'option',
            render: () => [
              h('button', { type: 'button' }, '刷新'),
            ],
          },
        ],
      },
    })

    await nextTick()

    expect(wrapper.text()).toContain('刷新')
    expect(wrapper.html()).not.toContain('anticon-edit')
  })

  it('supports prop-less SFC declarations and gives slots priority over content props', async () => {
    const wrapper = mount(ProDescriptions, {
      slots: {
        default: () => [
          h(ProDescriptionsItem, null, () => '无 props 内容'),
          h(ProDescriptionsItem, {
            label: '内容优先级',
            content: 'content prop',
          }, () => 'default slot'),
        ],
      },
    })

    await nextTick()

    expect(wrapper.text()).toContain('无 props 内容')
    expect(wrapper.text()).toContain('default slot')
    expect(wrapper.text()).not.toContain('content prop')
  })
})
