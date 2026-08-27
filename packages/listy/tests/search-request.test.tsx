import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ProTable from '../../table/src/Table'

describe('ProListy light filter request integration', () => {
  function mountTable(request: ReturnType<typeof vi.fn>, props: Record<string, any> = {}) {
    return mount(ProTable as any, {
      props: {
        type: 'listy',
        rowKey: 'id',
        pagination: false,
        columns: [
          {
            title: 'State',
            dataIndex: 'state',
            valueType: 'select',
            valueEnum: {
              open: { text: 'Open' },
              closed: { text: 'Closed' },
            },
          },
        ],
        request,
        ...props,
      },
    })
  }

  it('mounts the light filter and triggers the initial request', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      success: true,
      total: 0,
    })

    const wrapper = mountTable(request, {
      search: { filterType: 'light' },
    })

    expect(wrapper.find('.ant-pro-table-search-light-filter').exists()).toBe(true)
    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledTimes(1)
    })
  })

  it('triggers the initial request with the query filter', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      success: true,
      total: 0,
    })

    mountTable(request, { search: {} })

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledTimes(1)
    })
  })

  it('does not trigger the initial request in manual request mode', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      success: true,
      total: 0,
    })

    mountTable(request, {
      manualRequest: true,
      search: { filterType: 'light' },
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(request).not.toHaveBeenCalled()
  })
})
