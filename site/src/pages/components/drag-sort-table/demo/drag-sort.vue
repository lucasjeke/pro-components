<docs lang="zh-CN">
拖拽排序(默认把手)
</docs>

<docs lang="en-US">
darg sort (default handler)
</docs>

<script lang="ts" setup>
import type { ProColumns } from '@antdv-next1/pro-components'
import { DragSortTable } from '@antdv-next1/pro-components'
import { message } from 'antdv-next'
import { ref } from 'vue'

const columns: ProColumns[] = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 60,
    className: 'drag-visible',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    className: 'drag-visible',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
]
const dataSource = ref(data)
const [messageApi, ContextHolder] = message.useMessage()
function handleDragSortEnd(beforeIndex?: number | string, afterIndex?: number | string, newDataSource?: any) {
  console.log('排序后的数据', beforeIndex, afterIndex, dataSource, newDataSource)
  messageApi.success('修改列表排序成功')
}
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <DragSortTable
      header-title="拖拽排序(默认把手)"
      :columns="columns"
      row-key="key"
      :search="false"
      :pagination="false"
      :data-source="dataSource"
      drag-sort-key="sort"
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>

<style scoped></style>
