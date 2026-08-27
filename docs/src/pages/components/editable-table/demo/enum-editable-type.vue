<docs lang="zh-CN">
通过 Segmented 切换 `editable.type`，在单行编辑（single）和多行编辑（multiple）之间一键切换。
</docs>

<docs lang="en-US">
Use a segmented control to toggle `editable.type` between inline single-row editing (`single`) and multi-row editing (`multiple`).
</docs>

<script setup lang="ts">
import type { Key, ProColumns } from '@antdv-next1/pro-components'
import { EditableProTable } from '@antdv-next1/pro-components'

interface DataSourceType {
  id: Key
  title?: string
  description?: string
  status?: string
  created_at?: number
}
const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '优化首页加载速度',
    description: '首页白屏时间超过 3s，需优化资源加载',
    status: 'open',
    created_at: 1705286400000,
  },
  {
    id: 624691229,
    title: '修复登录超时问题',
    description: '高峰期登录请求超时，需排查连接池',
    status: 'closed',
    created_at: 1705200000000,
  },
  {
    id: 624674560,
    title: '新增数据导出功能',
    description: '支持导出 Excel 和 CSV 格式',
    status: 'processing',
    created_at: 1705113600000,
  },
]
const editableType = shallowRef<'single' | 'multiple'>(
  'multiple',
)
const editableKeys = shallowRef<Key[]>([])
const dataSource = shallowRef<DataSourceType[] | undefined>([])

const DEMO_TASK_STATUS_ENUM = {
  all: { text: '全部', status: 'Default' },
  open: { text: '待处理', status: 'Error' },
  processing: { text: '进行中', status: 'Processing' },
  closed: { text: '已完成', status: 'Success' },
} as const

/** 生成 EditableTable 新建行的唯一 ID */
let editableRowIdCounter = 1000000
function createEditableRowId(): string {
  editableRowIdCounter += 1
  return String(editableRowIdCounter)
}

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
    width: '30%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: DEMO_TASK_STATUS_ENUM,
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'date',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 150,
    render: (_1, record, _, action) => [
      h('a', { key: 'editable', onClick: () => action?.startEditable?.(record.id) }, '编辑'),
      h('a', { key: 'delete', onClick: () =>
        dataSource.value = dataSource.value?.filter(item => item.id !== record.id) }, '删除'),
    ],
  },
]
</script>

<template>
  <div class="p-6">
    <div :style="{ marginBlockEnd: '16px' }">
      <span>编辑模式：</span>
      <a-segmented
        v-model:value="editableType"
        :options="[
          { label: '单行编辑 single', value: 'single' },
          { label: '多行编辑 multiple', value: 'multiple' },
        ]"
        @change="() => {
          editableKeys = []
        }"
      />
    </div>
    <EditableProTable
      row-key="id"
      header-title="编辑模式切换"
      :columns="columns"
      :request="async() => ({
        data: defaultData,
        total: defaultData.length,
        success: true,
      })"
      :value="dataSource"
      :record-creator-props="{
        position: 'bottom',
        record: () => ({ id: createEditableRowId() }),
        newRecordType: 'dataSource',
      }"
      :editable="{
        type: editableType,
        editableKeys,
        onChange: (keys) => editableKeys = keys,
      }"
      @change="(_dataSource) => dataSource = _dataSource"
    />
  </div>
</template>

<style scoped></style>
