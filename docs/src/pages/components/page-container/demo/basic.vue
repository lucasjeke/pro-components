<docs lang="zh-CN">
PageContainer 提供了标准的页面布局结构
</docs>

<docs lang="en-US">
PageContainer provides standard page layout structure
</docs>

<script setup lang="ts">
import { PageContainer, ProCard } from '@antdv-next1/pro-components'
import { EllipsisOutlined } from '@antdv-next/icons'
import { Button, Dropdown } from 'antdv-next'
import { h } from 'vue'

const extra = [
  h(Button, { key: 1 }, () => 'Secondary button'),
  h(Button, { key: 2 }, () => 'Secondary button'),
  h(Button, { key: 3, type: 'primary' }, () => 'Primary button'),
  h(
    Dropdown,
    {
      key: 'dropdown',
      trigger: ['click'],
      menu: {
        items: [
          { label: 'Dropdown menu', key: '1' },
          { label: 'Dropdown menu 2', key: '2' },
          { label: 'Dropdown menu 3', key: '3' },
        ],
      },
    },
    () => h(Button, { key: 4, style: { padding: '0 8px' } }, () => h(EllipsisOutlined)),
  ),
]
</script>

<template>
  <div class="p-6">
    <div class="bg-#F5F7FA">
      <PageContainer
        :header="{
          title: 'Page Title',
          ghost: true,
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
          extra,
        }"
        tab-bar-extra-content="Test tabBarExtraContent"
        :tab-list="[
          {
            label: 'Basic information',
            key: 'base',
            closable: false,
          },
          {
            label: 'Detailed information',
            key: 'info',
          },
        ]"
        :tab-props="{
          type: 'editable-card',
          hideAdd: true,
          onEdit: (e, action) => console.log(e, action),
        }"
        :footer="[h(Button, { key: 3 }, () => 'Reset'), h(Button, { key: 4, type: 'primary' }, () => 'Submit')]"
      >
        <ProCard direction="column" ghost :gutter="[0, 16]" variant="borderless">
          <ProCard :style="{ height: '200px' }">
            Card 1
          </ProCard>
          <ProCard :gutter="16" ghost :style="{ height: '200px' }" variant="borderless">
            <ProCard :col-span="16">
              Card 2
            </ProCard>
            <ProCard :col-span="8">
              Card 3
            </ProCard>
          </ProCard>
        </ProCard>
      </PageContainer>
    </div>
  </div>
</template>

<style scoped></style>
