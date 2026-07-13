<docs lang="zh-CN">
折叠模式下所有的选项都会默认折叠，不管是否有值，控件的 `secondary` 将不再有效。
</docs>

<docs lang="en-US">
折叠模式下所有的选项都会默认折叠，不管是否有值，控件的 `secondary` 将不再有效。
</docs>

<script lang="ts" setup>
import { ProFormDateTimePicker, ProFormSelect, ProLightFilter } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="m-b-4">
    <ProLightFilter
      :model="{
        sex: 'man',
      }"
      collapse
      @finish="async (values) => console.log(values)"
    >
      <ProFormSelect
        name="sex"
        label="性别"
        show-search
        :value-enum="{
          man: '男',
          woman: '女',
        }"
      />
      <ProFormDateTimePicker name="time" label="时间" />
    </ProLightFilter>
  </div>
</template>

<style scoped></style>
