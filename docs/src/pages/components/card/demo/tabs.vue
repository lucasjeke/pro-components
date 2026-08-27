<docs lang="zh-CN">
通过 `tabList` 配置标签列表，使用 `v-model:active-tab-key` 管理当前页签，并可通过 `tabProps` 调整页签位置。
</docs>

<docs lang="en-US">
Configure tabs with `tabList`, control the active tab with `v-model:active-tab-key`, and use `tabProps` to change the placement.
</docs>

<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { ProCard } from '@antdv-next1/pro-components'

const tab = shallowRef('tab2')
const tabPlacement = shallowRef<TabsProps['tabPlacement']>('top')

const contentListNoTitle = {
  tab1: 'Content One',
  tab2: 'Content Two',
  tab3: 'Content Three',
} as const
const content = computed(() => contentListNoTitle[tab.value as keyof typeof contentListNoTitle])
</script>

<template>
  <div class="p-6">
    <a-space :style="{ marginBlockEnd: '16px' }">
      Tab placement：
      <a-select
        v-model:value="tabPlacement"
        :options="[{
          label: 'top',
          value: 'top',
        }, {
          label: 'bottom',
          value: 'bottom',
        }, {
          label: 'start',
          value: 'start',
        }, {
          label: 'end',
          value: 'end',
        }]"
      />
    </a-space>
    <ProCard
      v-model:active-tab-key="tab"
      :tab-list="[{
        label: `Product One`,
        key: 'tab1',
      }, {
        label: `Product Two`,
        key: 'tab2',
      }, {
        label: `Product Three`,
        key: 'tab3',
      }]"
      :tab-props="{
        tabPlacement,
      }"
    >
      {{ content }}
    </ProCard>
  </div>
</template>

<style scoped></style>
