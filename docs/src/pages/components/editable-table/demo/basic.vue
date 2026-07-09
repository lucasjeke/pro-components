<docs lang="zh-CN">
可编辑表格
</docs>

<docs lang="en-US">
editable table
</docs>

<script lang="ts" setup>
import type { ProColumns } from '@antdv-next1/pro-table'
import { ProFormRadioGroup } from '@antdv-next1/pro-form'
import { EditableProTable } from '@antdv-next1/pro-table'
import { h, shallowReactive, shallowRef } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

interface DataSourceType {
  id: string | number
  title?: string
  readonly?: string
  description?: string
  status?: string
  created_at?: number
  update_at?: number
  children?: DataSourceType[]
}
const defaultData = shallowReactive([
  {
    id: 624748504,
    title: '优化首页加载速度',
    readonly: '优化首页加载速度',
    description: '首页白屏时间超过 3s，需优化资源加载和首屏渲染',
    status: 'open',
    created_at: 1705286400000,
    update_at: 1705372800000,
  },
  {
    id: 624691229,
    title: '修复登录超时问题',
    readonly: '修复登录超时问题',
    description: '用户反馈高峰期登录请求超时，需排查连接池配置',
    status: 'closed',
    created_at: 1705200000000,
    update_at: 1705286400000,
  },
] as DataSourceType[])
const editableKeys = shallowRef<(string | number)[]>([])
const dataSource = shallowRef<DataSourceType[]>([])
const position = shallowRef<'top' | 'bottom' | 'hidden'>(
  'bottom',
)
/** 生成 EditableTable 新建行的唯一 ID */
let editableRowIdCounter = 1000000
function createEditableRowId(): string {
  editableRowIdCounter += 1
  return String(editableRowIdCounter)
}
function handleTableChange(value?: DataSourceType[]) {
  dataSource.value = value || []
}
function removeEditableRow(recordId: string | number) {
  dataSource.value = dataSource.value.filter(item => item.id !== recordId)
  editableKeys.value = editableKeys.value.filter(
    key => key !== recordId && String(key) !== String(recordId),
  )
}
const DEMO_TASK_STATUS_ENUM = {
  all: { text: '全部', status: 'Default' },
  open: { text: '待处理', status: 'Error' },
  processing: { text: '进行中', status: 'Processing' },
  closed: { text: '已完成', status: 'Success' },
} as const
const columns: ProColumns<DataSourceType>[] = shallowReactive([
  {
    title: '任务名称',
    dataIndex: 'title',
    tooltip: '只读，使用form.getFieldValue获取不到值',
    formItemProps: (_, { rowIndex }) => {
      return {
        rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
      }
    },
    editable: (_, _1, index) => index !== 0,
    width: '15%',
  },
  {
    title: '任务名称（只读）',
    dataIndex: 'readonly',
    tooltip: '只读，使用form.getFieldValue可以获取到值',
    readonly: true,
    width: '15%',
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: DEMO_TASK_STATUS_ENUM,
  },
  {
    title: '描述',
    dataIndex: 'description',
    fieldProps: (form, { rowKey, rowIndex }) => {
      if (form?.getFieldValue([rowKey || '', 'title']) === '暂不处理') {
        return {
          disabled: true,
        }
      }
      if (rowIndex > 9) {
        return {
          disabled: true,
        }
      }
      return {}
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'date',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (_1, record, _, action) => [
      h('a', { key: 'editable', onClick: () => action?.startEditable?.(record.id) }, '编辑'),
      h('a', { key: 'delete', onClick: () => removeEditableRow(record.id) }, '删除'),
    ],
  },
])
</script>

<template>
  <div class="p-6">
    <EditableProTable
      v-model:value="dataSource"
      row-key="id"
      header-title="任务管理"
      :max-length="5"
      :tool-bar-render="() => [
        h(ProFormRadioGroup, {
          key: 'render',
          fieldProps: {
            value: position,
            onChange: (e) => position = e.target.value,
          },
          options: [
            {
              label: '添加到顶部',
              value: 'top',
            },
            {
              label: '添加到底部',
              value: 'bottom',
            },
            {
              label: '隐藏',
              value: 'hidden',
            },
          ],
        }),
      ]"
      :scroll="{
        x: 960,
      }"
      :record-creator-props="
        position !== 'hidden'
          ? {
            position: position as 'top',
            record: () => ({ id: createEditableRowId() }),
            newRecordType: 'dataSource',
          }
          : false"
      :loading="false"
      :columns="columns"
      :request="async () =>
        ({
          data: defaultData,
          total: 2,
          success: true,
        })"
      :editable="{
        type: 'multiple',
        editableKeys,
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row);
          await waitTime(2000);
        },
        onChange: (value) => {
          editableKeys = value
        },
      }"
      @change="handleTableChange"
    />
  </div>
</template>

<style scoped></style>
