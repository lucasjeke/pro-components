<docs lang="zh-CN">
 可以隐藏面包屑导航，简化页面结构
</docs>

<docs lang="en-US">
 You can hide breadcrumb navigation to simplify page structure
</docs>

<script setup lang="ts">
import { PageContainer, ProCard } from '@antdv-next1/pro-components'
import { Descriptions } from 'antdv-next'
import { h } from 'vue'
</script>

<template>
  <div class="bg-#F5F7FA">
    <PageContainer
      ghost
      :header="{
        title: 'Page Title',
        breadcrumb: {},
      }"
      :content="h(
        Descriptions,
        {
          column: 2,
          style: {
            marginBlockEnd: ' -16',
          },
          items: [
            {
              key: 1,
              label: 'Creator',
              content: '逄一',
            },
            {
              key: 2,
              label: 'Associated form',
              content: h('a', null, '421421'),
            },
            {
              key: 3,
              label: 'Creation Date',
              content: ' 2017-01-10',
            },
            {
              key: 4,
              label: 'Document remarks',
              content: '浙江省杭州市西湖区工专路',
            },
          ],
        },
      )"
    >
      <ProCard direction="column" ghost :gutter="[0, 16]" variant="borderless">
        <ProCard :style="{ height: '200px' }" />
        <ProCard :gutter="16" ghost :style="{ height: '200px' }" variant="borderless">
          <ProCard :col-span="16">
            Card 1
          </ProCard>
          <ProCard :col-span="8">
            Card 2
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  </div>
</template>

<style scoped></style>
