<docs lang="zh-CN">
  自定义页脚
</docs>

<docs lang="en-US">
 custom footer
</docs>

<script lang="ts" setup>
import type { SizeType } from 'antdv-next'
import { ProFormText, ProLightFilter } from '@antdv-next1/pro-components'
import { Button } from 'antdv-next'
import { h, shallowRef } from 'vue'

const size = shallowRef<SizeType>('middle')
</script>

<template>
  <div class="m-b-4">
    <div class="m-b-6">
      <a-radio-group
        v-model:value="size"
        :options="[
          { value: 'middle', label: 'Middle' },
          { value: 'small', label: 'Small' },
        ]"
        option-type="button"
      />
    </div>
    <a-space orientation="vertical">
      <ProLightFilter
        :size="size"
        :model="{
          name: 'Jack2',
        }"
      >
        <ProFormText
          name="name"
          label="名称"
          :footer-render="(_, onClear) => h(Button, { onClick: () => {
            onClear?.()
          } }, () => '自定义footer')"
        />
      </ProLightFilter>
      <ProLightFilter
        :size="size"
        :model="{
          name: 'Jack2',
        }"
      >
        <ProFormText name="name" label="名称" :footer-render="false" />
      </ProLightFilter>
      <ProLightFilter
        :size="size"
        :model="{
          name: 'Jack2',
        }"
        collapse
        collapse-label="footer为false"
        :footer-render="false"
      >
        <ProFormText name="name" label="名称" />
      </ProLightFilter>
      <ProLightFilter
        :size="size"
        :model="{
          name: 'Jack2',
        }"
        collapse
        collapse-label="footer为false"
        :footer-render="(_, onClear) => h(Button, { onClick: () => {
          onClear?.()
        } }, () => '自定义footer')"
      >
        <ProFormText name="name" label="名称" />
      </ProLightFilter>
    </a-space>
  </div>
</template>

<style scoped></style>
