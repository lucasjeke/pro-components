<docs lang="zh-CN">
有子列的表格增加
</docs>

<docs lang="en-US">
Table with grouped child columns
</docs>

<script setup lang="ts">
import type { Key, ProColumns } from '@antdv-next1/pro-components'
import { EditableProTable } from '@antdv-next1/pro-components'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

interface DataSourceType {
  id?: Key
  title?: string
  decs?: string
  state?: string
  created_at?: number
  update_at?: number
  children?: DataSourceType[]
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '优化首页加载速度',
    decs: '首页白屏时间超过 3s，需优化资源加载和首屏渲染',
    state: 'open',
    created_at: 1705286400000,
    update_at: 1705372800000,
    children: [
      {
        id: 6246912293,
        title: '拆分首屏关键资源',
        decs: '将非关键 JS/CSS 延迟加载',
        state: 'closed',
        created_at: 1705200000000,
        update_at: 1705286400000,
      },
    ],
  },
  {
    id: 624691229,
    title: '修复登录超时问题',
    decs: '用户反馈高峰期登录请求超时，需排查连接池配置',
    state: 'closed',
    created_at: 1705200000000,
    update_at: 1705286400000,
  },
]
function loopDataSourceFilter(data?: DataSourceType[], id?: Key): DataSourceType[] {
  return (data || [])
    .map((item) => {
      if (item.id !== id) {
        if (item.children) {
          const newChildren = loopDataSourceFilter(item.children, id)
          return {
            ...item,
            children: newChildren.length > 0 ? newChildren : undefined,
          }
        }
        return item
      }
      return null
    })
    .filter(Boolean) as DataSourceType[]
}
const editableKeys = shallowRef<Key[]>([])
const dataSource = shallowRef<DataSourceType[] | undefined>(
  defaultData,
)

function removeRow(record: DataSourceType) {
  dataSource.value = loopDataSourceFilter(dataSource.value, record.id)
}

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
    formItemProps: (_, { rowIndex }) => {
      return {
        rules:
            rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
      }
    },
    width: '30%',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'decs',
    fieldProps: (form, { rowKey, rowIndex }) => {
      if (form?.getFieldValue([rowKey || '', 'title']) === '不好玩') {
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
    title: '活动时间',
    dataIndex: 'created_at',
    valueType: 'date',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (_, record) => [
      h('a', { key: 'delete', onClick: () => removeRow(record) }, '删除'),
    ],
  },
]
let editableRowIdCounter = 1000000
function createEditableRowId(): string {
  editableRowIdCounter += 1
  return String(editableRowIdCounter)
}
</script>

<template>
  <div class="p-6">
    <EditableProTable
      :expandable="{
        // 使用 request 请求数据时无效
        defaultExpandAllRows: true,
      }"
      :scroll="{
        x: 960,
      }"
      row-key="id"
      header-title="可编辑表格"
      :max-length="5"
      :record-creator-props="{
        position: 'bottom',
        newRecordType: 'dataSource',
        parentKey: () => 624748504,
        record: () => ({ id: createEditableRowId() }),
      }"
      :columns="columns"
      :value="dataSource"
      :editable="{
        type: 'multiple',
        editableKeys,
        onSave: async () => {
          await waitTime(2000);
        },
        onChange: (keys) => { editableKeys = keys },
      }"
      @change="(data) => {
        dataSource = data;
      }"
    />
  </div>
</template>

<style scoped></style>
