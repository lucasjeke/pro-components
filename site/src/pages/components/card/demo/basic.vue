<docs lang="zh-CN">
当单独使用时 `ProCard` 就是一个普通的卡片
</docs>

<docs lang="en-US">
当单独使用时 `ProCard` 就是一个普通的卡片
</docs>

<script setup lang="ts">
import { ProCard, ProFormGroup, ProFormSwitch } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard
      title="用户认证服务"
      variant="outlined"
      tooltip="管理用户认证与授权的核心服务"
      style="max-width: 300px"
      :border-beam="{
        color: [
          { color: '#1677ff', percent: 0 },
          { color: '#36cfc9', percent: 52 },
          { color: '#95de64', percent: 100 },
        ],
      }"
    >
      <template #extra>
        <ProFormGroup>
          <ProFormSwitch
            name="Enable"
            no-style
            checked-children="运行中"
            un-checked-children="已停止"
          />
        </ProFormGroup>
      </template>
      <div>实例数量：3</div>
      <div>CPU 占用：45%</div>
      <div>内存占用：1.2 GB</div>
    </ProCard>
    <ProCard
      title="订单处理中心"
      extra="v2.3.1"
      tooltip="处理全站订单的创建、支付与履约"
      :style="{ maxWidth: '300px', marginBlockStart: '24px' }"
      box-shadow
      disabled
      :border-beam="{
        color: [
          { color: '#ff7a45', percent: 0 },
          { color: '#ff4d4f', percent: 49 },
          { color: '#ff85c0', percent: 100 },
        ],
      }"
    >
      <div>日均订单：52 万</div>
      <div>平均延迟：23ms</div>
      <div>成功率：99.97%</div>
    </ProCard>
    <ProCard
      title="支付网关"
      extra="v1.8.0"
      tooltip="对接第三方支付渠道的统一网关"
      :style="{ maxWidth: '300px', marginBlockStart: '24px' }"
      size="small"
    >
      <div>微信支付：已接入</div>
      <div>支付宝：已接入</div>
      <div>银联：接入中</div>
    </ProCard>
  </div>
</template>

<style scoped></style>
