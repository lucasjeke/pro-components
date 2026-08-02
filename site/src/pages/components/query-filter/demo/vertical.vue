<docs lang="zh-CN">
垂直布局
</docs>

<docs lang="en-US">
vertical layout
</docs>

<script lang="ts" setup>
import { ProFormCheckboxGroup, ProFormDatePicker, ProFormRadioGroup, ProFormText, ProQueryFilter } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProQueryFilter layout="vertical">
      <ProFormText name="name" label="这是一个超级超级长的名称" />
      <ProFormDatePicker name="birth" label="创建时间" />
      <ProFormText name="sex" label="应用状态" />
      <ProFormRadioGroup
        name="freq"
        label="查询频度"
        :options="[
          {
            value: 'weekly',
            label: '每周',
          },
          {
            value: 'quarterly',
            label: '每季度',
          },
          {
            value: 'monthly',
            label: '每月',
          },
          {
            value: 'yearly',
            label: '每年',
          },
        ]"
      />
      <ProFormCheckboxGroup
        name="checkbox"
        label="行业分布"
        :options="['农业', '制造业', '互联网']"
      />
    </ProQueryFilter>
  </div>
</template>

<style scoped></style>
