<docs lang="zh-CN">
查询表格。
</docs>

<docs lang="en-US">
Query Table
</docs>

<script setup lang="ts">
import type { ProColumns, ProTableInstance } from '@antdv-next1/pro-components'
import { ProTable, TableDropdown } from '@antdv-next1/pro-components'
import { EllipsisOutlined, PlusOutlined } from '@antdv-next/icons'
import { Button, Dropdown, Space, Tag } from 'antdv-next'
import { h, ref, useTemplateRef } from 'vue'

interface GithubIssueItem {
  url: string
  id: number
  number: number
  title: string
  labels: {
    name: string
    color: string
  }[]
  state: string
  comments: number
  created_at: string | string[]
  updated_at: string
  closed_at?: string
}

interface JsonPlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

const tableRef = useTemplateRef<ProTableInstance<GithubIssueItem>>('tableRef')
async function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const labelPalette = [
  { name: 'docs', color: 'blue' },
  { name: 'bug', color: 'red' },
  { name: 'feature', color: 'green' },
  { name: 'help wanted', color: 'purple' },
]

function getIssueState(id: number) {
  if (id % 5 === 0)
    return 'processing'
  return id % 3 === 0 ? 'closed' : 'open'
}

function getIssueCreatedAt(id: number) {
  const month = id % 12
  const day = (id % 27) + 1
  return new Date(Date.UTC(2024, month, day, 8, 30, 0)).toISOString()
}

function mapPostToIssue(post: JsonPlaceholderPost): GithubIssueItem {
  const state = getIssueState(post.id)
  const createdAt = getIssueCreatedAt(post.id)
  const label = labelPalette[post.id % labelPalette.length]!

  return {
    url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
    id: post.id,
    number: post.id,
    title: post.title,
    labels: [
      label,
      { name: `user-${post.userId}`, color: 'default' },
    ],
    state,
    comments: post.body.split('\n').length,
    created_at: createdAt,
    updated_at: createdAt,
    closed_at: state === 'closed' ? createdAt : undefined,
  }
}

async function getGithubIssueData(params: Record<string, any>) {
  const searchParams = new URLSearchParams({
    _page: String(params.current || 1),
    _limit: String(params.pageSize || 5),
  })

  if (params.title)
    searchParams.set('title_like', params.title)

  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${searchParams.toString()}`)
  const data = await response.json() as JsonPlaceholderPost[]

  return {
    data: data.map(mapPostToIssue),
    success: response.ok,
    total: Number(response.headers.get('X-Total-Count')) || data.length,
  }
}

const columns = ref<ProColumns<GithubIssueItem>[]>([
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tooltip: '标题过长会自动收缩',
    resizable: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
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
      processing: {
        text: '处理中',
        status: 'Processing',
      },
    },
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    resizable: true,
    formItemRender: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => h(Space, null, () => record.labels.map(({ name, color }) => h(Tag, {
      color,
      key: name,
    }, () => name))),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    search: false,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        if (Array.isArray(value)) {
          return {
            startTime: value[0],
            endTime: value[1],
          }
        }
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_1, record, _, action) => [
      h('a', {
        key: 'editable',
        onClick: () => {
          action?.startEditable?.(record.id)
        },
      }, '编辑'),
      h('a', {
        href: record.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        key: 'view',
      }, '查看'),
      h(TableDropdown, {
        key: 'actionGroup',
        onSelect: () => {
          action?.reload?.()
        },
        menus: [
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ],
      }),
    ],
  },
])
</script>

<template>
  <div class="p-6">
    <ProTable
      ref="tableRef"
      :columns="columns"
      card-bordered
      :request="async (params) => {
        await waitTime(600);
        return getGithubIssueData(params);
      }"
      :editable="{
        type: 'multiple',
      }"
      :columns-state="{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'end', disable: true },
        },
      }"
      row-key="id"
      :search="{
        labelWidth: 'auto',
      }"
      :options="{
        setting: {
          listsHeight: 400,
        },
      }"
      :form="{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }"
      :pagination="{
        pageSize: 5,
      }"
      date-formatter="string"
      header-title="Issue 管理"
      :tool-bar-render="() => [
        h(Button, {
          key: 'button',
          icon: h(PlusOutlined),
          type: 'primary',
          onClick: () => {
            tableRef?.reload?.();
          },
        }, () => '新建'),
        h(Dropdown, {
          key: 'menu',
          menu: {
            items: [
              { label: '导入数据', key: 'import' },
              { label: '导出数据', key: 'export' },
              { label: '批量分配', key: 'assign' },
            ],
          },
        }, () => h(Button, null, () => h(EllipsisOutlined))),
      ]"
    />
  </div>
</template>

<style scoped></style>
