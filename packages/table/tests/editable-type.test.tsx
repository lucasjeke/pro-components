import type { Key } from '@antdv-next1/pro-utils'
import { ProForm } from '@antdv-next1/pro-form'
import { flushPromises, mount } from '@vue/test-utils'
import { message } from 'antdv-next'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { CellEditorTable, EditableProTable } from '../src/components/EditableTable'
import ProTable from '../src/Table'

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('editable table type', () => {
  function mountFormItemEditableTable(
    onActionConfig?: (config: any) => void,
    options: {
      controlled?: boolean
      numericRowKeys?: boolean
      passRecordToStartEditable?: boolean
      recordCreatorProps?: false | Record<string, any>
    } = {},
  ) {
    const firstRowId = options.numericRowKeys ? 624748504 : '624748504'
    const secondRowId = options.numericRowKeys ? 624691229 : '624691229'
    return mount(ProForm, {
      global: {
        stubs: {
          ProFormDependency: true,
        },
      },
      props: {
        model: {
          table: [
            { id: firstRowId, title: '任务 1' },
            { id: secondRowId, title: '任务 2' },
          ],
        },
        submitter: false,
      },
      slots: {
        default: () => (
          <EditableProTable
            name="table"
            rowKey="id"
            controlled={options.controlled}
            columns={[
              { title: '任务名称', dataIndex: 'title' },
              {
                title: '操作',
                valueType: 'option',
                render: (_dom, record, _index, action) => h('a', {
                  onClick: () => action?.startEditable?.(
                    record.id,
                    options.passRecordToStartEditable === false ? undefined : record,
                  ),
                }, '编辑'),
              },
            ]}
            editable={{
              type: 'multiple',
              actionRender: (_row, config, defaultDom) => {
                onActionConfig?.(config)
                return [defaultDom.save, defaultDom.delete, defaultDom.cancel]
              },
            }}
            recordCreatorProps={options.recordCreatorProps ?? false}
          />
        ),
      },
    })
  }

  it('keeps the parent form list as an array after saving by row key', async () => {
    const wrapper = mountFormItemEditableTable()
    await nextTick()

    const editableTable = wrapper.findComponent(EditableProTable)
    await editableTable.get('a').trigger('click')
    await nextTick()
    ;(wrapper.vm as any).setFieldValue(['table', 0, 'title'], '已更新任务')
    await nextTick()
    expect((wrapper.vm as any).getFieldValue(['table', 0, 'title'])).toBe('已更新任务')
    const saveAction = editableTable.findAll('a').find(action => action.text() === '保存')
    expect(saveAction).toBeDefined()
    await saveAction!.trigger('click')
    await flushPromises()
    await nextTick()

    const tableValue = (wrapper.vm as any).getFieldValue('table')
    expect(Array.isArray(tableValue)).toBe(true)
    expect(tableValue).toHaveLength(2)
    expect(tableValue[0].title).toBe('已更新任务')
  })

  it('restores the edited row without changing the parent form list into an object', async () => {
    let actionConfig: any
    const wrapper = mountFormItemEditableTable(config => (actionConfig = config))
    await nextTick()

    const editableTable = wrapper.findComponent(EditableProTable)
    await editableTable.get('a').trigger('click')
    await nextTick()
    expect({ recordKey: actionConfig.recordKey, formRecordKey: actionConfig.formRecordKey, index: actionConfig.index }).toEqual({ recordKey: '624748504', formRecordKey: 0, index: 0 })
    ;(wrapper.vm as any).setFieldValue(['table', 0, 'title'], '不应保留的修改')
    await nextTick()
    const cancelAction = editableTable.findAll('a').find(action => action.text() === '取消')
    expect(cancelAction).toBeDefined()
    await cancelAction!.trigger('click')
    await flushPromises()
    await nextTick()

    const tableValue = (wrapper.vm as any).getFieldValue('table')
    expect(Array.isArray(tableValue)).toBe(true)
    expect(tableValue).toHaveLength(2)
    expect(tableValue[0].title).toBe('任务 1')
  })

  it('keeps an existing numeric-key row when startEditable receives only its business key', async () => {
    const wrapper = mountFormItemEditableTable(undefined, {
      controlled: true,
      numericRowKeys: true,
      passRecordToStartEditable: false,
      recordCreatorProps: {
        record: (index: number) => ({ id: index + 1 }),
      },
    })
    await nextTick()

    const editableTable = wrapper.findComponent(EditableProTable)
    await editableTable.get('a').trigger('click')
    await nextTick()
    ;(wrapper.vm as any).setFieldValue(['table', 0, 'title'], '不应保留的修改')
    await nextTick()

    const cancelAction = editableTable.findAll('a').find(action => action.text() === '取消')
    expect(cancelAction).toBeDefined()
    await cancelAction!.trigger('click')
    await flushPromises()
    await nextTick()

    const tableValue = (wrapper.vm as any).getFieldValue('table')
    expect(Array.isArray(tableValue)).toBe(true)
    expect(tableValue).toHaveLength(2)
    expect(tableValue[0]).toEqual({ id: 624748504, title: '任务 1' })
  })

  it('still removes a newly created cache row when editing is cancelled', async () => {
    const wrapper = mountFormItemEditableTable(undefined, {
      controlled: true,
      numericRowKeys: true,
      passRecordToStartEditable: false,
      recordCreatorProps: {
        record: (index: number) => ({ id: index + 1, title: `任务 ${index + 1}` }),
      },
    })
    await nextTick()

    const editableTable = wrapper.findComponent(EditableProTable)
    const creatorButton = editableTable.findAll('button')
      .find(button => button.text().includes('添加一行数据'))
    expect(creatorButton).toBeDefined()
    await creatorButton!.trigger('click')
    await flushPromises()
    await nextTick()

    expect((wrapper.vm as any).getFieldValue('table')).toHaveLength(3)
    const cancelAction = editableTable.findAll('a').find(action => action.text() === '取消')
    expect(cancelAction).toBeDefined()
    await cancelAction!.trigger('click')
    await flushPromises()
    await nextTick()

    const tableValue = (wrapper.vm as any).getFieldValue('table')
    expect(Array.isArray(tableValue)).toBe(true)
    expect(tableValue).toHaveLength(2)
    expect(tableValue.map((row: any) => row.id)).toEqual([624748504, 624691229])
  })

  it('passes the current row to formItemRender without expanding a numeric row key into a field tree', async () => {
    let renderedRecord: Record<string, any> | undefined
    const wrapper = mount(EditableProTable, {
      props: {
        columns: [
          { title: '任务名称', dataIndex: 'title' },
          {
            title: '标签',
            dataIndex: 'labels',
            formItemRender: (_schema: any, config: any) => {
              if (config.record?.id === 1000003)
                renderedRecord = config.record
              return h('input')
            },
          },
        ],
        editable: {
          type: 'multiple',
        },
        recordCreatorProps: false,
        rowKey: 'id',
        search: false,
        value: [
          { id: 624748504, title: '任务 1' },
          { id: 624691229, title: '任务 2' },
        ],
      },
    })

    await nextTick()
    await (wrapper.vm as any).addEditRecord({ id: 1000003, title: '新建任务' })
    await flushPromises()
    await nextTick()

    expect(renderedRecord).toEqual({ id: 1000003, title: '新建任务' })
  })

  it('hydrates editable form fields from the initial value without controlled mode', async () => {
    const wrapper = mount(EditableProTable, {
      props: {
        columns: [
          { title: '任务名称', dataIndex: 'title' },
          { title: '描述', dataIndex: 'description' },
        ],
        editable: {
          type: 'multiple',
          editableKeys: ['1705286400000', '1705286400001'],
        },
        recordCreatorProps: false,
        rowKey: 'id',
        search: false,
        value: [
          {
            id: '1705286400000',
            title: '优化首页加载速度',
            description: '首页白屏时间超过 3s',
          },
          {
            id: '1705286400001',
            title: '修复登录超时问题',
            description: '高峰期登录请求超时',
          },
        ],
      },
    })

    await flushPromises()
    await nextTick()

    expect((wrapper.vm as any).editableFormRef?.getFieldsValue()).toEqual({
      1705286400000: {
        title: '优化首页加载速度',
        description: '首页白屏时间超过 3s',
      },
      1705286400001: {
        title: '修复登录超时问题',
        description: '高峰期登录请求超时',
      },
    })
  })

  it('deletes the edited row while preserving the parent form list array', async () => {
    const wrapper = mountFormItemEditableTable()
    await nextTick()

    const editableTable = wrapper.findComponent(EditableProTable)
    await editableTable.get('a').trigger('click')
    await nextTick()
    const deleteAction = editableTable.findAll('a').find(action => action.text() === '删除')
    expect(deleteAction).toBeDefined()
    await deleteAction!.trigger('click')
    await nextTick()
    const confirmButton = Array.from(document.body.querySelectorAll('button'))
      .find(button => button.textContent?.replace(/\s/g, '') === '确定')
    expect(confirmButton).toBeDefined()
    confirmButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()
    await nextTick()

    const tableValue = (wrapper.vm as any).getFieldValue('table')
    expect(Array.isArray(tableValue)).toBe(true)
    expect(tableValue).toHaveLength(1)
    expect(tableValue[0].id).toBe('624691229')
  })

  it('reads its initial value from the parent form when name is provided', async () => {
    const wrapper = mount(ProForm, {
      global: {
        stubs: {
          ProFormDependency: true,
        },
      },
      props: {
        model: {
          table: [
            { id: 1, title: '任务 1' },
            { id: 2, title: '任务 2' },
          ],
        },
        submitter: false,
      },
      slots: {
        default: () => (
          <EditableProTable
            name="table"
            rowKey="id"
            columns={[{ title: '任务名称', dataIndex: 'title' }]}
            recordCreatorProps={false}
          />
        ),
      },
    })

    await nextTick()

    expect(wrapper.findAll('tbody tr.ant-table-row')).toHaveLength(2)
    expect(wrapper.text()).toContain('任务 1')
    expect(wrapper.text()).toContain('任务 2')
  })

  it('uses the latest editable type after switching from multiple to single', async () => {
    let editableKeys: Key[] = []
    const createEditable = (type: 'single' | 'multiple') => ({
      type,
      editableKeys,
      onChange: (keys: Key[]) => {
        editableKeys = keys
      },
    })

    const wrapper = mount(ProTable, {
      props: {
        columns: [],
        dataSource: [{ id: 1 }, { id: 2 }],
        editable: createEditable('multiple'),
        pagination: false,
        rowKey: 'id',
        search: false,
      },
    })
    const table = wrapper.vm as typeof wrapper.vm & {
      startEditable: (recordKey: Key) => Promise<boolean>
    }

    expect(await table.startEditable(1)).toBe(true)
    await wrapper.setProps({ editable: createEditable('multiple') })
    expect(await table.startEditable(2)).toBe(true)

    editableKeys = []
    await wrapper.setProps({ editable: createEditable('single') })
    await nextTick()

    expect(await table.startEditable(1)).toBe(true)
    await wrapper.setProps({ editable: createEditable('single') })
    expect(await table.startEditable(2)).toBe(false)
    expect(editableKeys).toEqual([1])
  })

  it('shows the single-edit warning when adding a row without an action column', async () => {
    const warning = vi.fn()
    const MessageHolder = vi.fn(() => <div data-testid="editable-message-holder" />)
    const useMessage = vi.spyOn(message, 'useMessage').mockReturnValue([
      { warning },
      MessageHolder,
    ] as any)
    const wrapper = mount(CellEditorTable, {
      props: {
        columns: [
          {
            title: '任务名称',
            dataIndex: 'title',
          },
        ],
        value: [{ id: 1, title: '任务 1' }],
        rowKey: 'id',
        search: false,
        recordCreatorProps: {
          record: () => ({ id: 2, title: '任务 2' }),
          newRecordType: 'dataSource',
        },
      },
    })

    const cell = wrapper.get('tbody tr.ant-table-row td')
    const creatorButton = wrapper.findAll('button').find(button => button.text().includes('添加一行数据'))

    expect(creatorButton).toBeDefined()
    expect(useMessage).toHaveBeenCalled()
    expect(MessageHolder).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="editable-message-holder"]').exists()).toBe(true)

    await cell.trigger('dblclick')
    await nextTick()

    expect(wrapper.find('input').exists()).toBe(true)

    await creatorButton!.trigger('click')

    expect(warning).toHaveBeenCalledWith('只能同时编辑一行')

    useMessage.mockRestore()
  })
})
