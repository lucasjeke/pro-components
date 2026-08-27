<docs lang="zh-CN">
无 ToolBar 的表格
</docs>

<docs lang="en-US">
Forms without ToolBar
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProTable } from '@antdv-next1/pro-components'
import { DownOutlined } from '@antdv-next/icons'
import { Avatar, Dropdown, Popconfirm, Space } from 'antdv-next'

type RoleType = 'admin' | 'operator'

type RoleMapType = Record<
  string,
  {
    name: string
    desc: string
  }
>

interface Member {
  avatar: string
  realName: string
  nickName: string
  email: string
  outUserNo: string
  phone: string
  role: RoleType
  permission?: string[]
}

const RoleMap: RoleMapType = {
  admin: {
    name: '管理员',
    desc: '仅拥有指定项目的权限',
  },
  operator: {
    name: '操作员',
    desc: '拥有所有权限',
  },
}

const tableListDataSource: Member[] = []

const realNames = ['马巴巴', '测试', '测试2', '测试3']
const nickNames = ['巴巴', '测试', '测试2', '测试3']
const emails = [
  'baba@antfin.com',
  'test@antfin.com',
  'test2@antfin.com',
  'test3@antfin.com',
]
const phones = ['12345678910', '10923456789', '109654446789', '109223346789']
const permissions = [[], ['权限点名称1', '权限点名称4'], ['权限点名称1'], []]

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    outUserNo: `${102047 + i}`,
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
    role: i === 0 ? 'admin' : 'operator',
    realName: realNames[i % 4]!,
    nickName: nickNames[i % 4]!,
    email: emails[i % 4]!,
    phone: phones[i % 4]!,
    permission: permissions[i % 4],
  })
}
const renderRemoveUser = (text: string) => h(Popconfirm, { key: 'popconfirm', title: `确认${text}吗?`, okText: '是', cancelText: '否' }, () => h('a', {}, text))
const columns: ProColumns<Member>[] = [
  {
    dataIndex: 'avatar',
    title: '成员名称',
    valueType: 'avatar',
    width: 150,
    render: (dom, record) => h(
      Space,
      null,
      () => [
        h('span', {}, dom as VNode),
        record.nickName,
      ],
    ),
  },
  {
    dataIndex: 'email',
    title: '账号',
    ellipsis: true,
    copyable: true,
    renderText: (_dom, row) => {
      return h(Space, {}, () => [
        h(Avatar, { src: row.avatar }),
        row.nickName,
      ])
    },
  },
  {
    dataIndex: 'role',
    title: '角色',
    render: (_, record) => h(Dropdown, {
      menu: {
        items: [
          {
            label: '管理员',
            key: 'admin',
          },
          {
            label: '操作员',
            key: 'operator',
          },
        ],
      },
    }, () => h('a', {}, [
      RoleMap[record.role || 'admin']?.name,
      h(DownOutlined),
    ])),
  },
  {
    dataIndex: 'permission',
    title: '权限范围',
    render: (_, record) => {
      const { role, permission = [] } = record
      if (role === 'admin') {
        return '所有权限'
      }
      return permission && permission.length > 0
        ? permission.join('、')
        : '无'
    },
  },
  {
    title: '操作',
    dataIndex: 'x',
    valueType: 'option',
    render: (_, record) => {
      let node = renderRemoveUser('退出')
      if (record.role === 'admin') {
        node = renderRemoveUser('移除')
      }
      return [h('a', { key: 'edit' }, '编辑'), node]
    },
  },
]
function request() {
  // 表单搜索项会从 params 传入，传递给后端接口。
  return Promise.resolve({
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  })
}
</script>

<template>
  <div class="p-6">
    <ProTable
      :columns="columns"
      :request="request"
      row-key="outUserNo"
      :pagination="{
        showQuickJumper: true,
      }"
      :tool-bar-render="false"
      :search="false"
    />
  </div>
</template>

<style  scoped>
</style>
