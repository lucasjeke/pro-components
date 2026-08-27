import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Toolbar from '../src/components/ToolBar'

describe('table toolbar', () => {
  it('renders toolbar search and actions in the right section', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(Toolbar, {
      props: {
        columns: [],
        options: false,
        toolbar: {
          title: '实验室',
          search: {
            onSearch,
          },
          actions: [
            h('button', {
              'data-toolbar-action': '',
              type: 'button',
            }, '新建实验'),
          ],
        },
      },
    })

    const right = wrapper.get('.ant-pro-table-list-toolbar-right')
    expect(right.findAll('.ant-input-search input')).toHaveLength(1)
    expect(right.get('[data-toolbar-action]').text()).toBe('新建实验')

    await right.get('.ant-input-search input').setValue('实验名称1')
    await right.get('.ant-input-search-btn').trigger('click')

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch.mock.calls[0]?.[0]).toBe('实验名称1')
  })

  it('lets toolbar search explicitly override options search', () => {
    const wrapper = mount(Toolbar, {
      props: {
        columns: [],
        options: {
          search: {
            onSearch: vi.fn(),
          },
        },
        toolbar: {
          title: '实验室',
          search: false,
        },
      },
    })

    expect(wrapper.find('.ant-input-search').exists()).toBe(false)
  })

  it('lets toolbar settings replace settings generated from options', () => {
    const wrapper = mount(Toolbar, {
      props: {
        columns: [],
        options: {
          reload: true,
          density: true,
        },
        toolbar: {
          title: '实验室',
          settings: [
            h('span', { 'data-toolbar-setting': '' }, '自定义设置'),
          ],
        },
      },
    })

    const settings = wrapper.get('.ant-pro-table-list-toolbar-setting-items')
    expect(settings.findAll('.ant-pro-table-list-toolbar-setting-item')).toHaveLength(1)
    expect(settings.get('[data-toolbar-setting]').text()).toBe('自定义设置')
  })
})
