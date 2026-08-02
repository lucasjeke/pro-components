<docs lang="zh-CN">
横向布局
</docs>

<docs lang="en-US">
  Horizontal Layout
</docs>

<script lang="ts" setup>
import type { ProFormListProps } from '@antdv-next1/pro-components'
import { ProCard } from '@antdv-next1/pro-components'
import {
  ProForm,
  ProFormItem,
  ProFormList,
  ProFormText,
} from '@antdv-next1/pro-form'
import { h } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const itemRender: ProFormListProps['itemRender'] = ({ listDom, action }, { index }) => h(ProCard, { variant: 'outlined', style: { marginBlockEnd: '8px' }, title: `规格${index! + 1}`, extra: action, styles: { body: { paddingBlockEnd: 0 } } }, () => listDom)
</script>

<template>
  <div class="p-6">
    <ProForm
      name="horizontal-layout-demo"
      layout="horizontal"
      @finish="async (values) => {
        await waitTime()
        console.log(values, 'values')
      }"
    >
      <ProFormList
        name="attributes"
        label="规格"
        :creator-button-props="{
          creatorButtonText: '添加规格项',
        }"
        :min="1"
        :copy-icon-props="false"
        :item-render="itemRender"
        :creator-record="{ name: '', items: [{ name: '' }] }"
        :initial-value="[{ name: '颜色', items: [{ name: '红' }, { name: '黄' }] }]"
      >
        <ProFormText
          :style="{ padding: 0 }"
          width="md"
          name="name"
          label="规格名"
        />
        <ProFormItem is-list-field :style="{ marginBlockEnd: 0 }" label="规格值">
          <ProFormList
            name="items"
            :creator-button-props="{
              creatorButtonText: '新建',
              icon: false,
              type: 'link',
              style: { width: 'unset' },
            }"
            :min="1"
            :copy-icon-props="false"
            :delete-icon-props="{ tooltipText: '删除' }"
          >
            <template #itemRender="{ listDom, action }">
              <div :style="{ display: 'inline-flex', marginInlineEnd: '25px' }">
                <component :is="listDom" />
                <component :is="action" />
              </div>
            </template>
            <ProFormText :allow-clear="false" width="xs" :name="['name']" />
          </ProFormList>
        </ProFormItem>
      </ProFormList>
    </ProForm>
  </div>
</template>

<style scoped></style>
