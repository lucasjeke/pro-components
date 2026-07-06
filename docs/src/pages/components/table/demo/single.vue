<docs lang="zh-CN">
查询表格。
</docs>

<docs lang="en-US">
Query Table
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-table'
import { ProTable, TableDropdown } from '@antdv-next1/pro-table'
import { EllipsisOutlined, PlusOutlined } from '@antdv-next/icons'
import { Button, Dropdown, Space, Tag } from 'antdv-next'
import request from 'umi-request'
import { h } from 'vue'

async function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

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

const columns: ProColumns<GithubIssueItem>[] = [
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
]
</script>

<template>
  <div class="p-6">
    <ProTable
      :columns="columns"
      card-bordered
      :request="async (params, sort, filter) => {
        console.log(params, sort, filter);
        await waitTime(2000);
        return request<{
          data: GithubIssueItem[];
          }>('https://proapi.azurewebsites.net/github/issues', {
            params,
          });
      }"
      :expandable="{
        defaultExpandAllRows: true,
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
          // actionRef.current?.reload();
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
