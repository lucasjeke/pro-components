<docs lang="zh-CN">
 带工具栏的列表
</docs>

<docs lang="en-US">
 List with toolbar
</docs>

<script setup lang="ts">
import type { ActionType, Key } from '@antdv-next1/pro-components'
import { ProListy } from '@antdv-next1/pro-components'
import { Badge, Button, Divider, Space, theme } from 'antdv-next'
import { h } from 'vue'

const dataSource = [
  {
    name: '实验名称1',
    desc: '系统性的沉淀B端知识体系',
    content: [
      {
        label: '模型数',
        value: 2903,
      },
      {
        label: '指标数',
        value: 3720,
      },
      {
        label: '实验状态',
        value: '成功',
        status: 'success',
      },
    ],
  },
  {
    name: '实验名称2',
    desc: '系统性的沉淀B端知识体系',
    content: [
      {
        label: '模型数',
        value: 2904,
      },
      {
        label: '指标数',
        value: 3721,
      },
      {
        label: '实验状态',
        value: '成功',
        status: 'success',
      },
    ],
  },
  {
    name: '实验名称3',
    desc: '系统性的沉淀B端知识体系',
    content: [
      {
        label: '模型数',
        value: 2905,
      },
      {
        label: '指标数',
        value: 3722,
      },
      {
        label: '实验状态',
        value: '成功',
        status: 'success',
      },
    ],
  },
]
const activeKey = shallowRef<Key | undefined>('tab1')
const action = shallowRef<ActionType<Record<string, any>, any>>()
const { token } = theme.useToken()
function renderBadge(count: number, active = false) {
  return h(Badge, { count, style: {
    marginBlockStart: -2,
    marginInlineStart: 4,
    color: active ? token.value.colorPrimaryText : token.value.colorTextTertiary,
    backgroundColor: active ? token.value.colorPrimaryBg : token.value.colorFillTertiary,
  } })
}
</script>

<template>
  <div class="p-6">
    <ProListy
      row-key="name"
      :data-source="dataSource"
      :editable="{}"
      :columns="[
        {
          dataIndex: 'name',
          listSlot: 'title',
          valueType: 'select',
          fieldProps: {
            showSearch: true,
            placement: 'bottomRight',
            options: [{ label: '实验名称1', value: '实验名称1' }],
          },
        },
        { dataIndex: 'desc', listSlot: 'description' },
        {
          dataIndex: 'content',
          listSlot: 'content',
          render: (text) => h('div', {
            key: 'label',
            style: {
              display: 'flex',
              justifyContent: 'space-around',
            },
          }, (text as any[]).map((t) => h('div', {
            key: t.label,
          }, [
            h('div', null, t.label),
            h('div', null, [
              t.status === 'success' && h('span', {
                style: {
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#52c41a',
                  marginInlineEnd: '8px',
                },
              }),
              t.value,
            ]),
          ]))),
        },
        {
          listSlot: 'actions',
          render: (_, row) =>
            h(Space, {
              align: 'center',
              size: 0,
              separator: h(Divider, { orientation: 'vertical' }),
            }, () => [
              h('a', { key: 'edit', onClick: () => action?.startEditable?.(row.name) }, '编辑'),
              h('a', { key: 'copy' }, '复制'),
              h('a', { key: 'delete' }, '删除'),
            ]),
        },
      ]"
      :toolbar="{
        menu: {
          activeKey,
          items: [
            {
              key: 'tab1',
              label: h('span', null, h(Space, null, () => [
                '全部实验室',
                renderBadge(99, activeKey === 'tab1'),
              ])),
            },
            {
              key: 'tab2',
              label: h('span', null, h(Space, null, () => [
                '我创建的实验室',
                renderBadge(32, activeKey === 'tab2'),
              ])),
            },
          ],
          onChange: (key) => activeKey = key,
        },
        search: {
          onSearch: (value: string) => {
            console.log(value);
          },
        },
        actions: [
          h(Button, { type: 'primary', key: 'primary' }, () => '新建实验'),
        ],
      }"
    />
  </div>
</template>

<style scoped></style>
