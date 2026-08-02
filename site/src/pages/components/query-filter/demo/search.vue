<docs lang="zh-CN">
搜索
</docs>

<docs lang="en-US">
search
</docs>

<script lang="ts" setup>
import { ProFormDatePicker, ProFormGroup, ProFormText, ProQueryFilter } from '@antdv-next1/pro-components'
import { DownOutlined, UpOutlined } from '@antdv-next/icons'
import { h, shallowRef } from 'vue'

const searchText = shallowRef<string>()
const showFilter = shallowRef<boolean>(true)
const quickSearch = ['小程序开发', '入驻', 'ISV 权限']
const defaultType = shallowRef('articles')
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col gap-2">
      <a-input-search
        v-model:value="searchText"
        placeholder="请输入"
        enter-button="搜索"
        :style="{ maxWidth: 522, width: '100%' }"
      />
      <div class="flex gap-3">
        <a
          v-for="text in quickSearch" :key="text" @click="() => {
            searchText = text
          }"
        >{{ text }}</a>
      </div>
    </div>
    <a-tabs
      :default-active-key="defaultType"
      :items="[
        {
          key: 'articles',
          label: '文章',
        },
        {
          key: 'projects',
          label: '项目',
        },
        {
          key: 'applications',
          label: '应用',
        },
      ]"
      :tab-bar-extra-content="h('a', {
        style: {
          display: 'flex',
          gap: 4,
        },
        onClick: () => {
          showFilter = !showFilter
        },
      }, ['高级筛选', showFilter ? h(UpOutlined) : h(DownOutlined),
      ])"
    />
    <ProQueryFilter
      v-if="showFilter"
      :submitter="false"
      :span="24"
      label-width="auto"
      split
    >
      <ProFormGroup title="姓名">
        <ProFormText name="name" />
      </ProFormGroup>
      <ProFormGroup title="详情">
        <ProFormText name="age" label="年龄" />
        <ProFormDatePicker name="birth" label="生日" />
      </ProFormGroup>
    </ProQueryFilter>
  </div>
</template>

<style scoped></style>
