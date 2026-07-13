<docs lang="zh-CN">
  查询筛选
</docs>

<docs lang="en-US">
query filter
</docs>

<script lang="ts" setup>
import { ProFormDateTimePicker, ProFormText, ProQueryFilter } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProQueryFilter>
      <ProFormDateTimePicker
        label="下单时间"
        :col-props="{ xl: 12 }"
        name="orderTime"
        required
      />
      <ProFormText disabled :col-props="{ xl: 12 }" name="pay" label="支付方式" />
    </ProQueryFilter>
  </div>
</template>

<style scoped></style>
