<docs lang="zh-CN">
实时保存的编辑表格
</docs>

<docs lang="en-US">
Real-time persisted editing
</docs>

<script setup lang="ts">
import type { Key, ProColumns } from '@antdv-next1/pro-components'
import { EditableProTable } from '@antdv-next1/pro-components'
import { Button } from 'antdv-next'
import { h } from 'vue'

interface DataSourceType {
  id: Key
  title?: string
  description?: string
  status?: string
  created_at?: number
  children?: DataSourceType[]
}

const taskNames = [
  '优化首页加载速度',
  '修复登录超时问题',
  '新增数据导出功能',
  '重构权限管理模块',
  '接入第三方支付 SDK',
  '升级 React 18',
  '优化搜索算法',
  '增加单元测试覆盖',
  '实现深色模式',
  '接入埋点 SDK',
  '优化图片懒加载',
  '重构表格组件',
  '添加国际化支持',
  '修复移动端适配',
  '集成 CI/CD 流程',
  '优化打包体积',
  '实现 WebSocket 通信',
  '添加操作审计日志',
  '优化缓存策略',
  '重构路由模块',
]

const taskDescs = [
  '首页白屏时间超过 3s',
  '高峰期登录请求超时',
  '导出 Excel 和 CSV',
  '细粒度权限控制',
  '对接微信和支付宝',
  '升级到最新 LTS 版本',
  'ES 查询响应慢',
  '核心模块覆盖率 > 90%',
  '支持系统主题切换',
  '用户行为数据采集',
  '减少首屏图片请求',
  '提升大数据量渲染性能',
  '支持中英日三语',
  'iOS Safari 布局异常',
  '自动化构建和部署',
  '减少 vendor chunk 体积',
  '实时消息推送',
  '记录关键操作日志',
  '减少 API 冗余请求',
  '支持嵌套路由和权限路由',
]

const defaultData: DataSourceType[] = taskNames.map((name, index) => ({
  id: (1705286400000 + index).toString(),
  title: name,
  description: taskDescs[index],
  status: index % 3 === 0 ? 'open' : index % 3 === 1 ? 'processing' : 'closed',
  created_at: 1705286400000 - index * 86400000,
}))
const editableKeys = shallowRef<Key[]>(
  defaultData.map(item => item.id),
)
const dataSource = shallowRef<DataSourceType[] | undefined>(defaultData)

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
    width: '30%',
    formItemProps: {
      rules: [
        {
          required: true,
          whitespace: true,
          message: '此项是必填项',
        },
        {
          max: 30,
          whitespace: true,
          message: '最长为 30 位',
        },
        {
          min: 4,
          whitespace: true,
          message: '最小为 4 位',
        },
      ],
    },
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '待处理',
        status: 'Error',
      },
      processing: {
        text: '进行中',
        status: 'Processing',
      },
      closed: {
        text: '已完成',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 250,
    render: () => {
      return null
    },
  },
]
</script>

<template>
  <div class="p-6">
    <EditableProTable
      header-title="实时编辑任务列表"
      :columns="columns"
      row-key="id"
      :scroll="{
        x: 960,
      }"
      :value="dataSource"
      :record-creator-props="{
        newRecordType: 'dataSource',
        record: () => ({
          id: Date.now(),
        }),
      }"
      :tool-bar-render="() => [
        h(Button, {
          type: 'primary',
          key: 'save',
          onClick: () => {
            console.log(dataSource);
          },
        }, () => ' 保存数据'),
      ]"
      :editable="{
        type: 'multiple',
        editableKeys,
        actionRender: (_, _1, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (_, recordList) => {
          dataSource = recordList;
        },
        onChange: (keys) => editableKeys = keys,
      }"
      @change="(data) => {
        dataSource = data
      }"
    />
  </div>
</template>

<style scoped></style>
