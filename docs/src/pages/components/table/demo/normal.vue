<docs lang="zh-CN">
无查询表单
</docs>

<docs lang="en-US">
Downgrade to a normal table
</docs>

<script setup lang="ts">
import type { ProColumns } from '@antdv-next1/pro-components'
import { ProTable, TableDropdown } from '@antdv-next1/pro-components'
import { DownOutlined } from '@antdv-next/icons'
import { Button } from 'antdv-next'
import dayjs from 'dayjs'
import { h } from 'vue'

interface TableListItem {
  key: number
  name: string
  containers: number
  creator: string
  status: string
  createdAt: number
  memo: string
}
const DEMO_STATUS_VALUE_ENUM = {
  all: { text: '全部', status: 'Default' },
  close: { text: '已关闭', status: 'Default' },
  running: { text: '运行中', status: 'Processing' },
  online: { text: '已上线', status: 'Success' },
  error: { text: '异常', status: 'Error' },
} as const
const DEMO_CREATOR_VALUE_ENUM = {
  all: { text: '全部' },
  书琰: { text: '书琰' },
  逄一: { text: '逄一' },
  期贤: { text: '期贤' },
  玄霜: { text: '玄霜' },
  怀渊: { text: '怀渊' },
} as const

interface BasicTableItem {
  key: number
  name: string
  containers: number
  creator: string
  status: string
  createdAt: number
  memo: string
}
const DEMO_CREATORS = ['书琰', '逄一', '期贤', '玄霜', '怀渊'] as const
interface BatchOptionTableItem extends BasicTableItem {
  progress?: number
  callNumber?: number
  money?: number
}
interface CreateTableDataSourceOptions {
  count?: number
  withProgress?: boolean
  withCallNumber?: boolean
  withMoney?: boolean
  namePrefix?: string
}
const DEMO_VALUE_ENUM = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
} as const
const FIXED_BASE_TIMESTAMP = dayjs('2024-01-15 10:00:00').valueOf()
function createTableDataSource(
  options: CreateTableDataSourceOptions = {},
): BasicTableItem[] | BatchOptionTableItem[] {
  const {
    count = 5,
    withProgress = false,
    withCallNumber = false,
    withMoney = false,
    namePrefix,
  } = options

  const result: BasicTableItem[] = []
  const statusKeys = ['0', '1', '2', '3'] as const
  const DEMO_APP_NAMES = [
    '用户认证服务',
    '订单处理中心',
    '支付网关',
    '商品管理服务',
    '物流追踪系统',
    '消息推送平台',
    '数据分析引擎',
    '文件存储服务',
    '搜索检索服务',
    '风控决策引擎',
    '库存管理服务',
    '会员积分系统',
    '优惠券服务',
    '评价审核系统',
    '客服工单平台',
    '短信通知网关',
    '日志采集服务',
    '配置中心',
    '注册发现服务',
    'API 网关',
  ] as const
  const DEMO_MEMOS = [
    '核心服务，承载全站用户登录与鉴权',
    '日均处理订单量 50 万+，高峰期需要关注性能',
    '对接微信、支付宝等第三方支付渠道',
    '负责全品类商品的增删改查及上下架管理',
    '接入顺丰、中通等多家物流运力',
    '支持 App 推送、短信和站内信三种通道',
    '基于 Flink 实时计算，日处理数据 10TB+',
    '使用 MinIO 对象存储，总容量 200TB',
    '基于 Elasticsearch，支持全文检索和聚合分析',
    '毫秒级风险识别，拦截欺诈交易',
    '多仓库库存同步，支持预售和预扣',
    'V1~V6 六级会员体系，积分自动结算',
    '支持满减、折扣、兑换券等多种类型',
    '自然语言处理 + 人工审核双重保障',
    '工单自动分配，平均响应时间 < 5min',
    '日发送量百万级，多供应商自动切换',
    '统一采集应用日志，支持 ELK 全链路追踪',
    '动态配置管理，支持灰度发布和热更新',
    'Nacos 集群部署，服务实例自动注册与发现',
    '流量网关，统一鉴权、限流与路由',
  ] as const

  for (let i = 0; i < count; i += 1) {
    const appName = namePrefix
      ? count > 1
        ? `${namePrefix}-${i}`
        : namePrefix
      : DEMO_APP_NAMES[i % DEMO_APP_NAMES.length]

    const baseItem: BasicTableItem = {
      key: i,
      name: appName!,
      containers: ((i * 3 + 2) % 12) + 1,
      creator: DEMO_CREATORS[i % DEMO_CREATORS.length]!,
      status: DEMO_VALUE_ENUM[statusKeys[i % 4]!],
      createdAt: FIXED_BASE_TIMESTAMP - i * 86400000,
      memo: DEMO_MEMOS[i % DEMO_MEMOS.length]!,
    }

    if (withProgress || withCallNumber || withMoney) {
      const extendedItem = { ...baseItem } as BatchOptionTableItem & {
        money?: number
      }
      if (withProgress) {
        extendedItem.progress = ((i * 17 + 23) % 100) + 1
      }
      if (withCallNumber) {
        extendedItem.callNumber = (i * 1234 + 5678) % 100000
      }
      if (withMoney) {
        extendedItem.money = ((i * 3456 + 7890) % 50000) * 100
      }
      result.push(extendedItem)
    }
    else {
      result.push(baseItem)
    }
  }

  return result
}
const tableListDataSource = createTableDataSource({
  count: 5,
}) as TableListItem[]
const columns: ProColumns<TableListItem>[] = [
  {
    title: '应用名称',
    dataIndex: 'name',
    render: dom => h('a', {}, dom as VNode),
  },
  {
    title: '容器数量',
    dataIndex: 'containers',
    align: 'right',
    sorter: (a, b) => a.containers - b.containers,
  },
  {
    title: '状态',
    dataIndex: 'status',
    initialValue: 'all',
    valueEnum: DEMO_STATUS_VALUE_ENUM,
  },
  {
    title: '负责人',
    dataIndex: 'creator',
    valueEnum: DEMO_CREATOR_VALUE_ENUM,
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: () => [
      h('a', { key: 'detail' }, '详情'),
      h('a', { key: 'log' }, '日志'),
      h('a', { key: 'monitor' }, '监控'),
      h(TableDropdown, { key: 'actionGroup', menus: [{ key: 'restart', name: '重启' }, { key: 'delete', name: '下线' }] }),
    ],
  },
]
</script>

<template>
  <div class="p-6">
    <ProTable
      :data-source="tableListDataSource"
      row-key="key"
      :pagination="{
        showQuickJumper: true,
      }"
      :columns="columns"
      :search="false"
      date-formatter="string"
      header-title="微服务应用列表"
      :tool-bar-render="() => [
        h(Button, { key: 'log' }, () => '查看日志'),
        h(Button, { key: 'export' }, () => [
          '导出数据',
          h(DownOutlined),
        ]),
        h(Button, {
          type: 'primary',
          key: 'primary',
        }, () => '部署应用'),
      ]"
    />
  </div>
</template>

<style  scoped>
</style>
