<docs lang="zh-CN">
通过 Segmented 分段选择器切换 `itemLayout`、`variant`、`split` 属性。
</docs>

<docs lang="en-US">
Switch the `itemLayout`, `variant`, and `split` properties using the Segmented selector.
</docs>

<script setup lang="ts">
import { ProListy } from '@antdv-next1/pro-components'
import { Button, Divider, Progress, Segmented, Space, Tag } from 'antdv-next'
import { h, ref } from 'vue'

interface ProjectItem {
  title: string
  avatar: string
  description: string
  progress: number
  status: string
}

const dataSource: ProjectItem[] = [
  {
    title: '智慧零售平台',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '面向线下门店的数字化经营解决方案',
    progress: 85,
    status: '开发中',
  },
  {
    title: 'Ant Design Pro',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '开箱即用的中台前端解决方案',
    progress: 100,
    status: '已上线',
  },
  {
    title: '云原生微服务框架',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '基于 K8s 的微服务开发与治理框架',
    progress: 92,
    status: '测试中',
  },
  {
    title: '数据可视化引擎',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    description: '企业级数据看板与图表分析工具',
    progress: 60,
    status: '开发中',
  },
]
const variant = ref<'outlined' | 'borderless' | 'filled'>('borderless')
const itemLayout = ref<'horizontal' | 'vertical'>('horizontal')
const split = ref(true)
const virtual = ref(false)
</script>

<template>
  <div class="p-6">
    <a-card>
      <a-flex vertical gap="medium">
        <Space>
          <span>itemLayout 列表项方向：</span>
          <Segmented
            v-model:value="itemLayout"
            :options="[
              { label: '水平 horizontal', value: 'horizontal' },
              { label: '垂直 vertical', value: 'vertical' },
            ]"
          />
        </Space>
        <Space>
          <span>variant 外观变体：</span>
          <Segmented
            v-model:value="variant"
            :options="[
              { label: '线框 outlined', value: 'outlined' },
              { label: '填充 filled', value: 'filled' },
              { label: '无边框 borderless', value: 'borderless' },
            ]"
          />
        </Space>
        <Space>
          <span>split 分割线：</span>
          <Segmented
            :value="split ? 'true' : 'false'"
            :options="[
              { label: '有分割线', value: 'true' },
              { label: '无分割线', value: 'false' },
            ]"
            @change="(v) => split = v === 'true'"
          />
        </Space>
        <Space>
          <span>virtual 虚拟滚动：</span>
          <Segmented
            :value="virtual ? 'true' : 'false'"
            :options="[
              { label: '开启', value: 'true' },
              { label: '关闭', value: 'false' },
            ]"
            @change="(v) => virtual = v === 'true'"
          />
        </Space>
      </a-flex>
    </a-card>
    <ProListy
      header-title="项目列表枚举切换"
      :item-layout="itemLayout"
      :split="split"
      :virtual="virtual"
      :variant="variant"
      :columns="[
        { dataIndex: 'title', listSlot: 'title' },
        { dataIndex: 'avatar', listSlot: 'avatar' },
        { dataIndex: 'description', listSlot: 'description' },
        {
          listSlot: 'content',
          render: (_, record) => h('div', {
          }, [
            h(Space, {}, () => [
              record.status,
              h(Tag, {
                color: record.progress === 100 ? 'success' : 'processing',
              }, () => `${record.progress}%`),
            ]),
            h(Progress, {
              percent: record.progress,
              showInfo: false,
            }),
          ]),
        },
        {
          listSlot: 'actions',
          render: () => h(Space, {
            align: 'center',
            size: 0,
            separator: h(Divider, { orientation: 'vertical' }),
          }, () => [
            h('a', { key: 'view' }, '查看'),
            h('a', { key: 'edit' }, '编辑'),
            h('a', { key: 'archive' }, '归档'),
          ]),
        },
      ]"
      :data-source="dataSource"
      :row-key="(item) => item.title"
      :tool-bar-render="() => [
        h(Button, { key: 'new', type: 'primary' }, () => '新建项目'),
      ]"
    />
  </div>
</template>

<style scoped></style>
