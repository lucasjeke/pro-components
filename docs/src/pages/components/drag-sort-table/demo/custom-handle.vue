<docs lang="zh-CN">
拖拽排序(自定义把手)
</docs>

<docs lang="en-US">
Drag and Sort (Custom Handles)
</docs>

<script setup lang="ts">
import { DragSortProTable } from '@antdv-next1/pro-components'
import { MenuOutlined } from '@antdv-next/icons'
import { message, Space } from 'antdv-next'
import { h } from 'vue'

const columns = [{
  title: '排序',
  dataIndex: 'sort',
}, {
  title: '姓名',
  dataIndex: 'name',
  className: 'drag-visible',
}, {
  title: '年龄',
  dataIndex: 'age',
}, {
  title: '地址',
  dataIndex: 'address',
}]
const data = [{
  key: 'key1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: 'key2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: 'key3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}]
const dataSource = shallowRef<Record<string, any>[] | undefined>(data)

const [messageApi, ContextHolder] = message.useMessage()
function handleDragSortEnd(beforeIndex?: number | string, afterIndex?: number | string, newDataSource?: any) {
  console.log('排序后的数据', beforeIndex, afterIndex, dataSource, newDataSource)
  messageApi.success('修改列表排序成功')
}
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <DragSortProTable
      header-title="拖拽排序(自定义把手)"
      :columns="columns"
      row-key="key"
      :search="false"
      :pagination="false"
      :data-source="dataSource"
      drag-sort-key="sort"
      :drag-sort-handler-render="(rowData, idx) => h(Space, {}, () => [
        h(MenuOutlined, { style: { cursor: 'grab', color: 'gold' } }),
        `${(idx + 1)} - ${rowData.name}`,
      ])"
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>

<style  scoped>
</style>
