<docs lang="zh-CN">
通过请求接口数据来展示定义列表
</docs>

<docs lang="en-US">
Display the definition list by requesting interface data
</docs>

<script setup lang="ts">
import type { ProDescriptionsInstance, ProDescriptionsItemProps } from '@antdv-next1/pro-components'
import { ProDescriptions } from '@antdv-next1/pro-components'
import { Button } from 'antdv-next'
import { h } from 'vue'

const descriptionsRef = useTemplateRef<ProDescriptionsInstance<Record<string, any>>>('descriptions')
async function request() {
  return Promise.resolve({
    success: true,
    data: { id: '这是一段文本', date: '20200730', money: '12121' },
  })
}
const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [
  { dataIndex: 'id' },
  { dataIndex: 'date', label: '日期', valueType: 'date' },
  { label: 'money', dataIndex: 'money', valueType: 'money' },
  {
    label: '文本',
    valueType: 'option',
    render: () => [
      h(Button, {
        type: 'primary',
        key: 'reload',
        onClick: () => {
          descriptionsRef.value?.reload?.()
        },
      }, () => '刷新'),
      h(Button, {
        key: 'rest',
      }, () => '重置'),
    ],
  },
]
</script>

<template>
  <div class="p-6">
    <ProDescriptions
      ref="descriptions"
      title="高级定义列表 request"
      :request="request"
      :extra="h(Button, { type: 'link' }, () => '修改')"
      :columns="columns"
    />
  </div>
</template>

<style  scoped>
</style>
