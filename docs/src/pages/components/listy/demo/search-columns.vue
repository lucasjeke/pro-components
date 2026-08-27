<docs lang="zh-CN">
搜索列表（columns + request）
</docs>

<docs lang="en-US">
Search list (columns + request)
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Button, Divider, Space, Tag } from 'antdv-next'
import { h } from 'vue'

interface GithubIssueItem {
  url: string
  id: number
  number: number
  user: string
  avatar: string
  title: string
  labels: {
    name: string
    color: string
  }[]
  state: string
  comments: number
  created_at: string
  updated_at: string
  closed_at?: string
}
interface JsonPlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '用户',
    dataIndex: 'user',
    listSlot: 'title',
  },
  {
    dataIndex: 'avatar',
    listSlot: 'avatar',
    search: false,
  },
  {
    dataIndex: 'title',
    listSlot: 'description',
    search: false,
  },
  {
    dataIndex: 'labels',
    listSlot: 'subTitle',
    search: false,
    render: (_, row) => h(Space, { size: 8 }, () => row.labels?.map((label: { name: string }) => h(Tag, { color: 'blue', key: label.name }, () => label.name))),
  },
  {
    listSlot: 'actions',
    search: false,
    render: (_, row) => h(Space, {
      align: 'center',
      size: 0,
      separator: h(Divider, { orientation: 'vertical' }),
    }, () => [
      h('a', { key: 'link', href: row.url, target: '_blank', rel: 'noopener noreferrer' }, '链路'),
      h('a', { key: 'view', href: row.url, target: '_blank', rel: 'noopener noreferrer' }, '查看'),
    ]),
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: { text: '未解决', status: 'Error' },
      closed: { text: '已解决', status: 'Success' },
    },
  },
]

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
    user: `user-${post.userId}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${post.userId}`,
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
</script>

<template>
  <div class="p-6">
    <ProListy
      row-key="id"
      :tool-bar-render="() => [h(Button, { key: 'add', type: 'primary' }, () => '新建')]"
      header-title="搜索列表（columns API）"
      :pagination="{ pageSize: 5 }"
      :search="{ filterType: 'light' }"
      :columns="columns"
      :request="async (params) => {
        await waitTime(600);
        return getGithubIssueData(params);
      }"
    />
  </div>
</template>

<style scoped></style>
