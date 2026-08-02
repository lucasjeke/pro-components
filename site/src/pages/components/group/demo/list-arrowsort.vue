<docs lang="zh-CN">
箭头排序
</docs>

<docs lang="en-US">
arrow sort
</docs>

<script lang="ts" setup>
import {
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormText,
} from '@antdv-next1/pro-components'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
</script>

<template>
  <div class="p-6">
    <div class="flex  flex-col gap-4">
      <ProForm
        name="list-arrowsort-demo"
        @finish="async (e) => {
          await waitTime(1500);
          console.log(e)
        }"
      >
        <ProFormText name="name" label="姓名" />
        <ProFormList
          name="labels"
          label="用户信息"
          :arrow-sort="true"
          :up-icon-props="{ tooltipText: '' }"
          :initial-value="[
            {
              value: '111',
              label: '111',
            },
            {
              value: '222',
              label: '222',
            },
            {
              value: '333',
              label: '333',
            },
          ]"
        >
          <ProFormGroup key="group">
            <ProFormText name="value" label="值" />
            <ProFormText name="label" label="显示名称" />
          </ProFormGroup>
        </ProFormList>
      </ProForm>
    </div>
  </div>
</template>

<style scoped></style>
