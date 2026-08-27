<docs lang="zh-CN">
使用 request 获取数据源
</docs>

<docs lang="en-US">
use request to retrieve data
</docs>

<script setup lang="ts">
import type { ProTableInstance } from '@antdv-next1/pro-components'
import { DragSortProTable } from '@antdv-next1/pro-components'
import { message } from 'antdv-next'

const dragSortTableRef = useTemplateRef<ProTableInstance<Record<string, any>>>('dragSortTable')
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
  key: '1',
  name: '[remote data] 1 - John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: '[remote data] 2 - Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: '[remote data] 3 - Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}]

const dataSource = shallowRef<Record<string, any>[] | undefined>(data)

const [messageApi, ContextHolder] = message.useMessage()
async function wait(delay = 1000) {
  return new Promise(resolve => setTimeout(() => resolve(void 0), delay))
}
function handleDragSortEnd(beforeIndex?: number | string, afterIndex?: number | string, newDataSource?: any) {
  console.log('排序后的数据', beforeIndex, afterIndex, dataSource, newDataSource)
  dataSource.value = newDataSource
  if (dragSortTableRef.value) {
    dragSortTableRef.value.reload?.()
  }
  messageApi.success('修改列表排序成功')
}
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <DragSortProTable
      ref="dragSortTable"
      header-title="使用 request 获取数据源"
      :columns="columns"
      row-key="key"
      :search="false"
      :pagination="false"
      :request="async () => {
        await wait(3000);
        return {
          data: dataSource,
          total: dataSource?.length,
          success: true,
        };
      }"
      drag-sort-key="sort"
      @drag-sort-end="handleDragSortEnd"
    />
  </div>
</template>

<style  scoped>
</style>
