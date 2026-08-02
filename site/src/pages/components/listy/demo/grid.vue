<docs lang="zh-CN">
 网格配置
</docs>

<docs lang="en-US">
  grid config
</docs>

<script setup lang="ts">
import type { ListyRef } from '@antdv-next1/pro-components'
import type { CSSProperties } from 'vue'
import { Listy } from '@antdv-next1/pro-components'
import { h, useTemplateRef } from 'vue'

const listy = useTemplateRef<ListyRef>('listyRef')
const dataSource = Array.from({ length: 200 }, (_, index) => {
  const groupItemsCount = 20
  const groupIndex = Math.floor(index / groupItemsCount)
  return {
    id: index,
    name: `${index} (group ${groupIndex})`,
    type: `Group ${groupIndex * groupItemsCount}`,
  }
})
const itemStyle: CSSProperties = {
  padding: '0 12px',
  height: 32,
  lineHeight: '32px',
  borderBottom: '1px solid rgb(79, 53, 53)',
}
</script>

<template>
  <div class="flex flex-col gap-3 ">
    <Listy
      ref="listyRef"
      :height="320"
      :item-height="32"
      :items="dataSource"
      :item-render="(item, index) => h('div', { style: { ...itemStyle, height: `${30 + (index % 2 ? -3 : 10)}px` } }, item.name)"
      row-key="id"
      sticky
      virtual
      :group="{
        key: (item) => item.type,
        title: ({ name, items }) => h('div', {
          style: {
            fontWeight: 600,
            padding: '0 12px',
            height: '32px',
            lineHeight: '32px',
            borderBottom: '1px solid #f5f5f5',
            backgroundColor: 'gray',
          },
        }, `${name}------${items.length}`),
      }"
    />
    <a-button
      type="primary"
      @click="() => {
        listy?.scrollTo({
          key: 100,
          align: 'top',
        })
      }"
    >
      Scroll To 100
    </a-button>
    <a-button
      type="primary"
      @click="() => {
        listy?.scrollTo({
          groupKey: 'Group 120',
          align: 'top',
        })
      }"
    >
      Scroll To Group 120
    </a-button>
  </div>
</template>

<style scoped></style>
