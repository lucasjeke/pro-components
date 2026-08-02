<docs lang="zh-CN">
通过配置 `disabled` 属性配置选项不可用。
</docs>

<docs lang="en-US">
通过配置 `disabled` 属性配置选项不可用。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
</script>

<template>
  <div>
    <h3>部分不可用</h3>
    <ProCheckCard
      title="Card title"
      description="This is the description"
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    />
    <ProCheckCard
      title="Card title"
      description="This is the description"
      disabled
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    />
    <ProCheckCard
      title="Card title"
      description="This is the description"
      disabled
      default-checked
      avatar="https://gw.alipayobjects.com/zos/bmw-prod/f601048d-61c2-44d0-bf57-ca1afe7fd92e.svg"
    />
  </div>
  <div>
    <h3>整体不可用</h3>
    <ProCheckCardGroup disabled default-value="A">
      <ProCheckCard title="Card A1" description="选项一" value="A" />
      <ProCheckCard title="Card B1" description="选项二" value="B" />
    </ProCheckCardGroup>
  </div>
</template>

<style scoped></style>
