<docs lang="zh-CN">
自定义渲染的控件数量
</docs>

<docs lang="en-US">
The number of custom-rendered controls
</docs>

<script lang="ts" setup>
import { ProFormDatePicker, ProFormText, ProQueryFilter } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProQueryFilter default-collapsed split :default-form-items-number="5">
      <ProFormText name="name" label="应用名称" />
      <ProFormDatePicker name="createDate" label="创建时间" />
      <ProFormText name="status" label="应用状态" />
      <ProFormDatePicker name="replyDate" label="响应日期" />
      <ProFormDatePicker name="startDate" label="创建时间" />
      <ProFormDatePicker name="endDate" label="结束时间" />
    </ProQueryFilter>
  </div>
</template>

<style scoped></style>
