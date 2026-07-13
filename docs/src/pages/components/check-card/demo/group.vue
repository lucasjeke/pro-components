<docs lang="zh-CN">
`ProCheckCard.Group` 支持通过 `options` 属性配置化来列表展示多个选项。
</docs>

<docs lang="en-US">
`ProCheckCard.Group` 支持通过 `options` 属性配置化来列表展示多个选项。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
import { Divider } from 'antdv-next'
</script>

<template>
  <div style="padding: 24px">
    <ProCheckCardGroup size="small" :options="['🍎 Apple', '🍐 Pear', '🍊 Orange']" />
    <br>
    <div>
      <ProCheckCardGroup loading size="small" :options="['🍎 Apple', '🍐 Pear', '🍊 Orange']" />
    </div>
    <br>
    <Divider />
    <ProCheckCardGroup
      size="small"
      :options="[
        {
          title: 'Fruit',
          value: 'Fruit',
          children: [
            {
              title: '🍎 Apple1',
              value: 'apple',
            },
            {
              title: '🍐 Pear1',
              value: 'pear',
            },
            {
              title: '🍊 Orange1',
              value: 'orange',
            },
          ],
        },
      ]"
    />
    <Divider />
    <br>
    <ProCheckCardGroup default-value="A">
      <ProCheckCard title="🍊 Orange" value="🍊 Orange" />
      <ProCheckCard title="🍐 Pear" value="🍐 Pear" />
      <ProCheckCard title="🍎 Apple" value="🍎 Apple" />
    </ProCheckCardGroup>
    <br>
    <Divider />
    <ProCheckCardGroup default-value="A" loading>
      <ProCheckCard title="🍊 Orange" value="🍊 Orange" />
      <ProCheckCard title="🍐 Pear" value="🍐 Pear" />
      <ProCheckCard title="🍎 Apple" value="🍎 Apple" />
    </ProCheckCardGroup>
  </div>
</template>

<style  scoped></style>
