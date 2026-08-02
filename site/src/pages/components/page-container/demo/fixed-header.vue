<docs lang="zh-CN">
 可以固定页面头部，在内容滚动时保持可见
</docs>

<docs lang="en-US">
 You can fix the page header to keep it visible when content scrolls
</docs>

<script setup lang="ts">
import { PageContainer, ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="bg-#F5F7FA">
    <PageContainer
      fixed-header
      :header="{
        title: 'Page Title',
        breadcrumb: {
          items: [
            {
              path: '',
              title: 'Primary page',
            },
            {
              path: '',
              title: 'Secondary page',
            },
            {
              path: '',
              title: 'Current page',
            },
          ],
        },

      }"
      :tab-list="[
        {
          label: 'Selected',
          key: '1',
        },
        {
          label: 'Clickable',
          key: '2',
        },
        {
          label: 'Disabled',
          key: '3',
          disabled: true,
        },
      ]"
    >
      <ProCard direction="column" ghost :gutter="[0, 16]" variant="borderless">
        <ProCard :style="{ height: '200px' }" />
        <ProCard :gutter="16" ghost variant="borderless">
          <ProCard :col-span="16" :style="{ height: '200px' }" />
          <ProCard :col-span="8" :style="{ height: '200px' }" />
        </ProCard>
        <ProCard :gutter="16" ghost variant="borderless">
          <ProCard :col-span="8" :style="{ height: '200px' }" />
          <ProCard :col-span="16" :style="{ height: '200px' }" />
        </ProCard>
      </ProCard>
    </PageContainer>
  </div>
</template>

<style scoped></style>
